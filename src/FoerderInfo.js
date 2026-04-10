import { useState } from "react";
import { COLORS, FONT } from "./constants";

// ─────────────────────────────────────────────
// DATEN
// ─────────────────────────────────────────────

const FOERDER_KARTEN = {
  arbeit: [
    {
      id: "eingliederungszuschuss",
      titel: "Eingliederungszuschuss",
      was: "Dein Arbeitgeber bekommt einen Zuschuss zum Lohn — weil die Einarbeitung aufwändiger sein kann.",
      fuerWen: "Menschen mit Behinderung die einen neuen Job anfangen.",
      zustaendig: "Agentur für Arbeit",
      kontakt: "Agentur für Arbeit",
      alternativ: "Jobcenter",
      naechsterSchritt: "Arbeitgeber muss VOR Vertragsabschluss einen Antrag stellen — daran erinnern!",
      hinweis: "⚠️ Antrag muss vor dem ersten Arbeitstag gestellt werden.",
      hoehe: "Bis zu 70 % des Lohns",
      dauer: "Bis zu 2 Jahre",
      icon: "💰",
      color: COLORS.green,
    },
    {
      id: "arbeitsassistenz",
      titel: "Arbeitsassistenz",
      was: "Eine Person unterstützt dich bei der Arbeit — z.B. liest vor, reicht Dinge an, übersetzt. Du leitest sie an.",
      fuerWen: "Menschen mit Schwerbehinderung (GdB 50+). Rechtsanspruch — das Amt muss bewilligen.",
      zustaendig: "Integrationsamt / Inklusionsamt",
      kontakt: "Integrationsamt (regional — suche 'Integrationsamt [deine Stadt]'),",
      alternativ: "EUTB (→ teilhabeberatung.de)",
      naechsterSchritt: "Antrag beim Integrationsamt stellen.",
      hinweis: "💡 Rechtsanspruch — das Amt hat kein Ermessen.",
      icon: "👥",
      color: COLORS.purple,
    },
    {
      id: "budget-arbeit",
      titel: "Budget für Arbeit",
      was: "Alternative zur Werkstatt (WfbM): Arbeit auf dem ersten Arbeitsmarkt mit Lohnkostenzuschuss für den Arbeitgeber.",
      fuerWen: "Menschen die berechtigt wären in einer WfbM zu arbeiten, aber lieber auf dem freien Arbeitsmarkt arbeiten möchten.",
      zustaendig: "Reha-Träger / Eingliederungshilfe",
      kontakt: "Eingliederungshilfe (Sozialamt)",
      alternativ: "Agentur für Arbeit",
      naechsterSchritt: "→ teilhabeberatung.de (EUTB) oder Eingliederungshilfe beim Sozialamt.",
      hinweis: "💡 Bis zu 75 % des Lohns für den Arbeitgeber.",
      icon: "🏭",
      color: COLORS.yellow,
    },
    {
      id: "unterstuetzte-beschaeftigung",
      titel: "Unterstützte Beschäftigung",
      was: "Individuelle Begleitung direkt im Betrieb (bis 2 Jahre) + danach Berufsbegleitung so lange nötig.",
      fuerWen: "Menschen die noch keinen passenden Job gefunden haben oder aus einer WfbM wechseln möchten.",
      zustaendig: "Agentur für Arbeit + Integrationsamt",
      kontakt: "Agentur für Arbeit",
      alternativ: "EUTB (→ teilhabeberatung.de)",
      naechsterSchritt: "Bei der Agentur für Arbeit als reha-bedürftig anerkennen lassen.",
      hinweis: "💡 Jobcoaching mindestens 1× pro Woche inklusive.",
      icon: "🌱",
      color: COLORS.green,
    },
    {
      id: "jobcoaching",
      titel: "Job-Coaching",
      was: "Ein Coach begleitet dich direkt am Arbeitsplatz — bei Kommunikation mit Kolleg:innen, Krisen, Einarbeitung oder zwischenmenschlichen Herausforderungen.",
      fuerWen: "Menschen mit Behinderung oder Neurodivergenz die Unterstützung am Arbeitsplatz brauchen — auch bei sozialen und zwischenmenschlichen Schwierigkeiten.",
      zustaendig: "Integrationsamt / Agentur für Arbeit / Reha-Träger",
      kontakt: "Integrationsamt (regional — suche 'Integrationsamt [deine Stadt]'),",
      alternativ: "EUTB (teilhabeberatung.de) / Integrationsfachdienst",
      naechsterSchritt: "Beim Integrationsamt oder der Agentur für Arbeit nach Job-Coaching fragen.",
      hinweis: "💡 Kann ein ganzes Arbeitsleben lang gewährt werden — auch präventiv bei Konflikten.",
      icon: "🎯",
      color: COLORS.purple,
    },
    {
      id: "bem",
      titel: "Betriebliches Eingliederungsmanagement (BEM)",
      was: "Nach mehr als 6 Wochen Krankenstand muss der Arbeitgeber ein BEM-Gespräch anbieten. Ziel: Arbeitsplatz erhalten.",
      fuerWen: "Alle Beschäftigten die länger als 6 Wochen krank waren.",
      zustaendig: "Arbeitgeber (Pflicht)",
      kontakt: "Betriebsrat oder Schwerbehindertenvertretung",
      alternativ: "Integrationsamt",
      naechsterSchritt: "Teilnahme ist freiwillig — kann aber sehr hilfreich sein.",
      hinweis: "💡 Freiwillig — aber sinnvoll um den Arbeitsplatz zu sichern.",
      icon: "🤝",
      color: COLORS.purple,
    },
    {
      id: "kuendigungsschutz",
      titel: "Besonderer Kündigungsschutz",
      was: "Eine Kündigung ist nur mit vorheriger Zustimmung des Integrationsamts wirksam.",
      fuerWen: "Menschen mit Schwerbehinderung (GdB 50+) oder Gleichstellung.",
      zustaendig: "Integrationsamt",
      kontakt: "Integrationsamt (regional — suche 'Integrationsamt [deine Stadt]'),",
      alternativ: "Fachanwalt für Arbeitsrecht",
      naechsterSchritt: "Bei Kündigung sofort handeln — Frist für Klage: 3 Wochen!",
      hinweis: "⚠️ 3-Wochen-Frist für Kündigungsschutzklage unbedingt einhalten.",
      icon: "🛡",
      color: COLORS.red || "#F87171",
    },
    {
      id: "zusatzurlaub",
      titel: "Zusatzurlaub",
      was: "5 zusätzliche Urlaubstage pro Jahr (bei 5-Tage-Woche).",
      fuerWen: "Menschen mit Schwerbehinderung (GdB 50+).",
      zustaendig: "Arbeitgeber (Pflicht)",
      kontakt: "Arbeitgeber schriftlich informieren",
      alternativ: "Schwerbehindertenvertretung",
      naechsterSchritt: "Schriftlich beim Arbeitgeber geltend machen — Kopie des Ausweises beilegen.",
      hinweis: "💡 Gilt ab dem Tag der Feststellung durch das Versorgungsamt.",
      icon: "📅",
      color: COLORS.green,
    },
    {
      id: "gleichstellung",
      titel: "Gleichstellung beantragen",
      was: "Mit GdB 30–49 kann Gleichstellung mit Schwerbehinderung beantragt werden — dann gelten u.a. Kündigungsschutz und mehr.",
      fuerWen: "Menschen mit GdB 30–49 die ohne Gleichstellung keinen geeigneten Arbeitsplatz finden oder halten können.",
      zustaendig: "Agentur für Arbeit",
      kontakt: "Agentur für Arbeit",
      alternativ: "EUTB (→ teilhabeberatung.de)",
      naechsterSchritt: "Antrag online auf arbeitsagentur.de: Suchbegriff 'Gleichstellungsantrag'.",
      hinweis: "💡 Arbeitgeber wird nicht informiert.",
      icon: "⚖",
      color: COLORS.yellow,
    },
  ],

  ausbildung: [
    {
      id: "budget-ausbildung",
      titel: "Budget für Ausbildung",
      was: "Ausbildung im normalen Betrieb statt in einer Werkstatt — mit Erstattung der Ausbildungsvergütung.",
      fuerWen: "Menschen mit Behinderung als Alternative zur WfbM-Ausbildung.",
      zustaendig: "Reha-Träger",
      kontakt: "Agentur für Arbeit",
      alternativ: "Eingliederungshilfe",
      naechsterSchritt: "Beratung bei der Agentur für Arbeit oder EUTB (teilhabeberatung.de).",
      hinweis: "💡 Begleitung am Ausbildungsplatz ist inklusive.",
      icon: "📚",
      color: COLORS.purple,
    },
    {
      id: "fachpraktiker",
      titel: "Fachpraktiker-Ausbildung (theoriereduziert)",
      was: "Eine anerkannte Ausbildung mit angepassten Anforderungen — weniger Theorie, gleiche Praxis. Echter Berufsabschluss.",
      fuerWen: "Menschen die eine reguläre Ausbildung kognitiv oder psychisch nicht schaffen würden.",
      zustaendig: "Agentur für Arbeit / Reha-Träger",
      kontakt: "Agentur für Arbeit (Reha-Beratung)",
      alternativ: "IHK / HWK",
      naechsterSchritt: "Reha-Status beantragen bei der Agentur für Arbeit.",
      hinweis: "💡 Echter anerkannter Abschluss — keine Sackgasse!",
      icon: "🔧",
      color: COLORS.green,
    },
    {
      id: "ausbildungszuschuss",
      titel: "Ausbildungszuschuss für Betriebe",
      was: "Betriebe die Menschen mit Behinderung ausbilden können Zuschüsse erhalten — bis zu 100 % der Ausbildungsvergütung.",
      fuerWen: "Ausbildungsbetriebe — kann helfen einen Ausbildungsplatz zu finden.",
      zustaendig: "Agentur für Arbeit",
      kontakt: "Agentur für Arbeit",
      alternativ: "Integrationsamt",
      naechsterSchritt: "Potenziellen Betrieb auf diesen Zuschuss hinweisen.",
      hinweis: "💡 Gut als Argument bei der Ausbildungsplatzsuche.",
      icon: "🎓",
      color: COLORS.yellow,
    },
  ],

  schule: [
    {
      id: "nachteilsausgleich-schule",
      titel: "Nachteilsausgleich in der Schule",
      was: "Anpassung der Bedingungen ohne Absenkung der Anforderungen — z.B. mehr Zeit, ruhiger Raum, andere Prüfungsform.",
      fuerWen: "Schüler:innen mit Behinderung, chronischer Erkrankung oder Neurodivergenz. Ab GdB 30 Rechtsanspruch — auch mit ärztlichem Attest möglich.",
      zustaendig: "Schule / Schulamt",
      kontakt: "Klassenleitung oder Schulleitung",
      alternativ: "Schulamt / Schwerbehindertenvertretung",
      naechsterSchritt: "Schriftlich bei der Schule beantragen — ärztliches Attest oder GdB-Bescheid beifügen.",
      hinweis: "💡 Auch ohne GdB mit Diagnose möglich — z.B. bei ADHS, Legasthenie, Dyskalkulie.",
      icon: "📖",
      color: COLORS.purple,
    },
    {
      id: "schulbegleitung",
      titel: "Schulbegleitung / Schulassistenz",
      was: "Eine Person begleitet dich in der Schule und hilft im Alltag — z.B. bei Mobilität, Kommunikation oder Organisation.",
      fuerWen: "Schüler:innen mit erheblichem Assistenzbedarf.",
      zustaendig: "Eingliederungshilfe (Jugendamt oder Sozialamt)",
      kontakt: "Jugendamt",
      alternativ: "Schule / Sozialamt",
      naechsterSchritt: "Antrag beim Jugendamt oder Sozialamt stellen.",
      hinweis: "💡 Antrag frühzeitig stellen — Bearbeitung dauert.",
      icon: "🏫",
      color: COLORS.green,
    },
  ],

  studium: [
    {
      id: "nachteilsausgleich-studium",
      titel: "Nachteilsausgleich im Studium",
      was: "Mehr Zeit bei Prüfungen, alternative Prüfungsformen, Einzelprüfung, Homeoffice bei Vorlesungen — je nach Bedarfen.",
      fuerWen: "Studierende mit Behinderung, chronischer Erkrankung oder Neurodivergenz.",
      zustaendig: "Hochschule / Prüfungsamt",
      kontakt: "Behindertenbeauftragte:r der Hochschule",
      alternativ: "Studentenwerk / Studierendenberatung",
      naechsterSchritt: "Beratungstermin beim Behindertenbeauftragten der Hochschule vereinbaren.",
      hinweis: "💡 Jede Hochschule hat eine Ansprechperson — oft beim Studierendenwerk.",
      icon: "🎓",
      color: COLORS.purple,
    },
    {
      id: "studienhilfen",
      titel: "Hilfsmittel & Assistenz im Studium",
      was: "Technische Hilfsmittel, Gebärdensprachdolmetscher:in, Vorlese-Software, Schreibassistenz — je nach Bedarf.",
      fuerWen: "Studierende mit Behinderung.",
      zustaendig: "Studentenwerk / Reha-Träger",
      kontakt: "Studentenwerk",
      alternativ: "Agentur für Arbeit (Reha-Beratung)",
      naechsterSchritt: "Beim Studentenwerk und beim Behindertenbeauftragten nachfragen.",
      hinweis: "💡 Auch Prüfungsanpassungen für Angststörungen oder psychische Erkrankungen möglich.",
      icon: "🔬",
      color: COLORS.green,
    },
  ],

  alltag: [
    {
      id: "gdb-beantragen",
      titel: "Schwerbehinderung / GdB beantragen",
      was: "Feststellung des Grades der Behinderung (GdB) — Grundlage für viele Nachteilsausgleiche und Förderungen.",
      fuerWen: "Menschen mit dauerhafter Beeinträchtigung. Ab GdB 20 steuerliche Vorteile. Ab GdB 50 Schwerbehindertenausweis.",
      zustaendig: "Versorgungsamt",
      kontakt: "Versorgungsamt in deiner Stadt",
      alternativ: "VdK / SoVD (helfen beim Antrag)",
      naechsterSchritt: "Online-Antrag beim Versorgungsamt stellen — dauert ca. 3–6 Monate.",
      hinweis: "💡 Ab GdB 30–49 ggf. Gleichstellung möglich.",
      icon: "📋",
      color: COLORS.yellow,
    },
    {
      id: "persoenliches-budget",
      titel: "Persönliches Budget",
      was: "Du bekommst Geld direkt — und kannst dir selbst Assistenz und Unterstützung organisieren statt vorgegebene Leistungen zu nutzen.",
      fuerWen: "Menschen mit Behinderung die selbst entscheiden möchten wie und durch wen sie unterstützt werden.",
      zustaendig: "Reha-Träger (je nach Leistung verschiedene)",
      kontakt: "EUTB (→ teilhabeberatung.de)",
      alternativ: "Sozialamt / Eingliederungshilfe",
      naechsterSchritt: "→ teilhabeberatung.de — kostenlos, anonym, überall in Deutschland verfügbar.",
      hinweis: "💡 Mehr Selbstbestimmung — aber auch mehr Eigenverantwortung.",
      icon: "🪙",
      color: COLORS.purple,
    },
    {
      id: "assistenz-alltag",
      titel: "Assistenz im Alltag & bei Teilhabe",
      was: "Unterstützung im Alltag — z.B. Einkaufen, Freizeitgestaltung, soziale Kontakte, Mobilität.",
      fuerWen: "Menschen mit erheblichem Assistenzbedarf im Alltag.",
      zustaendig: "Eingliederungshilfe (Sozialamt)",
      kontakt: "Sozialamt / Eingliederungshilfe",
      alternativ: "EUTB (→ teilhabeberatung.de)",
      naechsterSchritt: "Antrag auf Leistungen der Eingliederungshilfe beim Sozialamt stellen.",
      hinweis: "💡 Auch für Freizeit, Ehrenamt und soziale Teilhabe möglich.",
      icon: "🌍",
      color: COLORS.green,
    },
    {
      id: "ehrenamt",
      titel: "Ehrenamt & gesellschaftliche Teilhabe",
      was: "Unterstützung für ehrenamtliches Engagement — auch Assistenz beim Ehrenamt kann gefördert werden.",
      fuerWen: "Menschen mit Behinderung die sich engagieren möchten.",
      zustaendig: "Eingliederungshilfe / Sozialamt",
      kontakt: "Sozialamt",
      alternativ: "Freiwilligenagentur in deiner Stadt",
      naechsterSchritt: "Beim Sozialamt nach Assistenz bei gesellschaftlicher Teilhabe fragen.",
      hinweis: "💡 Ehrenamt zählt als Teilhabe — auch das ist förderfähig.",
      icon: "🙌",
      color: COLORS.yellow,
    },
    {
      id: "rpk",
      titel: "RPK — Medizinisch-berufliche Rehabilitation",
      was: "Intensive Reha für Menschen mit psychischer Erkrankung — Kombination aus Therapie und beruflicher Vorbereitung.",
      fuerWen: "Menschen mit schwerer psychischer Erkrankung die beruflich wieder Fuß fassen möchten.",
      zustaendig: "Rentenversicherung oder Krankenversicherung",
      kontakt: "Hausarzt / Psychiater — Einweisung nötig",
      alternativ: "EUTB (teilhabeberatung.de) / Reha-Träger",
      naechsterSchritt: "Mit Hausarzt oder Psychiater über RPK sprechen und Antrag bei der Rentenversicherung stellen.",
      hinweis: "💡 Dauert meist 12–24 Monate — sehr effektiv bei psychischen Erkrankungen.",
      icon: "💚",
      color: COLORS.green,
    },
    {
      id: "neurodivergenz",
      titel: "Unterstützung bei Neurodivergenz",
      was: "Konkrete Hilfen bei ADHS, Autismus, Legasthenie u.a. — z.B. Nachteilsausgleich, Job-Coaching, Hilfsmittel, angepasste Kommunikation.",
      fuerWen: "Menschen mit Neurodivergenz — auch ohne offiziellen GdB möglich.",
      zustaendig: "Je nach Bereich: Schule, Hochschule, Arbeitgeber, Agentur für Arbeit",
      kontakt: "EUTB (→ teilhabeberatung.de)",
      alternativ: "Autismus-Beratungsstellen / ADHS-Selbsthilfe",
      naechsterSchritt: "EUTB kontaktieren: teilhabeberatung.de — die helfen beim nächsten Schritt.",
      hinweis: "💡 Nicht nur über Diagnosen denken — konkrete Bedarfe sind entscheidend.",
      icon: "🧩",
      color: COLORS.purple,
    },
    {
      id: "teilhabeplanung",
      titel: "Teilhabeplanung — Alle Träger an einen Tisch",
      was: "Wenn mehrere Hilfen gleichzeitig gebraucht werden, kann eine Gesamtplanung mit allen Trägern sinnvoll sein.",
      fuerWen: "Menschen die gleichzeitig Hilfen in mehreren Bereichen brauchen (Schule/Arbeit + Alltag + Psyche etc.).",
      zustaendig: "Eingliederungshilfe koordiniert",
      kontakt: "EUTB (→ teilhabeberatung.de)",
      alternativ: "Sozialamt / Behindertenbeauftragter",
      naechsterSchritt: "EUTB kontaktieren: teilhabeberatung.de — Bedarf schildern, nächsten Schritt klären.",
      hinweis: "💡 Du hast das Recht auf einen Teilhabeplan der alle Hilfen koordiniert.",
      icon: "🗂",
      color: COLORS.yellow,
    },
  ],
};

const LEBENSBEREICHE = [
  { id: "check", label: "🎯 Förder-Check", desc: "Passende Hilfen finden" },
  { id: "arbeit", label: "💼 Arbeit", desc: "Jobs & Förderungen" },
  { id: "ausbildung", label: "🔧 Ausbildung", desc: "Berufseinstieg" },
  { id: "schule", label: "📖 Schule", desc: "Nachteilsausgleich" },
  { id: "studium", label: "🎓 Studium", desc: "Hochschule" },
  { id: "kontakt", label: "📞 Wer hilft?", desc: "Zuständigkeiten" },
];

const CHECK_FRAGEN = [
  {
    id: "bereich",
    frage: "In welchem Bereich brauchst du gerade Unterstützung?",
    typ: "multi",
    optionen: ["Arbeit / Job suchen", "Ausbildung", "Schule", "Studium", "Alltag & Freizeit", "Gesundheit & Psyche"],
  },
  {
    id: "gdb",
    frage: "Hast du einen anerkannten Grad der Behinderung (GdB)?",
    typ: "single",
    optionen: ["Ja, GdB 50+ (Schwerbehindertenausweis)", "Ja, GdB 30–49", "Nein, aber Beantragung läuft", "Nein / Weiß ich nicht"],
  },
  {
    id: "situation",
    frage: "Was beschreibt deine Situation am besten?",
    typ: "multi",
    optionen: [
      "Ich bin gerade ohne Job",
      "Ich habe einen Job, brauche aber Unterstützung",
      "Ich suche einen Ausbildungsplatz",
      "Ich bin in Schule/Studium",
      "Ich brauche Hilfe im Alltag",
      "Ich habe psychische Belastungen",
      "Ich habe Konflikte am Arbeitsplatz",
      "Ich war lange krank und möchte zurück in den Beruf",
    ],
  },
  {
    id: "neurodivergenz",
    frage: "Gibt es spezifische Herausforderungen bei dir?",
    typ: "multi",
    optionen: [
      "Konzentration / Fokus",
      "Reizüberflutung / Lärm",
      "Struktur & Organisation",
      "Lesen / Schreiben / Prüfungen",
      "Kommunikation",
      "Zwischenmenschliches / Soziales",
      "Energie / Erschöpfung",
      "Mobilität / körperliche Einschränkung",
      "Sehen / Hören",
    ],
  },
];

// Wenn-Dann Logik
function getEmpfehlungen(antworten) {
  const empf = new Set();
  const bereiche = antworten.bereich || [];
  const situation = antworten.situation || [];
  const gdb = antworten.gdb || "";
  const neuro = antworten.neurodivergenz || [];

  if (bereiche.includes("Arbeit / Job suchen") || situation.includes("Ich bin gerade ohne Job")) {
    empf.add("arbeit:eingliederungszuschuss");
    empf.add("arbeit:unterstuetzte-beschaeftigung");
    if (gdb.includes("50+")) empf.add("arbeit:arbeitsassistenz");
    if (gdb.includes("30")) empf.add("arbeit:gleichstellung");
  }
  if (bereiche.includes("Arbeit / Job suchen") || situation.includes("Ich habe einen Job, brauche aber Unterstützung")) {
    if (gdb.includes("50+")) {
      empf.add("arbeit:kuendigungsschutz");
      empf.add("arbeit:zusatzurlaub");
      empf.add("arbeit:arbeitsassistenz");
    }
    empf.add("arbeit:bem");
  }
  if (bereiche.includes("Ausbildung") || situation.includes("Ich suche einen Ausbildungsplatz")) {
    empf.add("ausbildung:budget-ausbildung");
    empf.add("ausbildung:fachpraktiker");
    empf.add("ausbildung:ausbildungszuschuss");
  }
  if (bereiche.includes("Schule") || situation.includes("Ich bin in Schule/Studium")) {
    empf.add("schule:nachteilsausgleich-schule");
    empf.add("schule:schulbegleitung");
  }
  if (bereiche.includes("Studium") || situation.includes("Ich bin in Schule/Studium")) {
    empf.add("studium:nachteilsausgleich-studium");
    empf.add("studium:studienhilfen");
  }
  if (bereiche.includes("Alltag & Freizeit") || situation.includes("Ich brauche Hilfe im Alltag")) {
    empf.add("alltag:assistenz-alltag");
    empf.add("alltag:persoenliches-budget");
    empf.add("alltag:ehrenamt");
  }
  if (bereiche.includes("Gesundheit & Psyche") || situation.includes("Ich habe psychische Belastungen")) {
    empf.add("alltag:rpk");
  }
  if (situation.includes("Ich habe Konflikte am Arbeitsplatz")) {
    empf.add("arbeit:jobcoaching");
    empf.add("arbeit:bem");
    if (gdb.includes("50+")) empf.add("arbeit:kuendigungsschutz");
  }
  if (situation.includes("Ich war lange krank und möchte zurück in den Beruf")) {
    empf.add("arbeit:bem");
    empf.add("arbeit:jobcoaching");
    empf.add("alltag:rpk");
    empf.add("arbeit:eingliederungszuschuss");
  }
  if (neuro.includes("Zwischenmenschliches / Soziales")) {
    empf.add("arbeit:jobcoaching");
  }
  if (neuro.length >= 2) {
    empf.add("alltag:neurodivergenz");
  }
  if (gdb === "Nein / Weiß ich nicht" || gdb === "Nein, aber Beantragung läuft") {
    empf.add("alltag:gdb-beantragen");
  }
  // Mehrere Bereiche → Teilhabeplanung
  if (bereiche.length >= 2 || situation.length >= 3) {
    empf.add("alltag:teilhabeplanung");
  }
  // Mindestens ein Ergebnis
  if (empf.size === 0) {
    empf.add("alltag:gdb-beantragen");
    empf.add("alltag:neurodivergenz");
  }
  return Array.from(empf);
}

const KONTAKT_LOGIK = [
  { wann: "Erstkontakt / Orientierung", stelle: "EUTB", kontakt: "eutb.de", schritt: "Kostenlos, unabhängig, kein Formular nötig" },
  { wann: "Job suchen, Ausbildung, Gleichstellung", stelle: "Agentur für Arbeit", kontakt: "arbeitsagentur.de", schritt: "Termin buchen, Reha-Beratung anfragen" },
  { wann: "Alltag, Wohnen, Budget für Arbeit", stelle: "Eingliederungshilfe (Sozialamt)", kontakt: "Sozialamt in deiner Stadt", schritt: "Antrag auf Eingliederungshilfe stellen" },
  { wann: "Schule, Schulbegleitung", stelle: "Jugendamt / Schulamt", kontakt: "Jugendamt oder Schule", schritt: "Antrag auf Schulassistenz beim Jugendamt" },
  { wann: "Studium", stelle: "Behindertenbeauftragte:r der Hochschule", kontakt: "Hochschul-Website", schritt: "Termin vereinbaren" },
  { wann: "Psychische Erkrankung, RPK", stelle: "Rentenversicherung / Krankenversicherung", kontakt: "Hausarzt als erster Schritt", schritt: "Arzt ansprechen, Antrag stellen" },
  { wann: "Mehrere Hilfen gleichzeitig", stelle: "Eingliederungshilfe koordiniert alle Träger", kontakt: "EUTB oder Sozialamt", schritt: "Teilhabeplan beantragen" },
  { wann: "Kündigung / Arbeitsrecht", stelle: "Integrationsamt", kontakt: "integrationsaemter.de", schritt: "Sofort handeln — 3-Wochen-Frist!" },
];

function linkify(text) {
  if (!text) return text;
  if (text.includes("teilhabeberatung.de")) {
    const parts = text.split("teilhabeberatung.de");
    return (
      <span>
        {parts[0]}
        <a href="https://www.teilhabeberatung.de" target="_blank" rel="noreferrer"
          style={{ color: "#A78BFA", fontWeight: 600 }}>teilhabeberatung.de</a>
        {parts[1]}
      </span>
    );
  }
  if (text.includes("Integrationsamt") || text.includes("Inklusionsamt")) {
    return <span>{text} <span style={{ fontSize: 11, color: "#64748B" }}>(regional — bei deiner Stadt suchen)</span></span>;
  }
  if (text.includes("integrationsaemter.de")) {
    return (
      <span>
        {text.split("integrationsaemter.de")[0]}
        <a href="https://www.integrationsaemter.de" target="_blank" rel="noreferrer"
          style={{ color: "#A78BFA", fontWeight: 600 }}>integrationsaemter.de</a>
        {text.split("integrationsaemter.de")[1]}
      </span>
    );
  }
  return text;
}

function Card({ karte }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: COLORS.bgCard, border: `1px solid ${karte.color}33`, borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", gap: 14, alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{karte.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 3 }}>{karte.titel}</p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>{karte.was}</p>
        </div>
        <span style={{ color: karte.color, fontSize: 20, fontWeight: 300, flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[
              { label: "Für wen?", val: karte.fuerWen },
              { label: "Oft zuständig", val: karte.zustaendig },
              { label: "Guter erster Kontakt", val: karte.kontakt },
              { label: "Alternative", val: karte.alternativ },
            ].map(r => r.val && (
              <div key={r.label} style={{ background: "#0F172A", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B", marginBottom: 4 }}>{r.label}</p>
                <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1" }}>{linkify(r.val)}</p>
              </div>
            ))}
          </div>
          <div style={{ background: karte.color + "18", border: `1px solid ${karte.color}33`, borderRadius: 8, padding: "12px 16px", marginTop: 12 }}>
            <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: karte.color, marginBottom: 4 }}>Nächster Schritt</p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1" }}>{linkify(karte.naechsterSchritt)}</p>
          </div>
          {karte.hinweis && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginTop: 10 }}>{karte.hinweis}</p>
          )}
          {(karte.hoehe || karte.dauer) && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {karte.hoehe && <span style={{ background: COLORS.greenBg, color: COLORS.green, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: `1px solid ${COLORS.greenBorder}` }}>{karte.hoehe}</span>}
              {karte.dauer && <span style={{ background: "#94A3B822", color: "#94A3B8", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: "1px solid #94A3B833" }}>{karte.dauer}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FoerderCheck() {
  const [schritt, setSchritt] = useState(0);
  const [antworten, setAntworten] = useState({});
  const [fertig, setFertig] = useState(false);

  const frage = CHECK_FRAGEN[schritt];

  const toggle = (val) => {
    if (frage.typ === "single") {
      setAntworten(a => ({ ...a, [frage.id]: val }));
    } else {
      const curr = antworten[frage.id] || [];
      const next = curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val];
      setAntworten(a => ({ ...a, [frage.id]: next }));
    }
  };

  const isSelected = (val) => {
    const curr = antworten[frage.id];
    if (frage.typ === "single") return curr === val;
    return (curr || []).includes(val);
  };

  const weiter = () => {
    if (schritt < CHECK_FRAGEN.length - 1) setSchritt(s => s + 1);
    else setFertig(true);
  };

  const canWeiter = () => {
    const curr = antworten[frage?.id];
    if (!curr) return false;
    if (frage.typ === "single") return !!curr;
    return curr.length > 0;
  };

  if (fertig) {
    const empfIDs = getEmpfehlungen(antworten);
    const empfKarten = empfIDs.map(id => {
      const [bereich, karteId] = id.split(":");
      return FOERDER_KARTEN[bereich]?.find(k => k.id === karteId);
    }).filter(Boolean);

    return (
      <div>
        <div style={{ background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>
            ✓ {empfKarten.length} passende Förderungen & Unterstützungen gefunden
          </p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8" }}>
            Bitte im Einzelfall prüfen — wir geben Orientierung, keine Rechtsberatung.
          </p>
        </div>
        {empfKarten.map(k => <Card key={k.id} karte={k} />)}
        <button onClick={() => { setSchritt(0); setAntworten({}); setFertig(false); }}
          style={{ marginTop: 16, background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#94A3B8", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14 }}>
          ← Neue Suche
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Fortschritt */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {CHECK_FRAGEN.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= schritt ? COLORS.purple : COLORS.border }} />
        ))}
      </div>

      <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: 12 }}>
        Frage {schritt + 1} von {CHECK_FRAGEN.length}
      </p>
      <h2 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#F8FAFC", marginBottom: 6, lineHeight: 1.4 }}>
        {frage.frage}
      </h2>
      {frage.typ === "multi" && (
        <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748B", marginBottom: 20 }}>Mehrere Antworten möglich</p>
      )}

      <div style={{ display: "grid", gap: 8, marginBottom: 28 }}>
        {frage.optionen.map(opt => {
          const sel = isSelected(opt);
          return (
            <button key={opt} onClick={() => toggle(opt)} style={{
              padding: "14px 18px", borderRadius: 10, textAlign: "left", cursor: "pointer",
              border: `1.5px solid ${sel ? COLORS.purple : COLORS.border}`,
              background: sel ? COLORS.purpleBg : COLORS.bgCard,
              color: sel ? COLORS.purple : "#CBD5E1",
              fontFamily: FONT, fontSize: 15, fontWeight: sel ? 600 : 400,
              transition: "all 0.1s",
            }}>
              {sel ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {schritt > 0 && (
          <button onClick={() => setSchritt(s => s - 1)} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#94A3B8", padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontFamily: FONT, fontSize: 15 }}>
            ← Zurück
          </button>
        )}
        <button onClick={weiter} disabled={!canWeiter()} style={{
          background: canWeiter() ? COLORS.purple : COLORS.border,
          border: "none", color: canWeiter() ? "white" : "#64748B",
          padding: "12px 28px", borderRadius: 10, cursor: canWeiter() ? "pointer" : "default",
          fontFamily: FONT, fontSize: 15, fontWeight: 700, flex: 1,
        }}>
          {schritt < CHECK_FRAGEN.length - 1 ? "Weiter →" : "Ergebnisse anzeigen →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HAUPT-KOMPONENTE
// ─────────────────────────────────────────────

export default function FoerderInfo({ profile }) {
  const [aktiv, setAktiv] = useState("check");

  const karten = aktiv !== "check" && aktiv !== "kontakt" ? FOERDER_KARTEN[aktiv] || [] : [];

  return (
    <div style={{ fontFamily: FONT }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", marginBottom: 6, letterSpacing: "-0.5px" }}>
        Fördercheck & Unterstützung
      </h2>
      <p style={{ fontSize: 15, color: "#94A3B8", marginBottom: 24, lineHeight: 1.6 }}>
        Hier findest du Orientierung zu Förderungen, Nachteilsausgleichen und Unterstützung — für Arbeit, Ausbildung, Schule, Studium und Alltag.
        Nur für dich sichtbar.
      </p>

      {/* Bereichs-Navigation */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
        {LEBENSBEREICHE.map(b => (
          <button key={b.id} onClick={() => setAktiv(b.id)} style={{
            padding: "8px 16px", borderRadius: 20, border: `1.5px solid`,
            borderColor: aktiv === b.id ? COLORS.purple : COLORS.border,
            background: aktiv === b.id ? COLORS.purpleBg : "transparent",
            color: aktiv === b.id ? COLORS.purple : "#94A3B8",
            fontFamily: FONT, fontSize: 14, fontWeight: aktiv === b.id ? 600 : 400,
            cursor: "pointer", transition: "all 0.1s",
          }}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Förder-Check */}
      {aktiv === "check" && <FoerderCheck />}

      {/* Bereichs-Karten */}
      {karten.length > 0 && (
        <div>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: 16 }}>
            {karten.length} Themen — klicken zum Aufklappen
          </p>
          {karten.map(k => <Card key={k.id} karte={k} />)}
        </div>
      )}

      {/* Kontakt-Logik */}
      {aktiv === "kontakt" && (
        <div>
          <div style={{ background: COLORS.purpleBg, border: `1px solid ${COLORS.purpleBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.purple, marginBottom: 6 }}>
              ⭐ Tipp: Bei Unsicherheit immer zuerst die EUTB kontaktieren
            </p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8" }}>
              Kostenlos, unabhängig, ohne Bürokratie — direkt suchen unter:{" "}
              <a href="https://www.teilhabeberatung.de" target="_blank" rel="noreferrer" style={{ color: COLORS.purple, fontWeight: 600 }}>teilhabeberatung.de →</a>
            </p>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {KONTAKT_LOGIK.map((k, i) => (
              <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B", marginBottom: 4 }}>Wann</p>
                    <p style={{ fontFamily: FONT, fontSize: 14, color: "#F8FAFC", fontWeight: 600 }}>{k.wann}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B", marginBottom: 4 }}>Oft zuständig</p>
                    <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1" }}>{k.stelle}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B", marginBottom: 4 }}>Nächster Schritt</p>
                    <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1" }}>{k.schritt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", marginTop: 16 }}>
            <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginBottom: 14 }}>Wichtige Anlaufstellen</p>
            {[
              { name: "EUTB — Unabhängige Teilhabeberatung", url: "https://www.eutb.de", desc: "Kostenlos, unabhängig, überall in Deutschland" },
              { name: "Integrationsamt / Inklusionsamt", url: "https://www.integrationsaemter.de", desc: "Arbeitsassistenz, Kündigungsschutz, Förderungen" },
              { name: "Agentur für Arbeit", url: "https://www.arbeitsagentur.de", desc: "Eingliederungszuschuss, Reha-Beratung, Gleichstellung" },
              { name: "betanet.de", url: "https://www.betanet.de", desc: "Kostenlose Ratgeber zu allen Sozialleistungen" },
              { name: "VdK / SoVD", url: "https://www.vdk.de", desc: "Beratung & Hilfe bei Anträgen" },
            ].map(s => (
              <div key={s.name} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: COLORS.purple }}>{s.name}</a>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#94A3B818", border: `1px solid #94A3B833`, borderRadius: 10, padding: "14px 18px", marginTop: 16 }}>
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
              ℹ️ Diese Informationen dienen der Orientierung. Wir machen keine rechtsverbindlichen Aussagen.
              Im Einzelfall bitte immer bei der zuständigen Stelle prüfen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
