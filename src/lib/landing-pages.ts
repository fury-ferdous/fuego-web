/**
 * SEO-LANDINGPAGES
 * ----------------
 * Fuenf Seiten, fuenf unterschiedliche Fragen. Keine Seite wiederholt den
 * Text einer anderen - sonst wertet Google sie zu Recht als Doorway-Pages
 * ab und der Aufwand kehrt sich ins Gegenteil.
 */

export type LandingBlock = { heading: string; body: string[] };

export type LandingPage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  blocks: LandingBlock[];
  showRooms?: boolean;
  showPriceTable?: boolean;
  showMenu?: boolean;
  showTour?: boolean;
};

export const landingPages: LandingPage[] = [
  {
    slug: "karaoke-wien",
    metaTitle: "Karaoke Wien – private Räume statt offener Bühne",
    metaDescription:
      "Karaoke in Wien im privaten Raum: sieben Räume für 6 bis 20 Personen in 1100 Wien, ab 138 € pro Raum. Vorab in der 360°-Tour ansehen.",
    eyebrow: "Karaoke in Wien",
    h1: "Karaoke in Wien, ohne fremdes Publikum",
    lede: "Es gibt zwei Arten, in Wien Karaoke zu singen. Diese Seite erklärt den Unterschied – und für wen welche passt.",
    blocks: [
      {
        heading: "Offene Bühne oder privater Raum",
        body: [
          "In den klassischen Karaoke-Bars der Stadt singt man vor allen Gästen. Ein DJ führt eine Liste, man wartet auf den Aufruf und tritt vor Fremden auf. Das hat seinen Reiz – und schreckt einen Teil jeder Gruppe zuverlässig ab.",
          "Die zweite Variante ist der private Raum, in Asien seit Jahrzehnten Standard und in Wien noch immer die Ausnahme. Die Gruppe bekommt eine eigene Tür, eine eigene Anlage und einen eigenen Abend. Niemand hört zu, der nicht eingeladen ist. Genau so funktionieren unsere sieben Räume.",
        ],
      },
      {
        heading: "Was das praktisch bedeutet",
        body: [
          "Es gibt keine Wartezeit auf den nächsten Slot, weil es keine gemeinsame Liste gibt. Es gibt keine Aufwärmphase, weil niemand mithört. Und es gibt keinen Zwang zu singen – in jeder Gruppe sitzt jemand, der nur zusehen und trinken will, und der hat hier genauso Platz.",
          "Bestellt wird direkt im Raum. Für die privaten Räume gibt es eine eigene Speise- und Getränkekarte, der Service kommt zu euch statt umgekehrt.",
        ],
      },
      {
        heading: "Für welche Anlässe das funktioniert",
        body: [
          "Am häufigsten gebucht werden Geburtstage, Junggesellenabschiede und Firmenfeiern. Bei Firmenfeiern ist der praktische Vorteil der größte: Essen und Programm liegen am selben Ort, es gibt keinen Ortswechsel um 22 Uhr und niemand verliert die Hälfte der Gruppe unterwegs.",
          "Reservierungen sind ab 16:00 möglich, das letzte Zeitfenster endet um 04:00. Am Wochenende sind die größeren Räume regelmäßig Wochen im Voraus vergeben.",
        ],
      },
    ],
    showRooms: true,
    showPriceTable: true,
    showTour: true,
  },

  {
    slug: "karaoke-raeume-wien",
    metaTitle: "Karaoke-Raum mieten in Wien – 7 Räume, 6 bis 20 Personen",
    metaDescription:
      "Karaoke-Raum in Wien mieten: sieben private Räume von 6 bis 20 Personen, Preise ab 138 € pro Raum, Zeitfenster ab 16:00. Alle Räume im Überblick.",
    eyebrow: "Raum mieten",
    h1: "Welcher Karaoke-Raum passt zu eurer Gruppe?",
    lede: "Sieben Räume, drei Größenklassen und ein Preismodell, das sich nach Wochentag und Startzeit richtet. Hier steht, wie ihr den richtigen findet.",
    blocks: [
      {
        heading: "Zuerst die Gruppengröße",
        body: [
          "Die Räume werden komplett vergeben, nicht nach Personen abgerechnet. Für vier Personen einen Zwanzig-Personen-Raum zu mieten funktioniert also – lohnt sich aber selten. Umgekehrt wird es eng: die angegebene Kapazität ist die tatsächliche Obergrenze, nicht ein Richtwert.",
          "Bis 7 Personen: Kyoto, Barbie oder Tokyo. Bis 14 Personen: Squid Game, Moulin Rouge oder Gatsby. Bis 20 Personen: Whisky Club, der einzige Raum mit Billardtisch.",
        ],
      },
      {
        heading: "Dann die Frage nach der Bühne",
        body: [
          "Vier der sieben Räume haben eine eigene Bühne. Das klingt nach einem Detail, verändert den Abend aber spürbar: Auf einer Bühne steht man, im Raum ohne Bühne sitzt man. Gruppen, in denen ohnehin alle mitsingen, sind auf der Bühne besser aufgehoben. Gruppen, die eher reden und zwischendurch singen, im Raum ohne.",
        ],
      },
      {
        heading: "Zum Schluss Termin und Zeitfenster",
        body: [
          "Es gibt zwei Längen: drei Stunden ab 16:00 oder vier Stunden ab 19:00. Der Preis hängt davon ab, welche Länge ihr wählt und ob Wochentag oder Wochenende. Feiertage werden wie Wochenendtarife berechnet.",
          "Alle Preise gelten pro Raum. Speisen und Getränke werden separat abgerechnet und sind in der Raummiete nicht enthalten.",
        ],
      },
    ],
    showRooms: true,
    showPriceTable: true,
  },

  {
    slug: "fusion-restaurant-wien",
    metaTitle: "Fusion Restaurant Wien – zwei Küchen unter einem Dach",
    metaDescription:
      "Fusion-Restaurant in 1100 Wien: eine Küchenlinie für Sushi und asiatische Gerichte, eine für italienische Klassiker. Dazu Bar und private Räume.",
    eyebrow: "Fusion Kitchen",
    h1: "Warum hier zwei Küchen nebeneinander arbeiten",
    lede: "Die meisten Fusion-Konzepte scheitern daran, dass eine Küche alles machen soll. Wir haben es anders gelöst.",
    blocks: [
      {
        heading: "Zwei Linien statt einer Kompromissküche",
        body: [
          "Fusion bedeutet in vielen Lokalen: eine Küche versucht, mehrere Welten gleichzeitig abzudecken, und wird in keiner richtig gut. Bei uns arbeiten zwei getrennte Küchenlinien mit jeweils eigenem Küchenchef – eine für Sushi und asiatisch inspirierte Gerichte, eine für italienische Klassiker.",
          "Das ist teurer und aufwendiger als die Kompromissvariante. Es ist aber der einzige Weg, auf dem beide Richtungen ihre Handschrift behalten, statt sich gegenseitig zu verwässern.",
        ],
      },
      {
        heading: "Wo sich die Linien treffen",
        body: [
          "Die eigentliche Fusion passiert dort, wo beide Küchen dieselbe Idee unterschiedlich denken. Sushi Pizza, Sushi Burger und Sushi Tacos sind genau das: japanische Zutaten in europäischen Formaten, entstanden aus zwei Teams, die sich im selben Haus über den Weg laufen.",
        ],
      },
      {
        heading: "Warum das für Gruppen zählt",
        body: [
          "Der praktische Effekt zeigt sich am Tisch. In fast jeder größeren Runde sitzt jemand, der kein Sushi isst, und jemand, der genau deswegen gekommen ist. Eine Karte, die beides ernst nimmt, löst diese Diskussion, bevor sie anfängt.",
        ],
      },
    ],
    showMenu: true,
    showTour: true,
  },

  {
    slug: "sushi-wien",
    metaTitle: "Sushi Wien – Sushi Pizza, Sushi Burger & Sushi Tacos",
    metaDescription:
      "Sushi in 1100 Wien mit eigener Sushi-Linie: Nigiri, Maki und Special Rolls, dazu Sushi Pizza, Sushi Burger und Sushi Tacos zum Teilen.",
    eyebrow: "Sushi",
    h1: "Sushi, das nicht nur als Sushi serviert wird",
    lede: "Die klassische Karte gibt es. Interessanter sind die drei Gerichte, die es so in Wien kaum ein zweites Mal gibt.",
    blocks: [
      {
        heading: "Die klassische Seite",
        body: [
          "Nigiri, Maki, Sashimi und Special Rolls kommen aus einer eigenen Sushi-Linie mit eigenem Küchenchef – nicht als Nebenprodukt einer Küche, die hauptsächlich etwas anderes macht.",
        ],
      },
      {
        heading: "Sushi Pizza",
        body: [
          "Ein Boden aus knusprig gebratenem Sushi-Reis, darauf Lachs, Avocado und Toppings. Das Gericht wird geteilt, nicht allein gegessen, und ist der häufigste erste Bestellwunsch am Tisch.",
        ],
      },
      {
        heading: "Sushi Burger und Sushi Tacos",
        body: [
          "Beim Sushi Burger ersetzt gepresster Sushi-Reis das Brötchen. Bei den Sushi Tacos sitzt die Füllung in einer knusprigen Schale, die man in zwei Bissen isst – gedacht für die Mitte des Tisches, wo alle zugreifen.",
          "Alle drei Gerichte funktionieren besonders gut vor einem Abend im Karaoke-Raum: Sie lassen sich teilen, brauchen kein Besteck und machen nicht so satt, dass danach niemand mehr aufsteht.",
        ],
      },
    ],
    showMenu: true,
  },

  {
    slug: "restaurant-wien",
    metaTitle: "Restaurant Wien Favoriten – Essen, Bar und Karaoke an einem Ort",
    metaDescription:
      "Restaurant in 1100 Wien mit Fusion-Küche, Bar und sieben privaten Karaoke-Räumen auf knapp 1.000 m². Für Gruppen, Geburtstage und Firmenfeiern.",
    eyebrow: "Restaurant Wien",
    h1: "Ein Restaurant, in dem der Abend nicht nach dem Essen endet",
    lede: "Knapp 1.000 m² in Wien-Favoriten – groß genug, dass Essen, Bar und Programm nicht an drei Adressen stattfinden müssen.",
    blocks: [
      {
        heading: "Das Problem mit dem Ortswechsel",
        body: [
          "Der klassische Ablauf: Tisch um 19 Uhr, gegen 22 Uhr Rechnung, dann die Diskussion, wohin es weitergeht. Erfahrungsgemäß verliert man dabei ein Drittel der Gruppe – die einen sind müde, die anderen finden keinen Platz mehr.",
          "Auf unserer Fläche liegt beides nebeneinander. Ihr esst im Restaurantbereich und geht danach durch eine Tür weiter, statt in ein Taxi zu steigen.",
        ],
      },
      {
        heading: "Für wen die Fläche gebaut ist",
        body: [
          "Für Runden zwischen sechs und zwanzig Personen. Kleinere Gruppen sitzen im Restaurant und nehmen danach einen der kleinen privaten Räume. Größere Gruppen buchen Gatsby oder den Whisky Club und kombinieren Essen und Programm von Anfang an.",
        ],
      },
      {
        heading: "Lage und Anfahrt",
        body: [
          "Die Location liegt in der Jagdgasse 4 in 1100 Wien, in Favoriten. Wer die Räume vor der Reservierung sehen will, findet auf der Startseite eine 360°-Tour durch Restaurant, Bar und die privaten Räume.",
        ],
      },
    ],
    showTour: true,
    showRooms: true,
  },
];

export const getLandingPage = (slug: string) => landingPages.find((page) => page.slug === slug);
