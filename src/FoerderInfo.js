import { useState } from "react";

// =============================================
// DATEN — Förderungen & Rechte
// =============================================

const RECHTE = [
  {
    id: "kuendigungsschutz",
    titel: "Besonderer Kündigungsschutz",
    voraussetzung: "GdB 50+ (oder Gleichstellung)",
    beschreibung: "Eine Kündigung ist nur mit vorheriger Zustimmung des Integrationsamts wirksam. Die Zustimmung muss VOR der Kündigung schriftlich beantragt werden.",
    tipp: "Frist für Kündigungsschutzklage: 3 Wochen. Diese unbedingt einhalten!",
    icon: "🛡",
  },
  {
    id: "zusatzurlaub",
    titel: "Zusatzurlaub",
    voraussetzung: "GdB 50+",
    beschreibung: "5 zusätzliche bezahlte Urlaubstage pro Jahr (bei 5-Tage-Woche). Bei Teilzeit anteilig.",
    tipp: "Anspruch schriftlich beim Arbeitgeber geltend machen, Kopie des Schwerbehindertenausweises beifügen.",
    icon: "📅",
  },
  {
    id: "mehrarbeit",
    titel: "Befreiung von Mehrarbeit",
    voraussetzung: "GdB 50+ (oder Gleichstellung)",
    beschreibung: "Auf Wunsch Befreiung von Überstunden und Mehrarbeit.",
    tipp: null,
    icon: "⏰",
  },
  {
    id: "gleichstellung",
    titel: "Gleichstellung beantragen",
    voraussetzung: "GdB 30–49",
    beschreibung: "Mit GdB 30–49 kann eine Gleichstellung mit Schwerbehinderung beantragt werden, wenn ohne sie kein geeigneter Arbeitsplatz erlangt oder erhalten werden kann. Dann gelten u.a. Kündigungsschutz.",
    tipp: "Antrag bei der Agentur für Arbeit stellen — wird nicht an den Arbeitgeber kommuniziert!",
    icon: "⚖",
  },
  {
    id: "steuerpauschbetrag",
    titel: "Steuerlicher Pauschbetrag",
    voraussetzung: "Ab GdB 20",
    beschreibung: "Steuerfreibetrag bei der Einkommensteuer. Ab GdB 20 möglich, steigt mit dem GdB.",
    tipp: "Im Rahmen der Steuererklärung geltend machen.",
    icon: "💶",
  },
  {
    id: "bem",
    titel: "Betriebliches Eingliederungsmanagement (BEM)",
    voraussetzung: "Nach mehr als 6 Wochen Krankenstand",
    beschreibung: "Arbeitgeber sind verpflichtet, ein BEM-Gespräch anzubieten. Ziel: gemeinsam Lösungen finden um den Arbeitsplatz zu erhalten.",
    tipp: "Freiwillig — du musst nicht teilnehmen, es kann aber sehr hilfreich sein.",
    icon: "🤝",
  },
  {
    id: "nachteilsausgleich",
    titel: "Nachteilsausgleich",
    voraussetzung: "Ab GdB 30 (Rechtsanspruch). Auch ohne GdB mit ärztlichem Attest möglich.",
    beschreibung: "Anpassung der Arbeitsbedingungen ohne Absenkung der fachlichen Anforderungen: z.B. mehr Zeit, ruhiger Raum, andere Kommunikationsform, schriftliche statt mündliche Aufgaben.",
    tipp: "Besonders wichtig bei ADHS, Autismus, Legasthenie, Dyskalkulie, psychischen Erkrankungen.",
    icon: "⚙",
  },
];

const FOERDERUNGEN_FUER_DICH = [
  {
    id: "arbeitsassistenz",
    titel: "Arbeitsassistenz",
    behoerde: "Integrationsamt",
    voraussetzung: "GdB 50+ (Rechtsanspruch!)",
    beschreibung: "Finanzierung einer Assistenzperson, die bei der Arbeit hilft — z.B. vorliest, übersetzt, Gegenstände anreicht, bei Dienstreisen unterstützt. Du leitest die Assistenzperson an.",
    wichtig: "Anspruchsleistung — das Amt hat kein Ermessen, muss bewilligen!",
    icon: "👥",
  },
  {
    id: "technische_hilfen",
    titel: "Technische Arbeitshilfen",
    behoerde: "Integrationsamt / Reha-Träger",
    voraussetzung: "Behinderungsbedingt notwendig",
    beschreibung: "Finanzierung von Hilfsmitteln: Screenreader-Software, Braille-Display, Hörgerät, ergonomischer Stuhl, höhenverstellbarer Tisch, spezielle Computer, etc.",
    wichtig: null,
    icon: "🔧",
  },
  {
    id: "kraftfahrzeughilfe",
    titel: "Kraftfahrzeughilfe",
    behoerde: "Agentur für Arbeit / Reha-Träger",
    voraussetzung: "Behinderungsbedingt auf Auto angewiesen",
    beschreibung: "Zuschuss für behinderungsgerechtes Fahrzeug oder Fahrzeugumbau, wenn öffentliche Verkehrsmittel nicht genutzt werden können.",
    wichtig: null,
    icon: "🚗",
  },
  {
    id: "berufsbegleitung",
    titel: "Berufsbegleitung / Job-Coaching",
    behoerde: "Integrationsamt / Agentur für Arbeit",
    voraussetzung: "Behinderung, Unterstützungsbedarf",
    beschreibung: "Pädagogische Begleitung am Arbeitsplatz durch Fachkräfte — z.B. bei Kommunikation mit Kolleg:innen, Krisen, Einarbeitung. Kann ein ganzes Arbeitsleben lang gewährt werden.",
    wichtig: "Anders als Arbeitsassistenz: pädagogischer Charakter, kein Ausführen von Aufgaben.",
    icon: "🎯",
  },
  {
    id: "unterstuetzte_beschaeftigung",
    titel: "Unterstützte Beschäftigung",
    behoerde: "Agentur für Arbeit / Integrationsamt",
    voraussetzung: "Behinderung, kein Ausbildungsplatz oder Wechsel vom allg. Arbeitsmarkt gewünscht",
    beschreibung: "Individuelle betriebliche Qualifizierung direkt im Betrieb (bis 2 Jahre) + anschließende Berufsbegleitung. Alternative zur Werkstatt für Menschen mit Behinderung (WfbM).",
    wichtig: "Gut für Menschen die noch keinen passenden Job gefunden haben.",
    icon: "🌱",
  },
  {
    id: "gebaerdensprache",
    titel: "Gebärdensprachdolmetscher:in",
    behoerde: "Integrationsamt",
    voraussetzung: "Hörbehinderung",
    beschreibung: "Kostenübernahme für Dolmetscher:innen — auch für Meetings, Schulungen und Video-Calls.",
    wichtig: "Neue Stundensätze ab April 2025.",
    icon: "🤟",
  },
  {
    id: "wohnungshilfe",
    titel: "Wohnungshilfe",
    behoerde: "Reha-Träger",
    voraussetzung: "Wenn behinderungsgerechtes Wohnen zur Berufsausübung notwendig",
    beschreibung: "Zuschüsse für behinderungsgerechten Wohnraum, wenn dies die Voraussetzung für die Berufsausübung ist.",
    wichtig: null,
    icon: "🏠",
  },
];

const FOERDERUNGEN_FUER_ARBEITGEBER = [
  {
    id: "eingliederungszuschuss",
    titel: "Eingliederungszuschuss",
    behoerde: "Agentur für Arbeit / Jobcenter",
    hoehe: "Bis zu 70% des Lohns",
    dauer: "Bis zu 24 Monate (besonders Betroffene bis 96 Monate)",
    voraussetzung: "Behinderung oder Schwerbehinderung",
    beschreibung: "Zuschuss zu den Lohnkosten bei Neueinstellung.",
    warnung: "Muss VOR Abschluss des Arbeitsvertrags beantragt werden!",
    icon: "💰",
  },
  {
    id: "beschaeftigungssicherungszuschuss",
    titel: "Beschäftigungssicherungszuschuss",
    behoerde: "Integrationsamt",
    hoehe: "Individuell",
    dauer: "Laufend",
    voraussetzung: "GdB 50+, Minderleistung nachgewiesen",
    beschreibung: "Laufender Zuschuss wenn die Person nicht die volle Arbeitsleistung bringen kann — gleicht die Minderleistung aus.",
    warnung: null,
    icon: "📊",
  },
  {
    id: "arbeitsplatzanpassung",
    titel: "Arbeitsplatzanpassung & Umbau",
    behoerde: "Integrationsamt",
    hoehe: "Vollfinanzierung möglich",
    dauer: "Einmalig",
    voraussetzung: "Schwerbehinderung",
    beschreibung: "Finanzierung von barrierefreiem Umbau, technischen Arbeitshilfen, Möbeln — alles was zum Arbeitsplatz gehört, auch wenn es nicht direkt mit der Behinderung zusammenhängt.",
    warnung: null,
    icon: "🏗",
  },
  {
    id: "budget_fuer_arbeit",
    titel: "Budget für Arbeit",
    behoerde: "Reha-Träger / Agentur für Arbeit",
    hoehe: "Bis zu 75% des Lohns",
    dauer: "Dauerhaft",
    voraussetzung: "Person wäre berechtigt in Werkstatt für Menschen mit Behinderung (WfbM) zu arbeiten",
    beschreibung: "Alternative zur WfbM — ermöglicht sozialversicherungspflichtige Arbeit auf dem ersten Arbeitsmarkt. Kombination aus Lohnkostenzuschuss und Begleitung.",
    warnung: null,
    icon: "🏭",
  },
  {
    id: "budget_fuer_ausbildung",
    titel: "Budget für Ausbildung",
    behoerde: "Reha-Träger",
    hoehe: "Erstattung der Ausbildungsvergütung",
    dauer: "Gesamte Ausbildungsdauer",
    voraussetzung: "Behinderung, Alternative zur WfbM-Ausbildung",
    beschreibung: "Ermöglicht eine reguläre Ausbildung im Betrieb statt in einer Werkstatt. Beinhaltet Erstattung der Ausbildungsvergütung + Anleitung und Begleitung.",
    warnung: null,
    icon: "📚",
  },
  {
    id: "ausbildungszuschuss",
    titel: "Ausbildungszuschuss",
    behoerde: "Agentur für Arbeit / Reha-Träger",
    hoehe: "Bis zu 100% der monatlichen Ausbildungsvergütung",
    dauer: "Gesamte Ausbildungsdauer",
    voraussetzung: "Ausbildung eines Menschen mit Behinderung",
    beschreibung: "Zuschuss wenn der Betrieb Bildungsleistungen für Menschen mit Behinderung erbringt.",
    warnung: null,
    icon: "🎓",
  },
  {
    id: "probebeschaeftigung",
    titel: "Kostenerstattung Probebeschäftigung",
    behoerde: "Agentur für Arbeit / Reha-Träger",
    hoehe: "Teilweise oder vollständig",
    dauer: "Befristet",
    voraussetzung: "Zur Verbesserung der beruflichen Eingliederung",
    beschreibung: "Erstattung der Kosten für eine Probebeschäftigung, um die dauerhafte Eingliederung zu verbessern.",
    warnung: null,
    icon: "🔍",
  },
];

const BERATUNGSANGEBOTE = [
  {
    name: "EUTB — Ergänzende Unabhängige Teilhabeberatung",
    beschreibung: "Kostenlose, unabhängige Beratung zu allen Förderungen und Rechten. Immer zuerst hier anrufen!",
    link: "https://www.eutb.de",
    icon: "⭐",
  },
  {
    name: "Integrationsfachdienst (IFD)",
    beschreibung: "Berät und unterstützt bei der Arbeitssuche und hilft den Arbeitsplatz zu erhalten.",
    link: "https://www.integrationsaemter.de",
    icon: "🤝",
  },
  {
    name: "Integrationsamt / Inklusionsamt",
    beschreibung: "Zuständig für viele Förderungen und den besonderen Kündigungsschutz.",
    link: "https://www.integrationsaemter.de",
    icon: "🏛",
  },
  {
    name: "Agentur für Arbeit",
    beschreibung: "Eingliederungszuschuss, Berufsbegleitung, Gleichstellung.",
    link: "https://www.arbeitsagentur.de",
    icon: "📋",
  },
  {
    name: "betanet.de",
    beschreibung: "Kostenlose, aktuelle Ratgeber zu allen Sozialleistungen.",
    link: "https://www.betanet.de",
    icon: "📖",
  },
];

const SCHRITTE = [
  {
    nr: 1,
    titel: "Zuerst: EUTB kontaktieren",
    text: "Ruf die EUTB an oder schreib ihnen — kostenlos, unabhängig, ohne Bürokratie. Sie helfen dir herauszufinden was für dich zusteht und welche Behörde zuständig ist.",
    link: "https://www.eutb.de",
    linktext: "eutb.de",
    farbe: "#EEF7F1",
    randfarbe: "#7C9E87",
  },
  {
    nr: 2,
    titel: "GdB beantragen (falls noch nicht geschehen)",
    text: "Beim Versorgungsamt in deiner Stadt beantragen. Auch mit GdB 30 hast du bereits Rechte. Dauert ca. 3–6 Monate.",
    link: null,
    linktext: null,
    farbe: "#F0EEFF",
    randfarbe: "#8B7EC8",
  },
  {
    nr: 3,
    titel: "Eingliederungszuschuss VOR Vertragsabschluss",
    text: "Wenn du weißt, welchen Job du antreten möchtest: Arbeitgeber muss den Eingliederungszuschuss VOR Abschluss des Arbeitsvertrags bei der Agentur für Arbeit beantragen. Daran erinnern!",
    link: null,
    linktext: null,
    farbe: "#FFF8E1",
    randfarbe: "#D4956A",
  },
  {
    nr: 4,
    titel: "Arbeitsassistenz & Hilfsmittel beantragen",
    text: "Bei GdB 50+: Arbeitsassistenz beim Integrationsamt beantragen. Das ist ein Rechtsanspruch — das Amt muss bewilligen. Auch Hilfsmittel und Arbeitsplatzanpassung beim Integrationsamt beantragen.",
    link: "https://www.integrationsaemter.de",
    linktext: "integrationsaemter.de",
    farbe: "#E6F1FB",
    randfarbe: "#5B9BAD",
  },
  {
    nr: 5,
    titel: "Nachteilsausgleich mit Arbeitgeber vereinbaren",
    text: "Schriftlich festhalten welche Anpassungen du brauchst. Bei ADHS, Autismus oder psychischen Erkrankungen: ärztliches Attest reicht, kein GdB nötig.",
    link: null,
    linktext: null,
    farbe: "#F5F0E8",
    randfarbe: "#C4A86E",
  },
];

// =============================================
// KOMPONENTE
// =============================================

export default function FoerderInfo({ profile }) {
  const [aktiveSektion, setAktiveSektion] = useState("uebersicht");
  const [showEmployerDoc, setShowEmployerDoc] = useState(false);

  const hasDisabilityId = profile?.has_disability_id;
  const degree = parseInt(profile?.disability_degree || "0") || 0;
  const needs = profile?.needs?.tags || [];
  const assistiveTech = profile?.assistive_tech?.tags || [];

  const hasMobilityNeed = needs.some(n => ["Barrierefreier Eingang", "Rollstuhlgerechter Arbeitsplatz", "Aufzug", "Rampe", "Rollstuhl"].includes(n)) ||
    assistiveTech.some(t => ["Rollstuhl", "Gehhilfe"].includes(t));
  const hasSensoryNeed = needs.some(n => ["Gebärdensprachdolmetschung", "Untertitel / Captions", "Screenreader-kompatible Tools"].includes(n)) ||
    assistiveTech.some(t => ["Screenreader (z.B. NVDA, JAWS)", "Hörhilfe / Cochlea-Implantat", "Gebärdensprachdolmetscher:in"].includes(t));

  const tabs = [
    { id: "uebersicht", label: "Übersicht" },
    { id: "rechte", label: "Deine Rechte" },
    { id: "foerderungen_dich", label: "Für dich" },
    { id: "foerderungen_ag", label: "Für Arbeitgeber" },
    { id: "schritte", label: "Schritt für Schritt" },
  ];

  const s = {
    card: { background: "white", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 12, color: "#2C2C2C" },
    label: { fontFamily: "Source Sans 3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: 4, display: "block" },
    text: { fontFamily: "Source Sans 3", fontSize: 14, color: "#444", lineHeight: 1.6 },
    badge: (bg, color) => ({ background: bg, color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 12, display: "inline-block", marginBottom: 8 }),
    warnung: { background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 10, padding: "8px 12px", fontFamily: "Source Sans 3", fontSize: 12, color: "#795548", marginTop: 8 },
    tipp: { background: "#EEF7F1", borderRadius: 10, padding: "8px 12px", fontFamily: "Source Sans 3", fontSize: 12, color: "#2D7A4F", marginTop: 8 },
    link: { color: "#8B7EC8", fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 500 },
  };

  if (showEmployerDoc) return <ArbeitgeberDok profile={profile} onBack={() => setShowEmployerDoc(false)} />;

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Fördercheck</h2>
      <p style={{ ...s.text, marginBottom: 20, color: "#666" }}>
        Hier siehst du welche Rechte und Förderungen für dich relevant sein könnten. Nur für dich sichtbar — nicht im öffentlichen Profil.
      </p>

      {/* Status-Banner */}
      {!hasDisabilityId && (
        <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#795548", lineHeight: 1.6 }}>
            <strong>Kein Schwerbehindertenausweis eingetragen.</strong> Viele Leistungen sind auch ohne möglich — z.B. Nachteilsausgleich ab GdB 30 oder mit ärztlichem Attest.
            Trage deinen Status im Profil-Tab ein um personalisierte Empfehlungen zu sehen.
          </p>
        </div>
      )}
      {hasDisabilityId && (
        <div style={{ background: "#EEF7F1", border: "1px solid #A3D5AF", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2D7A4F", lineHeight: 1.6 }}>
            <strong>✓ Schwerbehindertenausweis</strong>{degree ? ` (GdB ${degree})` : ""} — du hast Anspruch auf Kündigungsschutz, Zusatzurlaub, Arbeitsassistenz und mehr.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setAktiveSektion(tab.id)}
            style={{ padding: "8px 14px", borderRadius: 20, border: "1.5px solid", borderColor: aktiveSektion === tab.id ? "#2C2C2C" : "#E2DBD0", background: aktiveSektion === tab.id ? "#2C2C2C" : "white", color: aktiveSektion === tab.id ? "#F5F0E8" : "#666", fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ÜBERSICHT */}
      {aktiveSektion === "uebersicht" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { icon: "🛡", titel: "Rechte", text: hasDisabilityId ? "Kündigungsschutz, Zusatzurlaub, Befreiung von Mehrarbeit" : "Nachteilsausgleich, ggf. Gleichstellung beantragen", tab: "rechte" },
              { icon: "👤", titel: "Förderungen für dich", text: "Arbeitsassistenz, Hilfsmittel, Job-Coaching, Berufsbegleitung", tab: "foerderungen_dich" },
              { icon: "🏢", titel: "Förderungen für Arbeitgeber", text: "Eingliederungszuschuss, Arbeitsplatzanpassung, Budget für Arbeit", tab: "foerderungen_ag" },
              { icon: "📋", titel: "Schritt für Schritt", text: "Womit anfangen? In welcher Reihenfolge vorgehen?", tab: "schritte" },
            ].map(item => (
              <button key={item.tab} onClick={() => setAktiveSektion(item.tab)}
                style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1.5px solid transparent", cursor: "pointer", textAlign: "left" }}>
                <p style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 600, color: "#2C2C2C", marginBottom: 4 }}>{item.titel}</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{item.text}</p>
              </button>
            ))}
          </div>

          {/* Arbeitgeber-Dokument */}
          <div style={s.card}>
            <p style={s.sectionTitle}>Förderinfo für Arbeitgeber generieren</p>
            <p style={{ ...s.text, marginBottom: 16 }}>
              Erstelle ein separates Dokument für deinen zukünftigen Arbeitgeber — zeigt welche Förderungen er bei deiner Einstellung beantragen kann. Du entscheidest ob du es mitschickst.
            </p>
            <button onClick={() => setShowEmployerDoc(true)}
              style={{ background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "10px 20px", borderRadius: 20, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 500 }}>
              Dokument ansehen →
            </button>
          </div>

          {/* EUTB Hinweis */}
          <div style={{ background: "#EEF7F1", borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#2D7A4F", lineHeight: 1.7 }}>
              <strong>⭐ Empfehlung:</strong> Lass dich zuerst kostenlos bei der <strong>EUTB</strong> beraten — die helfen dir herauszufinden was für dich zutrifft.
              {" "}<a href="https://www.eutb.de" target="_blank" rel="noreferrer" style={s.link}>eutb.de →</a>
            </p>
          </div>
        </div>
      )}

      {/* DEINE RECHTE */}
      {aktiveSektion === "rechte" && (
        <div>
          {RECHTE.map(r => (
            <div key={r.id} style={s.card}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 15, fontWeight: 600, color: "#2C2C2C", marginBottom: 4 }}>{r.titel}</p>
                  <span style={s.badge("#F5F0E8", "#666")}>{r.voraussetzung}</span>
                  <p style={s.text}>{r.beschreibung}</p>
                  {r.tipp && <div style={s.tipp}>💡 {r.tipp}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FÖRDERUNGEN FÜR DICH */}
      {aktiveSektion === "foerderungen_dich" && (
        <div>
          <p style={{ ...s.text, marginBottom: 16, color: "#666" }}>Diese Leistungen beantragst du selbst — beim Integrationsamt, der Agentur für Arbeit oder dem Reha-Träger.</p>
          {FOERDERUNGEN_FUER_DICH.map(f => {
            if (f.id === "gebaerdensprache" && !hasSensoryNeed) return null;
            return (
              <div key={f.id} style={s.card}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <p style={{ fontFamily: "Source Sans 3", fontSize: 15, fontWeight: 600, color: "#2C2C2C" }}>{f.titel}</p>
                      <span style={{ fontFamily: "Source Sans 3", fontSize: 11, color: "#888", background: "#F5F0E8", padding: "2px 8px", borderRadius: 10, flexShrink: 0, marginLeft: 8 }}>{f.behoerde}</span>
                    </div>
                    <span style={s.badge("#F5F0E8", "#666")}>{f.voraussetzung}</span>
                    <p style={s.text}>{f.beschreibung}</p>
                    {f.wichtig && <div style={s.tipp}>💡 {f.wichtig}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FÖRDERUNGEN FÜR ARBEITGEBER */}
      {aktiveSektion === "foerderungen_ag" && (
        <div>
          <p style={{ ...s.text, marginBottom: 16, color: "#666" }}>Diese Förderungen beantragt dein Arbeitgeber — du kannst ihn darauf hinweisen.</p>
          {FOERDERUNGEN_FUER_ARBEITGEBER.map(f => (
            <div key={f.id} style={s.card}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 15, fontWeight: 600, color: "#2C2C2C", marginBottom: 4 }}>{f.titel}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={s.badge("#EEF7F1", "#2D7A4F")}>{f.hoehe}</span>
                    <span style={s.badge("#F5F0E8", "#666")}>{f.dauer}</span>
                  </div>
                  <p style={{ ...s.text, marginBottom: 6 }}>{f.beschreibung}</p>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888" }}>Behörde: {f.behoerde} · Voraussetzung: {f.voraussetzung}</p>
                  {f.warnung && <div style={s.warnung}>⚠️ {f.warnung}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHRITT FÜR SCHRITT */}
      {aktiveSektion === "schritte" && (
        <div>
          <p style={{ ...s.text, marginBottom: 20, color: "#666" }}>So gehst du am besten vor — in dieser Reihenfolge:</p>
          {SCHRITTE.map(schritt => (
            <div key={schritt.nr} style={{ ...s.card, borderLeft: `4px solid ${schritt.randfarbe}`, background: schritt.farbe }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: schritt.randfarbe, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontSize: 14, fontWeight: 700, fontFamily: "Source Sans 3" }}>{schritt.nr}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 15, fontWeight: 600, color: "#2C2C2C", marginBottom: 6 }}>{schritt.titel}</p>
                  <p style={s.text}>{schritt.text}</p>
                  {schritt.link && (
                    <a href={schritt.link} target="_blank" rel="noreferrer" style={{ ...s.link, display: "inline-block", marginTop: 6 }}>
                      → {schritt.linktext}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Beratung */}
          <div style={s.card}>
            <p style={s.sectionTitle}>Beratungsangebote</p>
            {BERATUNGSANGEBOTE.map(b => (
              <div key={b.name} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #F0EBE0" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <a href={b.link} target="_blank" rel="noreferrer" style={{ fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 600, color: "#8B7EC8" }}>{b.name}</a>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#666", marginTop: 2 }}>{b.beschreibung}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// ARBEITGEBER-DOKUMENT
// =============================================
function ArbeitgeberDok({ profile, onBack }) {
  const s = {
    text: { fontFamily: "Source Sans 3", fontSize: 14, color: "#444", lineHeight: 1.6 },
    label: { fontFamily: "Source Sans 3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888" },
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "transparent", border: "1.5px solid #ddd", borderRadius: 20, padding: "8px 16px", cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 13, color: "#666", marginBottom: 24 }}>
        ← Zurück
      </button>

      <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ borderBottom: "2px solid #2C2C2C", paddingBottom: 16, marginBottom: 28 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 4 }}>Förderinformation für Arbeitgeber</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>
            Mögliche Förderungen bei Einstellung{profile?.full_name ? ` von ${profile.full_name}` : ""}
          </h2>
          <p style={{ ...s.text, marginTop: 8, color: "#666" }}>
            Dieses Dokument gibt einen unverbindlichen Überblick. Die genaue Förderhöhe hängt vom Einzelfall ab.
            Beratung: Integrationsamt oder Agentur für Arbeit.
          </p>
        </div>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Förderungen die Sie beantragen können:</p>

        {FOERDERUNGEN_FUER_ARBEITGEBER.map(f => (
          <div key={f.id} style={{ borderBottom: "1px solid #F0EBE0", paddingBottom: 18, marginBottom: 18 }}>
            <h3 style={{ fontFamily: "Source Sans 3", fontSize: 15, fontWeight: 600, color: "#2C2C2C", marginBottom: 8 }}>{f.icon} {f.titel}</h3>
            <p style={{ ...s.text, marginBottom: 8 }}>{f.beschreibung}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div><p style={s.label}>Förderung</p><p style={{ ...s.text, fontWeight: 600 }}>{f.hoehe}</p></div>
              <div><p style={s.label}>Dauer</p><p style={{ ...s.text, fontWeight: 600 }}>{f.dauer}</p></div>
              <div><p style={s.label}>Behörde</p><p style={s.text}>{f.behoerde}</p></div>
            </div>
            {f.warnung && (
              <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 8, padding: "8px 12px", marginTop: 10 }}>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#795548" }}>⚠️ {f.warnung}</p>
              </div>
            )}
          </div>
        ))}

        <div style={{ background: "#F5F0E8", borderRadius: 12, padding: 16, marginTop: 8 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2C2C2C", lineHeight: 1.7 }}>
            <strong>Beratung & Antragstellung:</strong><br />
            Integrationsamt: <a href="https://www.integrationsaemter.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>integrationsaemter.de</a><br />
            Agentur für Arbeit: <a href="https://www.arbeitsagentur.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>arbeitsagentur.de</a><br />
            EUTB (kostenlose Beratung): <a href="https://www.eutb.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>eutb.de</a>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => window.print()} style={{ background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "12px 28px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 500 }}>
            Als PDF drucken / speichern
          </button>
        </div>
      </div>
    </div>
  );
}

