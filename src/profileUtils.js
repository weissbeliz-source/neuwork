export function parseStoredField(value) {
  if (!value) return { tags: [], custom: "" };
  if (typeof value === "object") return { tags: value.tags || [], custom: value.custom || "" };
  try {
    const parsed = JSON.parse(value);
    return { tags: parsed.tags || [], custom: parsed.custom || "" };
  } catch {
    return { tags: [], custom: value || "" };
  }
}

export function serializeField(value) {
  if (!value) return JSON.stringify({ tags: [], custom: "" });
  return JSON.stringify({ tags: value.tags || [], custom: value.custom || "" });
}

export function translateNeedToOfficial(need) {
  const map = {
    "Flexible Zeiten": "Angepasste Arbeitszeiten (§ 164 SGB IX)",
    "Homeoffice statt Pendeln": "Homeoffice als Nachteilsausgleich",
    "Rollstuhlgerechter Arbeitsplatz": "Behinderungsgerechte Arbeitsplatzausstattung (§ 164 SGB IX)",
    "Screenreader-kompatible Tools": "Technische Hilfsmittel (§ 164 SGB IX)",
    "Gebärdensprachdolmetschung": "Arbeitsassistenz / Dolmetschdienst (§ 78 SGB IX)",
    "Job-Coaching": "Berufsbegleitung / Job-Coaching (§ 55 SGB IX)",
    "Mehr Bearbeitungszeit": "Nachteilsausgleich Bearbeitungszeit",
    "Einfache Sprache": "Nachteilsausgleich Kommunikation",
    "Zusätzliche Pausen": "Angepasste Pausenregelung (§ 164 SGB IX)",
  };
  return map[need] || need;
}
