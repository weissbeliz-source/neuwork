import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { parseStoredField } from "./profileUtils";

const NEED_CATEGORIES_MAP = {
  "Organisation & Kommunikation": ["Flexible Zeiten", "Teilzeit möglich", "Remote möglich", "Hybrid möglich", "Asynchrone Kommunikation", "Schriftliche Kommunikation", "Klare Kommunikation", "Klare Prioritäten", "Klare Aufgabenbeschreibung", "Klare Deadlines", "Vorhersehbare Abläufe", "Feste Routinen", "Strukturierte Einarbeitung", "Buddy / Ansprechperson", "Job-Coaching", "Zusätzliche Check-ins", "Mehr Bearbeitungszeit", "Angepasste Zielvorgaben", "Flexible Pausen", "Zusätzliche Pausen", "Weniger Meetings", "Meetings nur mit Agenda", "Protokolle nach Meetings", "Aufgaben in kleinen Schritten", "Erinnerungen / Prompts", "Einzelgespräche statt Gruppenrunden"],
  "Neurodivergenz & Reizregulation": ["Reizarme Umgebung", "Ruhiger Arbeitsplatz", "Einzelbüro", "Ruheraum", "Noise-Cancelling erlaubt", "Kopfhörer erlaubt", "Keine Kamera-Pflicht", "Wenig Kontextwechsel", "Ununterbrochene Fokuszeit", "Visuelle Planungs-Tools", "Schriftliche Briefings", "Keine spontanen Anrufe", "Vorbereitung vor Meetings", "Masking-freie Kultur", "Psychologische Sicherheit", "Sensorische Rücksichtnahme", "Reduzierte soziale Pflichttermine", "Weniger Lärm", "Weniger grelles Licht", "Parfümarme Umgebung", "Fester Sitzplatz", "Rückzugsort bei Überlastung"],
  "Mobilität & Barrierefreiheit": ["Barrierefreier Eingang", "Aufzug", "Rampe", "Automatische Türen", "Breite Wege / Türen", "Rollstuhlgerechter Arbeitsplatz", "Höhenverstellbarer Tisch", "Ergonomischer Stuhl", "Angepasste Arbeitsmittel", "Kurze Wege im Büro", "Parkplatz in der Nähe", "Barrierefreie Toilette", "Homeoffice statt Pendeln"],
  "Sehen": ["Screenreader-kompatible Tools", "Tastaturbedienbare Software", "Große Schrift", "Hoher Kontrast", "Vergrößerungssoftware", "Vorlesefunktionen", "Gute Beleuchtung", "Blendfreies Licht"],
  "Hören": ["Untertitel / Captions", "Live-Transkription", "Gebärdensprachdolmetschung", "Schriftliche Zusammenfassungen", "Chat statt Telefon", "Visuelle Alarme"],
  "Lernen & Verstehen": ["Einfache Sprache", "Leichte Sprache", "Schritt-für-Schritt-Anleitungen", "Visuelle Anleitungen", "Mehr Zeit zum Lernen"],
  "Energie & Gesundheit": ["Flexible Startzeiten", "Späterer Arbeitsbeginn", "Pacing / Energiemanagement", "Sitz- und Stehoption", "Temperaturkontrolle", "Zugang zu Wasser / Snacks / Medikamenten", "Termine um Behandlungen herum", "Reduzierte Reisetätigkeit", "Arbeiten von zuhause bei Schub / Erschöpfung"],
};

function categorizeNeeds(allNeeds) {
  const result = {};
  const uncategorized = [];
  allNeeds.forEach(need => {
    let found = false;
    for (const [cat, tags] of Object.entries(NEED_CATEGORIES_MAP)) {
      if (tags.includes(need)) { result[cat] = [...(result[cat] || []), need]; found = true; break; }
    }
    if (!found) uncategorized.push(need);
  });
  if (uncategorized.length) result["Weitere Bedürfnisse"] = uncategorized;
  return result;
}

function CollapsibleSection({ title, children, defaultOpen = false, accent = "#A855F7" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #1e1e1e" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>{title}</span>
        <span style={{ color: accent, fontSize: 18, lineHeight: 1 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

export default function PublicProfile({ userId, isPublic = false, onEdit }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        setProfile({
          ...data,
          strengths: parseStoredField(data.strengths),
          strengths_professional: parseStoredField(data.strengths_professional),
          work_style: parseStoredField(data.work_style),
          communication_prefs: parseStoredField(data.communication_prefs),
          assistive_tech: parseStoredField(data.assistive_tech),
          needs: parseStoredField(data.needs),
          skills: parseStoredField(data.skills),
        });
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "'Space Grotesk', sans-serif" }}>Lädt…</p>
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <p style={{ color: "#555", fontFamily: "'Space Grotesk', sans-serif" }}>Profil nicht gefunden.</p>
      <a href="/" style={{ color: "#A855F7", fontFamily: "'Space Grotesk', sans-serif" }}>← Zurück</a>
    </div>
  );

  const initials = profile.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const allNeeds = [...(profile.needs?.tags || []), profile.needs?.custom?.trim()].filter(Boolean);
  const allStrengths = [...(profile.strengths?.tags || []), profile.strengths?.custom?.trim()].filter(Boolean);
  const allStrengthsPro = [...(profile.strengths_professional?.tags || []), profile.strengths_professional?.custom?.trim()].filter(Boolean);
  const allSkills = [...(profile.skills?.tags || []), profile.skills?.custom?.trim()].filter(Boolean);
  const allWorkStyle = [...(profile.work_style?.tags || []), profile.work_style?.custom?.trim()].filter(Boolean);
  const allComm = [...(profile.communication_prefs?.tags || []), profile.communication_prefs?.custom?.trim()].filter(Boolean);
  const allTech = [...(profile.assistive_tech?.tags || []), profile.assistive_tech?.custom?.trim()].filter(Boolean);
  const categorizedNeeds = categorizeNeeds(allNeeds);

  const tag = (t, color = "#A855F7") => (
    <span key={t} style={{ display: "inline-block", padding: "5px 12px", borderRadius: 6, background: color + "22", color, fontSize: 13, border: `1px solid ${color}44`, margin: "3px 4px 3px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{t}</span>
  );

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } :focus-visible { outline: 3px solid #A855F7; outline-offset: 3px; } @media print { .no-print { display: none !important; } }`}</style>

      {/* Skip Link */}
      <a href="#main-content" style={{ position: "absolute", top: -100, left: 0, background: "#A855F7", color: "white", padding: "8px 16px", zIndex: 9999, textDecoration: "none", borderRadius: 4 }}>Zum Inhalt springen</a>

      {/* Header */}
      <header style={s.header} className="no-print">
        <div style={s.headerInner}>
          <a href="/" style={s.logoLink}>
            <div style={s.logoMark}>
              <div style={s.lc1} /><div style={s.lc2} />
            </div>
            <div>
              <p style={s.logoName}>Diffusion</p>
              <p style={s.logoSub}>Different.Inclusion</p>
            </div>
          </a>
          <div style={{ display: "flex", gap: 10 }} className="no-print">
            {!isPublic && onEdit && (
              <button onClick={onEdit} style={s.editBtn}>✏️ Bearbeiten</button>
            )}
            <button onClick={() => window.print()} style={s.pdfBtn} aria-label="Als PDF speichern">
              ⬇ Als PDF
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" style={s.main}>

        {/* Hero */}
        <div style={s.card}>
          <div style={s.heroInner}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={`Foto von ${profile.full_name}`} style={s.avatar} />
            ) : (
              <div style={s.avatarFallback} aria-hidden="true">
                <span style={s.avatarInitials}>{initials}</span>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={s.name}>{profile.full_name || "Anonym"}</h1>
              {profile.headline && <p style={s.headline}>{profile.headline}</p>}
              {profile.bio && <p style={s.bio}>"{profile.bio}"</p>}
              <div style={s.badges}>
                {profile.looking_for_work && <span style={s.badgeGreen}>✓ Offen für Stellen</span>}
                {profile.work_model && <span style={s.badgeGray}>📍 {profile.work_model}</span>}
                {profile.availability && <span style={s.badgeYellow}>🗓 {profile.availability}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Stärken */}
        {(allStrengths.length > 0 || allStrengthsPro.length > 0 || allSkills.length > 0) && (
          <div style={s.card}>
            {allStrengths.length > 0 && (
              <CollapsibleSection title="Persönliche Stärken" defaultOpen={true} accent="#A855F7">
                <div>{allStrengths.map(t => tag(t, "#A855F7"))}</div>
              </CollapsibleSection>
            )}
            {allStrengthsPro.length > 0 && (
              <CollapsibleSection title="Fachliche Stärken" defaultOpen={true} accent="#4ade80">
                <div>{allStrengthsPro.map(t => tag(t, "#4ade80"))}</div>
              </CollapsibleSection>
            )}
            {allSkills.length > 0 && (
              <CollapsibleSection title="Skills & Tools" defaultOpen={true} accent="#facc15">
                <div>{allSkills.map(t => tag(t, "#facc15"))}</div>
              </CollapsibleSection>
            )}
            {profile.special_interests && (
              <CollapsibleSection title="Spezialinteressen" defaultOpen={false} accent="#A855F7">
                <p style={s.bodyText}>{profile.special_interests}</p>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* Arbeitsweise */}
        {(allWorkStyle.length > 0 || allComm.length > 0 || allTech.length > 0) && (
          <div style={s.card}>
            {allWorkStyle.length > 0 && (
              <CollapsibleSection title="Wie ich arbeite" defaultOpen={true} accent="#4ade80">
                <div>{allWorkStyle.map(t => tag(t, "#4ade80"))}</div>
              </CollapsibleSection>
            )}
            {allComm.length > 0 && (
              <CollapsibleSection title="Kommunikation" defaultOpen={false} accent="#4ade80">
                <div>{allComm.map(t => tag(t, "#4ade80"))}</div>
              </CollapsibleSection>
            )}
            {allTech.length > 0 && (
              <CollapsibleSection title="Ich arbeite effektiv mit" defaultOpen={false} accent="#4ade80">
                <div>{allTech.map(t => tag(t, "#4ade80"))}</div>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* Bedürfnisse — kategorisiert & aufklappbar */}
        {allNeeds.length > 0 && (
          <div style={s.card}>
            <p style={s.sectionLabel}>Was ich brauche um gut zu arbeiten</p>
            <p style={{ ...s.bodyText, marginBottom: 16, color: "#666" }}>Aufgeklappt sind die Kategorien die für mich relevant sind:</p>
            {Object.entries(categorizedNeeds).map(([cat, needs]) => (
              <CollapsibleSection key={cat} title={`${cat} (${needs.length})`} defaultOpen={needs.length <= 6} accent="#A855F7">
                <div>{needs.map(t => tag(t, "#A855F7"))}</div>
              </CollapsibleSection>
            ))}
          </div>
        )}

        {/* Werdegang */}
        {(profile.experience || profile.education || profile.languages) && (
          <div style={s.card}>
            {profile.experience && (
              <CollapsibleSection title="Berufserfahrung" defaultOpen={true} accent="#facc15">
                <p style={s.bodyText}>{profile.experience}</p>
              </CollapsibleSection>
            )}
            {profile.education && (
              <CollapsibleSection title="Werdegang" defaultOpen={true} accent="#facc15">
                <p style={s.bodyText}>{profile.education}</p>
              </CollapsibleSection>
            )}
            {profile.languages && (
              <CollapsibleSection title="Sprachen" defaultOpen={true} accent="#facc15">
                <p style={s.bodyText}>{profile.languages}</p>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* Kontakt — nur wenn vorhanden und nicht öffentlich */}
        {!isPublic && profile.contact_info && (
          <div style={s.card}>
            <p style={s.sectionLabel}>Kontakt</p>
            <p style={s.bodyText}>{profile.contact_info}</p>
          </div>
        )}

        <footer style={{ textAlign: "center", marginTop: 40, paddingBottom: 40 }} className="no-print">
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#333" }}>
            Erstellt mit <a href="/" style={{ color: "#A855F7" }}>Diffusion</a> — Different.Inclusion
          </p>
        </footer>
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0A0A0A", fontFamily: "'Space Grotesk', sans-serif", color: "white" },
  header: { background: "#0A0A0A", borderBottom: "1px solid #1e1e1e", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: 800, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoLink: { display: "flex", alignItems: "center", gap: 12, textDecoration: "none" },
  logoMark: { position: "relative", width: 36, height: 36 },
  lc1: { position: "absolute", top: 0, left: 0, width: 24, height: 24, borderRadius: "50%", background: "#A855F7" },
  lc2: { position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#4ade80", opacity: 0.85 },
  logoName: { fontSize: 18, fontWeight: 700, color: "white", letterSpacing: "-0.5px" },
  logoSub: { fontSize: 10, color: "#444", letterSpacing: "0.05em" },
  editBtn: { background: "transparent", border: "1.5px solid #A855F7", color: "#A855F7", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600 },
  pdfBtn: { background: "#A855F7", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600 },
  main: { maxWidth: 800, margin: "0 auto", padding: "32px 24px 64px" },
  card: { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 14, padding: "24px 28px", marginBottom: 16 },
  heroInner: { display: "flex", gap: 24, alignItems: "flex-start" },
  avatar: { width: 120, height: 120, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #A855F7" },
  avatarFallback: { width: 120, height: 120, borderRadius: "50%", background: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarInitials: { color: "white", fontSize: 36, fontWeight: 700 },
  name: { fontSize: 28, fontWeight: 700, color: "white", marginBottom: 6, letterSpacing: "-0.5px" },
  headline: { fontSize: 16, color: "#aaa", marginBottom: 8, lineHeight: 1.5 },
  bio: { fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: 12, fontStyle: "italic" },
  badges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badgeGreen: { background: "#4ade8022", color: "#4ade80", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid #4ade8044" },
  badgeGray: { background: "#ffffff11", color: "#aaa", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid #333" },
  badgeYellow: { background: "#facc1522", color: "#facc15", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid #facc1544" },
  sectionLabel: { fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 12 },
  bodyText: { fontSize: 15, color: "#aaa", lineHeight: 1.7 },
};
