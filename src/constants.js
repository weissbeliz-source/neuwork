// =============================================
// DESIGN TOKENS — Diffusion
// Basis: Dunkelblau, Akzente: Lila, Grün, Gelb
// Font: Schibsted Grotesk (Google Fonts)
// =============================================
export const COLORS = {
  bg: "#0F172A",
  bgCard: "#1E293B",
  bgInput: "#162032",
  border: "#334155",
  borderHover: "#475569",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  purple: "#A78BFA",
  purpleBg: "#A78BFA1A",
  purpleBorder: "#A78BFA33",
  green: "#4ADE80",
  greenBg: "#4ADE801A",
  greenBorder: "#4ADE8033",
  yellow: "#FDE047",
  yellowBg: "#FDE0471A",
  yellowBorder: "#FDE04733",
  red: "#F87171",
  redBg: "#F871711A",
};

export const FONT = "'Schibsted Grotesk', 'Inter', system-ui, sans-serif";

// =============================================
// NAVIGATION
// =============================================
export const NAV_ITEMS = [
  { id: "profil", label: "Profil" },
  { id: "foerder", label: "Fördercheck" },
  { id: "jobs", label: "Jobs" },
  { id: "vorbilder", label: "Vorbilder" },
  { id: "pinnwand", label: "Pinnwand" },
];

export const WAITLIST_URL =
  "https://2dc38334.sibforms.com/serve/MUIFAPKpOnstY_-htfpGf8fSuN_3L6kSak_nq5bhpByLgceCY8Y4ELFy6yuneqI_G573gDtR1KAmb5Fkk7WHrhGXc3Ymc91KV9F95wvezX667FuUj-Q0XPJKutk5kc11IMYiH8umCTSuum50v4T5evlteY7oFAwPo05t1ZzxiUOtcTggYVSF4FtdLP1TZBYHjqLXC8vnMXFOX0hNlA==";

// =============================================
// STÄRKEN
// =============================================
export const TAG_OPTIONS = {
  // Persönliche Stärken
  strengths_personal: [
    // Klassische Soft Skills
    "Empathisch", "Analytisch", "Kreativ", "Fokussiert", "Detailorientiert",
    "Strategisch", "Zuverlässig", "Kommunikationsstark", "Strukturiert",
    "Lösungsorientiert", "Teamfähig", "Lernbereit", "Verantwortungsbewusst",
    "Engagiert", "Eigeninitiative", "Sorgfältig", "Offen", "Geduldig",
    "Ausdauernd", "Zielorientiert", "Selbständig", "Organisationstalent",
    "Durchhaltevermögen", "Fleißig", "Pünktlich", "Ehrlich", "Humorvoll",
    "Warmherzig", "Ruhig & besonnen", "Belastbar", "Hilfsbereit",
    "Loyal", "Direkt",
    // Neurodivergenz-Stärken
    "Hyperfokus", "Mustererkennung", "Außergewöhnliche Detailwahrnehmung",
    "Tiefes Fachwissen in Spezialgebieten", "Ehrlich und direkt",
    "Kreatives Querdenken", "Hohe Konzentrationsfähigkeit",
    "Systemdenken", "Originalität & unkonventionelle Ideen",
    "Hohes Gerechtigkeitsgefühl", "Ausdauer bei Interessen",
    // Stärken bei geistiger Behinderung / Lernschwierigkeiten
    "Zuverlässig bei vertrauten Aufgaben",
    "Ausdauer bei Routinetätigkeiten",
    "Freude an handwerklicher Arbeit",
    "Konzentration auf konkrete Aufgaben",
    "Freude an wiederholenden Tätigkeiten",
    "Freundlich auf Menschen zugehen",
    // Stärken bei psychischer Behinderung / chronischer Erkrankung
    "Einfühlungsvermögen durch eigene Erfahrungen",
    "Resilienz & Widerstandskraft",
    "Tiefes Verständnis für andere in Krisen",
    "Achtsamkeit & Selbstreflexion",
    "Kreativität als Verarbeitungsstrategie",
  ],

  // Wie andere mich erleben
  strengths_others: [
    "Bin ein Sonnenschein im Team",
    "Verlässliche Ansprechperson",
    "Bringt frische Perspektiven",
    "Macht Kompliziertes einfach",
    "Denkt ums Eck",
    "Stellt die richtigen Fragen",
    "Bemerkt was andere übersehen",
    "Hält zusammen was auseinanderfällt",
    "Bringt das Team zum Lachen",
    "Motiviert andere",
    "Hat immer ein offenes Ohr",
    "Bringt Ruhe rein",
    "Findet immer eine Lösung",
    "Man kann sich auf mich verlassen",
    "Tut einfach — ohne viel Aufhebens",
    "Merkt sofort wenn jemand Hilfe braucht",
    "Schafft angenehme Atmosphäre",
    "Bringt Energie ins Team",
    "Denkt an Details die andere vergessen",
  ],

  // Besondere Fähigkeiten
  strengths_special: [
    "Hyperfokus auf Interessengebiete",
    "Mustererkennung in Daten / Systemen",
    "Systemdenken — sieht das große Bild",
    "Außergewöhnliches Gedächtnis",
    "Kreatives Problemlösen",
    "Mehrsprachigkeit",
    "Hohe Belastbarkeit bei Routineaufgaben",
    "Schnelles Erlernen neuer Fertigkeiten",
    "Präzision bei handwerklichen Tätigkeiten",
    "Räumliches Denken",
    "Körperliche Ausdauer",
    "Feines Gespür für Stimmungen",
    "Technisches Verständnis",
    "Mathematisches Denken",
    "Ästhetisches Feingefühl",
    "Strukturiertes Denken",
  ],

  // Fachliche Stärken (nach Berufsfeld)
  strengths_professional: [
    // Digital & Tech
    "Programmieren", "Webentwicklung", "Datenanalyse", "IT-Support",
    "UX/UI-Design", "Social-Media-Management", "SEO / SEA",
    "Videobearbeitung", "KI-Tools", "Excel / Tabellenkalkulation",
    // Kreativ
    "Grafikdesign", "Illustration", "Fotografie", "Nähen / Schneidern",
    "Handwerkliche Gestaltung", "Floristik",
    // Sprache & Kommunikation
    "Schreiben / Texten", "Übersetzen", "Dolmetschen",
    "Gebärdensprache (DGS)", "Moderieren", "Präsentieren",
    // Organisation
    "Projektmanagement", "Buchhaltung", "Büroorganisation",
    "Eventmanagement", "Logistik", "Qualitätssicherung",
    // Wirtschaft & Recht
    "BWL-Kenntnisse", "Marketing", "Vertrieb", "Kundenbetreuung",
    "Beratung", "Rechtskenntnisse",
    // Soziales & Pädagogik
    "Pflege / Betreuung", "Unterrichten", "Coaching",
    "Sozialarbeit", "Gruppenleitung", "Konfliktmoderation",
    // Handwerk & Technik
    "Holzbearbeitung", "Metallverarbeitung", "Kfz-Technik",
    "Elektroinstallation", "Reparieren / Upcycling", "3D-Druck",
    // Natur & Haushalt
    "Gartenbau / Pflanzenpflege", "Tierpflege", "Kochen / Backen",
    "Haushaltsorganisation", "Reinigung & Hygiene",
    // Aktivismus & Gesellschaft
    "Community Organizing", "Advocacy / Öffentlichkeitsarbeit",
    "Vereinsarbeit / Ehrenamt", "Politische Bildung",
    // Spiritualität
    "Meditation / Achtsamkeit", "Ritualgestaltung", "Seelsorge",
  ],

  // Skills (Tools & konkrete Fähigkeiten)
  skills: [
    // Hilfsjobs & Einfachstätigkeiten (oft vergessen!)
    "Waren einräumen / Lagerhaltung", "Reinigung & Haushaltsführung",
    "Botengänge / Auslieferung", "Gartenarbeit / Rasenpflege",
    "Paketdienst / Sortierung", "Küchenhilfe / Spülen",
    "Kassiertätigkeit", "Regalauffüllen", "Verpackungsarbeiten",
    "Sortiertätigkeiten", "Aktenvernichtung / Archiv",
    "Tierpflege-Assistenz", "Wäscherei / Bügeln",
    "Fahrzeugpflege / Autowaschen", "Hausmeisterdienste",
    "Einkaufshelfer:in", "Botschaften überbringen",
    "Licht- und Tontechnik-Assistenz", "Auf- und Abbauhelfer:in",
    "Küchenhilfe / Catering-Assistenz",
    // Zoo & Tierberufe
    "Tierpflege Zoo / Wildgehege", "Hundepension / -training",
    "Pferdebetreuung / Stallarbeit", "Kleintierversorgung",
    "Schäferei / Viehhaltung", "Imkerei",
    "Aquaristik / Terrarienpflege", "Veterinärassistenz",
    "Tiergestützte Pädagogik",
    // Auto & Fahrzeug
    "Kfz-Mechatronik", "Kfz-Elektrik", "Fahrzeugdiagnose",
    "Lackierung / Karosseriebau", "Reifenservice",
    "Fahrzeugaufbereitung / Autowaschen", "Fuhrparkmanagement",
    "Berufskraftfahrer:in (Lkw / Bus)", "Gabelstaplerführerschein",
    "Lieferfahrer:in",
    // Politik & Gesellschaft
    "Kommunalpolitik", "Parteiarbeit", "Wahlkampfarbeit",
    "Stadtplanung", "Entwicklungspolitik", "Friedensarbeit",
    "Menschenrechtsarbeit", "Antirassismusarbeit",
    "Queer-Aktivismus", "Behindertenrechte-Advocacy",
    "Klimaaktivismus", "Tierschutz-Aktivismus",
    "Petitions- und Kampagnenarbeit",
    // Gastronomie & Hotel
    "Kochen (professionell)", "Barista / Kaffeespezialitäten",
    "Kellnern / Service", "Catering", "Patisserie / Backen",
    "Hotellerie / Rezeption", "Housekeeping",
    // Medien & Kultur
    "Moderation (TV / Radio / Podcast)", "Regie / Bühnentechnik",
    "Musikunterricht / Musizieren", "Aufnahmetechnik",
    "Songwriting", "Tanz / Choreografie",
    // Wissenschaft
    "Recherche / Literaturrecherche", "Statistik / Auswertung",
    "Laborarbeit", "Wissenschaftliches Schreiben",
    "Feldforschung", "Archivarbeit",
    // Gesundheit
    "Erste Hilfe", "Physiotherapie", "Ergotherapie",
    "Medizinische Dokumentation", "Ernährungsberatung",
    // Digital allgemein
    "Microsoft Office", "Google Workspace", "Figma", "Canva",
    "Python", "SQL", "WordPress", "Shopify",
  ],

  // Arbeitsstil
  work_style: [
    "Async", "Schriftlich", "Mit klaren Aufgaben",
    "Mit viel Fokuszeit", "Eigenständig", "Im kleinen Team",
    "Remote", "Hybrid", "Mit Planbarkeit", "Kreativ frei",
    "Mit visuellen Tools", "Mit klaren Deadlines",
    "Mit Routinen", "Iterativ", "Mit direktem Feedback",
    "Ohne viele Meetings", "Mit Schritt-für-Schritt-Anleitung",
    "Mit konkreten Beispielen", "Mit Bewegungspausen",
  ],

  // Kommunikation
  communication: [
    "Schriftlich statt Telefon", "E-Mail bevorzugt",
    "Chat bevorzugt (z.B. Slack)", "Keine spontanen Anrufe",
    "Vorab-Agenda bei Meetings", "Async statt Echtzeit",
    "Klare und direkte Sprache", "Einfache Sprache",
    "Visuelle Erklärungen", "Schriftliche Zusammenfassungen nach Meetings",
    "Gebärdensprache (DGS)", "Kommunikationshilfe / AAC",
    "Text-to-Speech / Screen Reader",
    "Mehr Zeit zum Antworten", "Keine Gruppenrunden",
  ],

  // Hilfsmittel
  assistive_tech: [
    "Screenreader (z.B. NVDA, JAWS)", "Sprachsteuerung (z.B. Dragon)",
    "Hörhilfe / Cochlea-Implantat", "Vergrößerungssoftware",
    "Tastaturbedienung statt Maus", "Ergonomische Tastatur / Maus",
    "Höhenverstellbarer Tisch", "Zeitmanagement-Apps",
    "Noise-Cancelling-Kopfhörer", "Fidget-Tools",
    "Rollstuhl", "Gehhilfe / Rollator",
    "Kommunikationsgerät / AAC", "Gebärdensprachdolmetscher:in",
    "Leichte-Sprache-Unterstützung", "Vorlesefunktion",
  ],

  // Bedürfnisse (für TagField)
  needs: [
    "Flexible Zeiten", "Teilzeit möglich", "Remote möglich",
    "Hybrid möglich", "Asynchrone Kommunikation",
    "Schriftliche Kommunikation", "Klare Kommunikation",
    "Klare Prioritäten", "Klare Aufgabenbeschreibung",
    "Klare Deadlines", "Vorhersehbare Abläufe", "Feste Routinen",
    "Strukturierte Einarbeitung", "Buddy / Ansprechperson",
    "Job-Coaching", "Zusätzliche Check-ins",
    "Mehr Bearbeitungszeit", "Angepasste Zielvorgaben",
    "Flexible Pausen", "Zusätzliche Pausen",
    "Weniger Meetings", "Meetings nur mit Agenda",
    "Protokolle nach Meetings", "Aufgaben in kleinen Schritten",
    "Erinnerungen / Prompts", "Einzelgespräche statt Gruppenrunden",
    "Reizarme Umgebung", "Ruhiger Arbeitsplatz", "Einzelbüro",
    "Ruheraum", "Noise-Cancelling erlaubt", "Kopfhörer erlaubt",
    "Keine Kamera-Pflicht", "Wenig Kontextwechsel",
    "Ununterbrochene Fokuszeit", "Visuelle Planungs-Tools",
    "Schriftliche Briefings", "Keine spontanen Anrufe",
    "Vorbereitung vor Meetings", "Masking-freie Kultur",
    "Psychologische Sicherheit", "Sensorische Rücksichtnahme",
    "Reduzierte soziale Pflichttermine",
    "Barrierefreier Eingang", "Aufzug", "Rampe",
    "Automatische Türen", "Breite Wege / Türen",
    "Rollstuhlgerechter Arbeitsplatz", "Höhenverstellbarer Tisch",
    "Ergonomischer Stuhl", "Angepasste Arbeitsmittel",
    "Kurze Wege im Büro", "Parkplatz in der Nähe",
    "Barrierefreie Toilette", "Homeoffice statt Pendeln",
    "Screenreader-kompatible Tools", "Tastaturbedienbare Software",
    "Große Schrift", "Hoher Kontrast", "Vergrößerungssoftware",
    "Vorlesefunktionen", "Gute Beleuchtung", "Blendfreies Licht",
    "Untertitel / Captions", "Live-Transkription",
    "Gebärdensprachdolmetschung", "Schriftliche Zusammenfassungen",
    "Chat statt Telefon", "Visuelle Alarme",
    "Einfache Sprache", "Leichte Sprache",
    "Schritt-für-Schritt-Anleitungen", "Visuelle Anleitungen",
    "Mehr Zeit zum Lernen", "Flexible Startzeiten",
    "Späterer Arbeitsbeginn", "Pacing / Energiemanagement",
    "Sitz- und Stehoption", "Temperaturkontrolle",
    "Zugang zu Wasser / Snacks / Medikamenten",
    "Termine um Behandlungen herum", "Reduzierte Reisetätigkeit",
    "Arbeiten von zuhause bei Schub / Erschöpfung",
    "Weniger Lärm", "Weniger grelles Licht",
    "Parfümarme Umgebung", "Fester Sitzplatz",
    "Rückzugsort bei Überlastung",
  ],
};

// Bedürfnisse nach Kategorien
export const NEED_CATEGORIES = [
  {
    title: "Organisation & Kommunikation",
    tags: ["Flexible Zeiten", "Teilzeit möglich", "Remote möglich", "Hybrid möglich",
      "Asynchrone Kommunikation", "Schriftliche Kommunikation", "Klare Kommunikation",
      "Klare Prioritäten", "Klare Aufgabenbeschreibung", "Klare Deadlines",
      "Vorhersehbare Abläufe", "Feste Routinen", "Strukturierte Einarbeitung",
      "Buddy / Ansprechperson", "Job-Coaching", "Zusätzliche Check-ins",
      "Mehr Bearbeitungszeit", "Angepasste Zielvorgaben", "Flexible Pausen",
      "Zusätzliche Pausen", "Weniger Meetings", "Meetings nur mit Agenda",
      "Protokolle nach Meetings", "Aufgaben in kleinen Schritten",
      "Erinnerungen / Prompts", "Einzelgespräche statt Gruppenrunden"],
  },
  {
    title: "Neurodivergenz & Reizregulation",
    tags: ["Reizarme Umgebung", "Ruhiger Arbeitsplatz", "Einzelbüro", "Ruheraum",
      "Noise-Cancelling erlaubt", "Kopfhörer erlaubt", "Keine Kamera-Pflicht",
      "Wenig Kontextwechsel", "Ununterbrochene Fokuszeit", "Visuelle Planungs-Tools",
      "Schriftliche Briefings", "Keine spontanen Anrufe", "Vorbereitung vor Meetings",
      "Masking-freie Kultur", "Psychologische Sicherheit", "Sensorische Rücksichtnahme",
      "Reduzierte soziale Pflichttermine", "Weniger Lärm", "Weniger grelles Licht",
      "Parfümarme Umgebung", "Fester Sitzplatz", "Rückzugsort bei Überlastung"],
  },
  {
    title: "Mobilität & Barrierefreiheit",
    tags: ["Barrierefreier Eingang", "Aufzug", "Rampe", "Automatische Türen",
      "Breite Wege / Türen", "Rollstuhlgerechter Arbeitsplatz", "Höhenverstellbarer Tisch",
      "Ergonomischer Stuhl", "Angepasste Arbeitsmittel", "Kurze Wege im Büro",
      "Parkplatz in der Nähe", "Barrierefreie Toilette", "Homeoffice statt Pendeln"],
  },
  {
    title: "Sehen",
    tags: ["Screenreader-kompatible Tools", "Tastaturbedienbare Software", "Große Schrift",
      "Hoher Kontrast", "Vergrößerungssoftware", "Vorlesefunktionen",
      "Gute Beleuchtung", "Blendfreies Licht"],
  },
  {
    title: "Hören",
    tags: ["Untertitel / Captions", "Live-Transkription", "Gebärdensprachdolmetschung",
      "Schriftliche Zusammenfassungen", "Chat statt Telefon", "Visuelle Alarme"],
  },
  {
    title: "Lernen & Verstehen",
    tags: ["Einfache Sprache", "Leichte Sprache", "Schritt-für-Schritt-Anleitungen",
      "Visuelle Anleitungen", "Mehr Zeit zum Lernen"],
  },
  {
    title: "Energie, Gesundheit & Belastung",
    tags: ["Flexible Startzeiten", "Späterer Arbeitsbeginn", "Pacing / Energiemanagement",
      "Sitz- und Stehoption", "Temperaturkontrolle",
      "Zugang zu Wasser / Snacks / Medikamenten", "Termine um Behandlungen herum",
      "Reduzierte Reisetätigkeit", "Arbeiten von zuhause bei Schub / Erschöpfung"],
  },
];

export const createTagField = () => ({ tags: [], custom: "" });

export const EMPTY_PROFILE = {
  full_name: "",
  headline: "",
  bio: "",
  strengths: createTagField(),
  strengths_professional: createTagField(),
  strengths_others: createTagField(),
  strengths_special: createTagField(),
  special_interests: "",
  work_style: createTagField(),
  communication_prefs: createTagField(),
  assistive_tech: createTagField(),
  needs: createTagField(),
  skills: createTagField(),
  experience: "",
  education: "",
  languages: "",
  availability: "",
  contact_info: "",
  work_model: "",
  looking_for_work: false,
  avatar_url: "",
  has_disability_id: false,
  disability_degree: "",
  support_needs: "",
  is_rolemodel: false,
  rolemodel_tags: "",
};

export const ROLEMODEL_TAGS = [
  "Neurodivergent", "ADHS", "Autismus", "Körperbehinderung",
  "Sehbehinderung", "Hörbehinderung", "Chronische Erkrankung",
  "Psychische Erkrankung", "Lernschwierigkeit", "ME/CFS",
  "Geistige Behinderung", "Mehrfachbehinderung",
];

// Jobs (Beispieldaten — später aus DB)
export const JOBS = [
  { id: 1, title: "UX Researcher", company: "Klara GmbH", tags: ["Remote", "Flexible Zeiten", "Ruhiges Büro"], type: "Vollzeit", color: "#4ADE80", match: 94, desc: "Nutzerbedürfnisse erforschen mit Einfühlungsvermögen. Kein Daily-Standup-Zwang, async-first." },
  { id: 2, title: "Backend Entwickler:in", company: "Softalpha", tags: ["Hybrid", "Masking-frei", "ADHS-freundlich"], type: "Teilzeit möglich", color: "#A78BFA", match: 87, desc: "Python/Django. Schriftliche Kommunikation, Meetings nur wenn nötig." },
  { id: 3, title: "Grafikdesign & Illustration", company: "Bunte Welt Verlag", tags: ["Remote", "Async", "Keine Kamera-Pflicht"], type: "Freelance", color: "#FDE047", match: 81, desc: "Kinderbuchillustrationen. Klare schriftliche Briefings, respektvoller Umgang." },
  { id: 4, title: "Gartenpflege & Grünflächenpflege", company: "Stadtgärtnerei Ulm", tags: ["Vor Ort", "Routinearbeit", "Kleine Teams"], type: "Vollzeit", color: "#4ADE80", match: 90, desc: "Pflege öffentlicher Grünflächen. Feste Routinen, klare Aufgaben, überschaubares Team." },
  { id: 5, title: "Lager & Logistik-Assistenz", company: "Paketzentrum GmbH", tags: ["Teilzeit möglich", "Feste Routinen", "Klare Aufgaben"], type: "Teilzeit / Vollzeit", color: "#FDE047", match: 85, desc: "Sortierung und Einlagerung. Klare Strukturen, kein Kundenkontakt nötig." },
];

export const COMPANIES = [
  { id: 1, name: "Klara GmbH", sector: "UX & Design", badge: "Zertifiziert inklusiv", checks: ["Neurodivergenz-Awareness-Training", "Flexible Arbeitszeiten", "Ruhezonen", "Async-First"], employees: "45–60", color: "#4ADE80" },
  { id: 2, name: "Softalpha", sector: "Software & IT", badge: "ADHS-freundlich", checks: ["Kein Masking erwartet", "Kopfhörer-freundlich", "Schriftliche Kommunikation"], employees: "20–35", color: "#A78BFA" },
  { id: 3, name: "auticon Deutschland", sector: "IT-Consulting", badge: "Spezialisiert auf Autismus", checks: ["Von Autisten gegründet", "100% neurodivergente Mitarbeitende", "Job-Coaches inklusive"], employees: "200+", color: "#4ADE80" },
];
