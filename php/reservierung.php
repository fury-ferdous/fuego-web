<?php
/**
 * RESERVIERUNGSANFRAGEN PER E-MAIL
 * --------------------------------
 * Nimmt die Anfrage aus dem Formular entgegen und schickt sie an alle in
 * $RECIPIENTS eingetragenen Adressen. Antwortet mit demselben JSON wie die
 * Next.js-Route, damit das Formular unveraendert damit arbeiten kann.
 *
 * EINSATZ
 * Auf den Webspace legen, z. B. nach https://fuego.at/mail/reservierung.php,
 * und im Frontend in .env.local eintragen:
 *
 *   NEXT_PUBLIC_RESERVATION_ENDPOINT=https://fuego.at/mail/reservierung.php
 *
 * Alternativ serverseitig weiterleiten (Adresse bleibt dann verborgen):
 *
 *   RESERVATION_PHP_ENDPOINT=https://fuego.at/mail/reservierung.php
 *
 * VORAUSSETZUNG
 * mail() muss auf dem Hosting aktiv sein. Bei den meisten oesterreichischen
 * Anbietern (World4You, Hosttech, EasyName, All-Inkl) ist das der Fall.
 */

declare(strict_types=1);

/* ------------------------------------------------------------ EINSTELLUNGEN */

/** Alle Empfaenger stehen im To-Feld - kein Cc, damit keine Adresse untergeht. */
$RECIPIENTS = [
    'office@fuego.at',
    'dugicalko@gmail.com',
];

/**
 * Absenderadresse. MUSS auf der eigenen Domain liegen, sonst landet die Mail
 * bei Gmail zuverlaessig im Spam (SPF/DKIM schlagen sonst fehl).
 */
$FROM_ADDRESS = 'no-reply@fuego.at';
$FROM_NAME    = 'Fuego Website';

/** Betriebsname in Betreff und Bestaetigungsmail. */
$VENUE_NAME = 'Fuego Karaoke Bar Restaurant';

/** Domains, die dieses Skript aufrufen duerfen. Leer lassen = nur gleiche Domain. */
$ALLOWED_ORIGINS = [
    'https://fuego.at',
    'https://www.fuego.at',
    'http://localhost:3000',
];

/** Kurze Eingangsbestaetigung an den Gast senden? */
$SEND_CONFIRMATION = true;

/** Fruehestens alle X Sekunden eine Anfrage pro IP. 0 schaltet es ab. */
$THROTTLE_SECONDS = 20;

/* ------------------------------------------------------------------- CORS */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

/* ------------------------------------------------------------- HILFSMITTEL */

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Betreff und Namen UTF-8-sicher kodieren. */
function mimeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Header-Injection verhindern: Zeilenumbrueche in Feldern, die spaeter in
 * Mail-Headern landen, sind der klassische Angriffsweg.
 */
function singleLine(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0", '%0a', '%0d'], ' ', $value));
}

function field(array $data, string $key): string
{
    return isset($data[$key]) && is_scalar($data[$key]) ? trim((string) $data[$key]) : '';
}

/* --------------------------------------------------------------- EINGABE */

$raw  = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);

if (!is_array($data)) {
    // Fallback fuer klassisch abgeschickte Formulare
    $data = $_POST;
}

if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

// Honeypot: Bots fuellen das versteckte Feld aus. Still verwerfen, damit der
// Bot keinen Hinweis bekommt, dass er erkannt wurde.
if (field($data, 'website') !== '') {
    respond(200, ['ok' => true]);
}

/* ------------------------------------------------------------ THROTTLING */

if ($THROTTLE_SECONDS > 0) {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/fuego_res_' . md5($ip);
    // Fail-open: wenn das Dateisystem nicht mitspielt, wird nicht blockiert.
    if (@is_file($file) && (time() - (int) @filemtime($file)) < $THROTTLE_SECONDS) {
        respond(429, ['ok' => false, 'error' => 'too_many_requests']);
    }
    @touch($file);
}

/* ----------------------------------------------------------- VALIDIERUNG */

$name    = singleLine(field($data, 'name'));
$email   = singleLine(field($data, 'email'));
$phone   = singleLine(field($data, 'phone'));
$date    = singleLine(field($data, 'date'));
$time    = singleLine(field($data, 'time'));
$guests  = singleLine(field($data, 'guests'));
$type    = singleLine(field($data, 'type'));
$room    = singleLine(field($data, 'room'));
$message = trim(field($data, 'message'));

$missing = [];
foreach (['name' => $name, 'email' => $email, 'phone' => $phone, 'date' => $date,
          'time' => $time, 'guests' => $guests, 'type' => $type] as $key => $value) {
    if ($value === '') {
        $missing[] = $key;
    }
}

if ($missing) {
    respond(422, ['ok' => false, 'error' => 'missing_fields', 'missing' => $missing]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'invalid_email']);
}

if (mb_strlen($message) > 2000) {
    $message = mb_substr($message, 0, 2000) . ' […]';
}

$typeLabels = [
    'restaurant' => 'Restaurant',
    'karaoke'    => 'Karaoke Room',
    'beides'     => 'Restaurant + Karaoke',
];
$typeLabel = $typeLabels[$type] ?? $type;

/* ----------------------------------------------------------- NACHRICHT */

$lines = [
    'Neue Reservierungsanfrage über die Website',
    str_repeat('=', 42),
    '',
    'Art:        ' . $typeLabel,
];

if ($room !== '') {
    $lines[] = 'Raum:       ' . $room;
}

$lines = array_merge($lines, [
    'Datum:      ' . $date,
    'Uhrzeit:    ' . $time,
    'Personen:   ' . $guests,
    '',
    'Name:       ' . $name,
    'Telefon:    ' . $phone,
    'E-Mail:     ' . $email,
]);

if ($message !== '') {
    $lines[] = '';
    $lines[] = 'Nachricht:';
    $lines[] = $message;
}

$lines = array_merge($lines, [
    '',
    str_repeat('-', 42),
    'Eingegangen: ' . date('d.m.Y H:i') . ' Uhr',
    'Absender-IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt'),
    '',
    'Zum Antworten einfach auf diese Mail antworten – die Adresse des Gastes',
    'ist als Reply-To hinterlegt.',
]);

$body    = implode("\r\n", $lines);
$subject = sprintf('Reservierung: %s · %s %s · %s Pers.', $typeLabel, $date, $time, $guests);

$headers = implode("\r\n", [
    'From: ' . mimeHeader($FROM_NAME) . ' <' . $FROM_ADDRESS . '>',
    'Reply-To: ' . mimeHeader($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: fuego-website',
]);

$to = implode(', ', $RECIPIENTS);

// Envelope-Sender setzen: verbessert die Zustellbarkeit deutlich. Lehnt der
// Host den Parameter ab, wird ohne ihn gesendet.
$sent = @mail($to, mimeHeader($subject), $body, $headers, '-f' . $FROM_ADDRESS);
if (!$sent) {
    $sent = @mail($to, mimeHeader($subject), $body, $headers);
}

if (!$sent) {
    error_log('[fuego] Reservierung konnte nicht versendet werden an: ' . $to);
    respond(502, ['ok' => false, 'error' => 'delivery_failed']);
}

/* -------------------------------------------------- BESTÄTIGUNG AN GAST */

if ($SEND_CONFIRMATION) {
    $guestBody = implode("\r\n", [
        'Hallo ' . $name . ',',
        '',
        'deine Anfrage ist bei uns eingegangen. Wichtig: Sie ist damit noch',
        'nicht bestätigt – wir melden uns persönlich bei dir, sobald wir den',
        'Termin geprüft haben.',
        '',
        'Deine Angaben:',
        '  Art:      ' . $typeLabel,
        ($room !== '' ? '  Raum:     ' . $room : ''),
        '  Datum:    ' . $date,
        '  Uhrzeit:  ' . $time,
        '  Personen: ' . $guests,
        '',
        'Wenn etwas nicht stimmt, antworte einfach auf diese E-Mail.',
        '',
        $VENUE_NAME,
        'Jagdgasse 4, 1100 Wien',
        '0664 99689261',
        'office@fuego.at',
    ]);

    $guestHeaders = implode("\r\n", [
        'From: ' . mimeHeader($VENUE_NAME) . ' <' . $FROM_ADDRESS . '>',
        'Reply-To: ' . $RECIPIENTS[0],
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Auto-Submitted: auto-replied',
    ]);

    // Schlaegt die Bestaetigung fehl, ist die Anfrage trotzdem angekommen.
    @mail($email, mimeHeader('Deine Anfrage bei ' . $VENUE_NAME), $guestBody, $guestHeaders, '-f' . $FROM_ADDRESS);
}

respond(200, ['ok' => true]);
