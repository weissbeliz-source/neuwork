import { createTagField } from "./constants";

export function parseStoredField(value) {
  if (!value) return createTagField();
  try {
    const parsed = JSON.parse(value);
    if (parsed && Array.isArray(parsed.tags)) return { tags: parsed.tags, custom: parsed.custom || "" };
  } catch (error) {
    return { tags: [], custom: typeof value === "string" ? value : "" };
  }
  return createTagField();
}

export function serializeField(value) {
  return JSON.stringify({ tags: value?.tags || [], custom: value?.custom || "" });
}

export function renderTagFieldPreview(field) {
  const tags = field?.tags || [];
  const custom = field?.custom?.trim() || "";
  const parts = [...tags, custom].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Noch nichts eingetragen.";
}

// Übersetzt Bedürfnisse in Behördensprache
export function translateNeedToOfficial(need) {
  const map = {
    "Flexible Zeiten": "Einschränkung der zeitlichen Belastbarkeit — flexible Arbeitszeitregelung erforderlich",
    "Teilzeit möglich": "Reduzierte Arbeitsfähigkeit — Teilzeitbeschäftigung notwendig",
    "Remote möglich": "Einschränkung der Mobilität oder Reizverarbeitung — Homeoffice-Option erforderlich",
    "Keine Kamera-Pflicht": "Einschränkung der sozialen Interaktion — Anpassung der Kommunikationsform notwendig",
    "Reizarme Umgebung": "Einschränkung durch Reizüberflutung — ruhige, reizarme Arbeitsumgebung erforderlich",
    "Einzelbüro": "Einschränkung der Konzentrationsfähigkeit durch äußere Reize — Einzelarbeitsplatz erforderlich",
    "Noise-Cancelling erlaubt": "Lärmempfindlichkeit — Nutzung von Gehörschutz / Noise-Cancelling am Arbeitsplatz notwendig",
    "Ununterbrochene Fokuszeit": "Beeinträchtigung der Konzentration durch Unterbrechungen — Schutz vor Störungen erforderlich",
    "Flexible Pausen": "Beeinträchtigung der körperlichen oder psychischen Belastbarkeit — flexible Pausenregelung notwendig",
    "Zusätzliche Pausen": "Eingeschränkte Ausdauer — zusätzliche Erholungspausen erforderlich",
    "Klare Deadlines": "Beeinträchtigung der Zeitwahrnehmung / Planung — strukturierte Zeitvorgaben erforderlich",
    "Klare Aufgabenbeschreibung": "Beeinträchtigung der Informationsverarbeitung — schriftliche, strukturierte Aufgabenstellung erforderlich",
    "Aufgaben in kleinen Schritten": "Beeinträchtigung der Arbeitsorganisation — schrittweise Aufgabenübertragung erforderlich",
    "Strukturierte Einarbeitung": "Erhöhter Einarbeitungsbedarf — strukturiertes, begleitetes Onboarding notwendig",
    "Buddy / Ansprechperson": "Unterstützungsbedarf am Arbeitsplatz — feste Bezugsperson erforderlich",
    "Job-Coaching": "Unterstützungsbedarf bei der Arbeitsorganisation — Job-Coaching erforderlich",
    "Barrierefreier Eingang": "Einschränkung der Mobilität — barrierefreier Zugang zum Arbeitsplatz erforderlich",
    "Rollstuhlgerechter Arbeitsplatz": "Nutzung eines Rollstuhls — rollstuhlgerechte Arbeitsplatzgestaltung erforderlich",
    "Höhenverstellbarer Tisch": "Körperliche Einschränkung — höhenverstellbares Mobiliar erforderlich",
    "Screenreader-kompatible Tools": "Sehbehinderung — Einsatz barrierefreier, screenreader-kompatibler Software erforderlich",
    "Gebärdensprachdolmetschung": "Hörbehinderung — Einsatz von Gebärdensprachdolmetscher:in erforderlich",
    "Untertitel / Captions": "Hörbehinderung — Untertitelung bei Video- und Audioinhalten erforderlich",
    "Einfache Sprache": "Einschränkung der Informationsverarbeitung — Kommunikation in einfacher, klarer Sprache erforderlich",
    "Mehr Zeit zum Lernen": "Beeinträchtigung des Lerntempos — erhöhter Zeitbedarf beim Erlernen neuer Aufgaben",
    "Späterer Arbeitsbeginn": "Chronobiologische Einschränkung oder Medikamentenwirkung — späterer Arbeitsbeginn notwendig",
    "Termine um Behandlungen herum": "Regelmäßige medizinische Behandlung — Freistellung für Therapietermine erforderlich",
    "Arbeiten von zuhause bei Schub": "Schubweise Erkrankung — Homeoffice-Option bei Erkrankungsschub erforderlich",
    "Psychologische Sicherheit": "Psychische Behinderung — angstfreies, wertschätzendes Arbeitsumfeld erforderlich",
    "Masking-freie Kultur": "Neurodivergenz — authentisches Auftreten ohne Anpassungsdruck erforderlich",
    "Weniger Meetings": "Beeinträchtigung durch soziale oder kommunikative Überforderung — Reduzierung von Meetings erforderlich",
    "Protokolle nach Meetings": "Einschränkung des Arbeitsgedächtnisses — schriftliche Meetingprotokolle erforderlich",
    "Vorhersehbare Abläufe": "Beeinträchtigung durch unvorhergesehene Änderungen — strukturierte, planbare Arbeitsabläufe erforderlich",
  };
  return map[need] || `Anpassungsbedarf: ${need}`;
}
