/**
 * INHALTSDATEN
 * ------------
 * Raeume, Speisekarte, Galerie, FAQ und Bewertungen.
 * Preise und Kapazitaeten stammen von der bestehenden Reservierungsseite.
 * Preise bitte bei jeder Aenderung hier pflegen - sie stehen sonst nirgends.
 */

/* ------------------------------------------------------------------ RÄUME */

export type KaraokeRoom = {
  slug: string;
  name: string;
  /** Kurzform der Ausstattung, wie im Betrieb benannt. */
  type: string;
  capacity: number;
  capacityLabel: string;
  fromPrice: number;
  /** Zusammenfassung fuer Karte und Meta-Description. */
  short: string;
  description: string;
  features: string[];
  /** Verknuepfung in die 360°-Tour, sofern eine Szene vorhanden ist. */
  sceneId?: string;
  image?: string;
  /** Preistabelle: [So–Do 3h, Fr–So 3h, So–Do 4h, Fr–So 4h] */
  pricing: [number, number, number, number];
};

export const karaokeRooms: KaraokeRoom[] = [
  {
    slug: "kyoto",
    name: "Kyoto",
    type: "Privater Raum",
    capacity: 6,
    capacityLabel: "bis 6 Personen",
    fromPrice: 138,
    short: "Der ruhigste der sieben Räume. Für kleine Runden, die es ernst meinen.",
    description:
      "Kyoto ist der kleinste unserer privaten Räume und dadurch der intimste. Kein Publikum, keine Bühne, kein Zwang zur Show – nur eure Gruppe, das Mikrofon und die Playlist. Ideal für vier bis sechs Personen, die einen Abend lang unter sich bleiben wollen.",
    features: ["Privater Raum", "Eigene Sound- und Lichtsteuerung", "Eigene Speise- und Getränkekarte", "Tischservice"],
    sceneId: "ktv-01",
    image: "/rooms/kyoto.webp",
    pricing: [138, 168, 198, 258],
  },
  {
    slug: "barbie",
    name: "Barbie",
    type: "Privater Raum",
    capacity: 7,
    capacityLabel: "bis 7 Personen",
    fromPrice: 138,
    short: "Der lauteste Raum in der kleinen Kategorie. Farbe, Licht, kein Understatement.",
    description:
      "Ein Themenraum für Gruppen, die den Abend nicht leise angehen. Bis zu sieben Personen, kräftige Farben, viel Licht – der Raum, der auf Fotos am meisten hergibt und für Geburtstage am häufigsten gebucht wird.",
    features: ["Privater Raum", "Themenausstattung", "Eigene Speise- und Getränkekarte", "Tischservice"],
    sceneId: "ktv-02",
    image: "/rooms/barbie.webp",
    pricing: [138, 168, 198, 258],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    type: "Privater Raum",
    capacity: 7,
    capacityLabel: "bis 7 Personen",
    fromPrice: 188,
    short: "Gleiche Größe wie Barbie, deutlich anderes Temperament.",
    description:
      "Dunkler, dichter, urbaner. Tokyo arbeitet mit wenig Grundlicht und viel Akzent – der Raum, den Gruppen wählen, die eher Late-Night-Stimmung als Partyfarben wollen. Bis zu sieben Personen.",
    features: ["Privater Raum", "Themenausstattung", "Eigene Speise- und Getränkekarte", "Tischservice"],
    sceneId: "ktv-03",
    image: "/rooms/tokyo.webp",
    pricing: [188, 248, 288, 338],
  },
  {
    slug: "squid-game",
    name: "Squid Game",
    type: "Bühne",
    capacity: 8,
    capacityLabel: "bis 8 Personen",
    fromPrice: 218,
    short: "Erster Raum mit eigener Bühne. Ab hier wird performt.",
    description:
      "Der Einstieg in die Bühnen-Kategorie: eine erhöhte Fläche, auf der man wirklich steht statt sitzt. Bis zu acht Personen, ausgelegt auf Gruppen, in denen mindestens eine Person das Mikrofon nicht mehr hergibt.",
    features: ["Eigene Bühne", "Privater Raum", "Themenausstattung", "Eigene Speise- und Getränkekarte"],
    sceneId: "ktv-04",
    image: "/rooms/squid-game.webp",
    pricing: [218, 278, 338, 388],
  },
  {
    slug: "moulin-rouge",
    name: "Moulin Rouge",
    type: "Bühne",
    capacity: 10,
    capacityLabel: "bis 10 Personen",
    fromPrice: 258,
    short: "Samt, Rot, Bühne. Der theatralischste Raum im Haus.",
    description:
      "Tiefes Rot, weiche Stoffe, eine Bühne mit Auftrittscharakter. Für Gruppen bis zehn Personen, die einen Abend mit etwas Inszenierung wollen – Jubiläen, Junggesellenabschiede, runde Geburtstage.",
    features: ["Eigene Bühne", "Privater Raum", "Themenausstattung", "Eigene Speise- und Getränkekarte"],
    image: "/rooms/moulin-rouge.webp",
    pricing: [258, 298, 398, 468],
  },
  {
    slug: "gatsby",
    name: "Gatsby",
    type: "Bühne",
    capacity: 14,
    capacityLabel: "bis 14 Personen",
    fromPrice: 258,
    short: "Der Raum für die größere Runde, ohne dass es nach Saal aussieht.",
    description:
      "Vierzehn Personen, eine Bühne und trotzdem das Gefühl eines privaten Raums. Gatsby ist die übliche Wahl für Firmenfeiern, bei denen niemand an einem Konferenztisch sitzen möchte.",
    features: ["Eigene Bühne", "Privater Raum", "Themenausstattung", "Für Firmenfeiern geeignet"],
    image: "/rooms/gatsby.webp",
    pricing: [258, 298, 398, 468],
  },
  {
    slug: "whisky-club",
    name: "Whisky Club",
    type: "Bühne & Billard",
    capacity: 20,
    capacityLabel: "bis 20 Personen",
    fromPrice: 338,
    short: "Der größte Raum. Bühne, Billardtisch, eigener Abend.",
    description:
      "Zwanzig Personen, eine Bühne und ein Billardtisch – der einzige Raum, in dem man den Abend auch verbringen kann, ohne durchgehend zu singen. Die Wahl für große Gruppen, die nicht auf zwei Räume aufgeteilt werden wollen.",
    features: ["Eigene Bühne", "Billardtisch", "Größter privater Raum", "Für Firmenfeiern geeignet"],
    image: "/rooms/whisky-club.webp",
    pricing: [338, 388, 488, 558],
  },
];

export const getRoom = (slug: string) => karaokeRooms.find((r) => r.slug === slug);

export const priceColumns = [
  "So – Do · ab 16:00 · 3 Std.",
  "Fr – So & Feiertage · ab 16:00 · 3 Std.",
  "So – Do · ab 19:00 · 4 Std.",
  "Fr – So & Feiertage · ab 19:00 · 4 Std.",
];

/* ------------------------------------------------------------- FOOD STORY */

export type FoodChapter = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
};

export const foodChapters: FoodChapter[] = [
  {
    id: "sushi-pizza",
    eyebrow: "Signature",
    title: "Sushi Pizza",
    text: "Knuspriger Sushi-Reis als Boden, darauf Lachs, Avocado und moderne Toppings. Das Gericht, das am häufigsten fotografiert und am zweithäufigsten nachbestellt wird.",
    image: "/food/sushi-pizza.webp",
  },
  {
    id: "sushi-burger",
    eyebrow: "Fusion",
    title: "Sushi Burger",
    text: "Japanische Zutaten in Burgerform. Kein Gag, sondern die logische Konsequenz aus zwei Küchenlinien, die im selben Haus arbeiten.",
    image: "/food/sushi-burger.webp",
  },
  {
    id: "sushi-tacos",
    eyebrow: "Zum Teilen",
    title: "Sushi Tacos",
    text: "Crispy Shell trifft Sushi. Gedacht für die Mitte des Tisches, nicht für den eigenen Teller.",
    image: "/food/sushi-tacos.webp",
  },
  {
    id: "pasta",
    eyebrow: "Italienische Linie",
    title: "Pasta",
    text: "Die zweite Küche im Haus. Klassiker, sauber gemacht, mit modernem Twist – für alle, die am Sushi-Abend kein Sushi wollen.",
    image: "/food/pasta.webp",
  },
  {
    id: "burger",
    eyebrow: "Comfort",
    title: "Burger",
    text: "Comfort Food, neu interpretiert. Der sichere Griff für die Person in jeder Gruppe, die sich nicht festlegen will.",
    image: "/food/burger.webp",
  },
  {
    id: "cocktails",
    eyebrow: "Bar",
    title: "Signature Cocktails",
    text: "Die Bar arbeitet bis spät. Signature Drinks für den Abend, alkoholfreie Varianten für alle, die morgen früh raus müssen.",
    image: "/food/cocktails.webp",
  },
];

/* ------------------------------------------------------------ SPEISEKARTE */

export type MenuCategory = {
  id: string;
  label: string;
  intro: string;
  items: { name: string; note?: string; price?: string }[];
};

/**
 * Preise stehen bewusst nicht drin - sie liegen nur im offiziellen PDF vor
 * und werden hier erst ergaenzt, wenn sie bestaetigt sind. Lieber keine
 * Zahl als eine falsche.
 */
export const menuCategories: MenuCategory[] = [
  {
    id: "sushi",
    label: "Sushi",
    intro: "Eigene Sushi-Linie mit eigenem Küchenchef.",
    items: [{ name: "Nigiri" }, { name: "Maki" }, { name: "Special Rolls" }, { name: "Sashimi" }],
  },
  {
    id: "sushi-pizza",
    label: "Sushi Pizza",
    intro: "Knuspriger Sushi-Reis als Basis.",
    items: [{ name: "Sushi Pizza Lachs" }, { name: "Sushi Pizza Avocado" }, { name: "Sushi Pizza Special" }],
  },
  {
    id: "sushi-burger",
    label: "Sushi Burger",
    intro: "Japanese Fusion in Burgerform.",
    items: [{ name: "Sushi Burger Lachs" }, { name: "Sushi Burger Crispy Chicken" }],
  },
  {
    id: "sushi-tacos",
    label: "Sushi Tacos",
    intro: "Crispy Shell × Sushi. Zum Teilen gedacht.",
    items: [{ name: "Sushi Tacos Lachs" }, { name: "Sushi Tacos Tuna" }, { name: "Sushi Tacos Veggie" }],
  },
  {
    id: "pizza",
    label: "Pizza",
    intro: "Aus der italienischen Küchenlinie.",
    items: [{ name: "Margherita" }, { name: "Diavola" }, { name: "Tartufo" }],
  },
  {
    id: "pasta",
    label: "Pasta",
    intro: "Klassiker mit modernem Twist.",
    items: [{ name: "Tagliatelle" }, { name: "Ravioli" }, { name: "Spaghetti" }],
  },
  {
    id: "burger",
    label: "Burger",
    intro: "Comfort Food, neu interpretiert.",
    items: [{ name: "Signature Burger" }, { name: "Chicken Burger" }, { name: "Veggie Burger" }],
  },
  {
    id: "dessert",
    label: "Dessert",
    intro: "Der Abschluss vor dem Karaoke-Raum.",
    items: [{ name: "Dessert des Hauses" }],
  },
  {
    id: "cocktails",
    label: "Cocktails",
    intro: "Signature Drinks aus der Bar.",
    items: [{ name: "Signature Cocktails" }, { name: "Klassiker" }, { name: "Longdrinks" }],
  },
  {
    id: "alkoholfrei",
    label: "Alkoholfrei",
    intro: "Ohne Alkohol, ohne Kompromiss.",
    items: [{ name: "Mocktails" }, { name: "Hausgemachte Limonaden" }, { name: "Softdrinks" }],
  },
];

/* ---------------------------------------------------------------- GALERIE */

export type GalleryItem = { src: string; alt: string; span: "tall" | "wide" | "square" };

export const galleryItems: GalleryItem[] = [
  { src: "/gallery/01.webp", alt: "Blick in den Restaurantbereich am Abend", span: "tall" },
  { src: "/gallery/02.webp", alt: "Sushi Pizza auf dunklem Teller", span: "square" },
  { src: "/gallery/03.webp", alt: "Bar mit Flaschenwand", span: "wide" },
  { src: "/gallery/04.webp", alt: "Privater Karaoke-Raum mit Bühne", span: "tall" },
  { src: "/gallery/05.webp", alt: "Signature Cocktail in Nahaufnahme", span: "square" },
  { src: "/gallery/06.webp", alt: "Gäste im Karaoke-Raum", span: "square" },
  { src: "/gallery/07.webp", alt: "Detail der Innenarchitektur", span: "wide" },
  { src: "/gallery/08.webp", alt: "Sushi Tacos zum Teilen", span: "square" },
  { src: "/gallery/09.webp", alt: "Lounge-Bereich mit warmem Licht", span: "tall" },
];

/* -------------------------------------------------------------------- FAQ */

export const faqs = [
  {
    q: "Muss ich für einen Karaoke-Raum reservieren?",
    a: "Ja. Die sieben Räume sind privat und werden nur komplett vergeben – spontan frei ist selten etwas, besonders am Wochenende. Reservierungen sind ab 16:00 möglich.",
  },
  {
    q: "Kann ich nur essen, ohne Karaoke?",
    a: "Natürlich. Restaurant und Bar funktionieren unabhängig von den privaten Räumen. Du kannst auch beides kombinieren: erst essen, danach in den Raum.",
  },
  {
    q: "Wie viele Personen passen in einen Raum?",
    a: "Zwischen sechs und zwanzig, je nach Raum. Die kleinste Einheit ist Kyoto mit bis zu sechs Personen, die größte der Whisky Club mit bis zu zwanzig.",
  },
  {
    q: "Was kostet ein privater Karaoke-Raum?",
    a: "Die Preise gelten pro Raum und starten bei 138 € für drei Stunden. Sie richten sich nach Raum, Wochentag und Startzeit. Feiertage werden wie Wochenendtarife berechnet. Speisen und Getränke sind nicht in der Raummiete enthalten.",
  },
  {
    q: "Gibt es eine eigene Karte für die Karaoke-Räume?",
    a: "Ja, für die privaten Räume gibt es eine eigene Speise- und Getränkekarte mit Tischservice direkt im Raum.",
  },
  {
    q: "Eignet sich die Location für Firmenfeiern?",
    a: "Ja. Gatsby und Whisky Club sind auf größere Gruppen ausgelegt, und auf knapp 1.000 m² lassen sich Essen und Programm an einem Ort verbinden – ohne Ortswechsel am Abend.",
  },
  {
    q: "Wo genau ist die Location?",
    a: "In der Jagdgasse 4 in 1100 Wien, in Favoriten. Die 360°-Tour auf dieser Seite zeigt die Räume vorab.",
  },
];

/* -------------------------------------------------------------- REVIEWS */

export type Review = { author: string; text: string; source: string; date?: string };

/**
 * BEWUSST LEER.
 * Hier gehoeren ausschliesslich echte, zitierfaehige Bewertungen hinein.
 * Solange das Array leer ist, verlinkt die Seite auf das Google-Profil,
 * statt Bewertungen zu erfinden.
 */
export const reviews: Review[] = [];
