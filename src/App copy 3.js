import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import PublicProfile from "./PublicProfile";
import MainApp from "./MainApp";


const NAV_ITEMS = ["Entdecken", "Jobs", "Firmen", "Community", "Profil"];

const WAITLIST_URL =
  "https://2dc38334.sibforms.com/serve/MUIFAPKpOnstY_-htfpGf8fSuN_3L6kSak_nq5bhpByLgceCY8Y4ELFy6yuneqI_G573gDtR1KAmb5Fkk7WHrhGXc3Ymc91KV9F95wvezX667FuUj-Q0XPJKutk5kc11IMYiH8umCTSuum50v4T5evlteY7oFAwPo05t1ZzxiUOtcTggYVSF4FtdLP1TZBYHjqLXC8vnMXFOX0hNlA==";

const JOBS = [
  { id: 1, title: "UX Researcher", company: "Klara GmbH", tags: ["Remote", "Flexible Zeiten", "Ruhiges Büro", "Kein Open Space"], type: "Vollzeit", color: "#7C9E87", match: 94, desc: "Wir suchen jemanden, der mit echtem Einfühlungsvermögen Nutzerbedürfnisse erforscht. Kein Daily-Standup-Zwang, async-first." },
  { id: 2, title: "Backend Entwickler:in", company: "Softalpha", tags: ["Hybrid", "Masking-frei", "ADHS-freundlich", "Ruhezonen"], type: "Teilzeit möglich", color: "#8B7EC8", match: 87, desc: "Python/Django. Wir kommunizieren schriftlich, Meetings nur wenn nötig. Du darfst Kopfhörer tragen, dich bewegen, deinen Rhythmus leben." },
  { id: 3, title: "Grafikdesign & Illustration", company: "Bunte Welt Verlag", tags: ["Vollständig Remote", "Async", "Flexible Deadlines", "Keine Kamera-Pflicht"], type: "Freelance", color: "#D4956A", match: 81, desc: "Kinderbuchillustrationen und Marketingmaterial. Wir respektieren deine Energie und arbeiten mit klaren, schriftlichen Briefings." },
  { id: 4, title: "Data Analyst:in", company: "GreenStats AG", tags: ["Remote", "Einzelbüro möglich", "Reizarme Umgebung"], type: "Vollzeit", color: "#5B9BAD", match: 76, desc: "Nachhaltigkeitsdaten analysieren und visualisieren. Kleines Team, flache Hierarchie, du bekommst klare Aufgaben mit Kontext." },
];

const COMPANIES = [
  { id: 1, name: "Klara GmbH", sector: "UX & Design", badge: "Zertifiziert inklusiv", checks: ["Neurodivergenz-Awareness-Training", "Flexible Arbeitszeiten", "Ruhezonen im Büro", "Async-First Kommunikation", "Individuelle Onboarding-Pläne"], employees: "45–60", color: "#7C9E87" },
  { id: 2, name: "Softalpha", sector: "Software & IT", badge: "ADHS-freundlich", checks: ["Kein Masking erwartet", "Kopfhörer-freundlich", "Schriftliche Kommunikation bevorzugt", "Reizarme Meetingräume"], employees: "20–35", color: "#8B7EC8" },
  { id: 3, name: "auticon Deutschland", sector: "IT-Consulting", badge: "Spezialisiert auf Autismus", checks: ["Von Autisten gegründet", "100% neurodivergente Mitarbeitende", "Job-Coaches inklusive", "Individuelle Begleitung"], employees: "200+", color: "#5B9BAD" },
];

const TAG_OPTIONS = {
  strengths: ["Empathisch", "Analytisch", "Kreativ", "Fokussiert", "Detailorientiert", "Strategisch", "Zuverlässig", "Kommunikationsstark", "Strukturiert", "Lösungsorientiert"],
  work_style: ["Async", "Schriftlich", "Mit klaren Aufgaben", "Mit viel Fokuszeit", "Eigenständig", "Im kleinen Team", "Remote", "Hybrid", "Mit Planbarkeit", "Kreativ frei"],
  needs: ["Flexible Zeiten", "Teilzeit möglich", "Remote möglich", "Hybrid möglich", "Asynchrone Kommunikation", "Schriftliche Kommunikation", "Klare Kommunikation", "Klare Prioritäten", "Klare Aufgabenbeschreibung", "Klare Deadlines", "Vorhersehbare Abläufe", "Feste Routinen", "Strukturierte Einarbeitung", "Buddy / Ansprechperson", "Job-Coaching", "Zusätzliche Check-ins", "Mehr Bearbeitungszeit", "Angepasste Zielvorgaben", "Flexible Pausen", "Zusätzliche Pausen", "Weniger Meetings", "Meetings nur mit Agenda", "Protokolle nach Meetings", "Aufgaben in kleinen Schritten", "Erinnerungen / Prompts", "Einzelgespräche statt Gruppenrunden", "Reizarme Umgebung", "Ruhiger Arbeitsplatz", "Einzelbüro", "Ruheraum", "Noise-Cancelling erlaubt", "Kopfhörer erlaubt", "Keine Kamera-Pflicht", "Wenig Kontextwechsel", "Ununterbrochene Fokuszeit", "Visuelle Planungs-Tools", "Schriftliche Briefings", "Keine spontanen Anrufe", "Vorbereitung vor Meetings", "Masking-freie Kultur", "Psychologische Sicherheit", "Sensorische Rücksichtnahme", "Reduzierte soziale Pflichttermine", "Barrierefreier Eingang", "Aufzug", "Rampe", "Automatische Türen", "Breite Wege / Türen", "Rollstuhlgerechter Arbeitsplatz", "Höhenverstellbarer Tisch", "Ergonomischer Stuhl", "Angepasste Arbeitsmittel", "Kurze Wege im Büro", "Parkplatz in der Nähe", "Barrierefreie Toilette", "Homeoffice statt Pendeln", "Screenreader-kompatible Tools", "Tastaturbedienbare Software", "Große Schrift", "Hoher Kontrast", "Vergrößerungssoftware", "Vorlesefunktionen", "Gute Beleuchtung", "Blendfreies Licht", "Untertitel / Captions", "Live-Transkription", "Gebärdensprachdolmetschung", "Schriftliche Zusammenfassungen", "Chat statt Telefon", "Visuelle Alarme", "Einfache Sprache", "Leichte Sprache", "Schritt-für-Schritt-Anleitungen", "Visuelle Anleitungen", "Mehr Zeit zum Lernen", "Flexible Startzeiten", "Späterer Arbeitsbeginn", "Pacing / Energiemanagement", "Sitz- und Stehoption", "Temperaturkontrolle", "Zugang zu Wasser / Snacks / Medikamenten", "Termine um Behandlungen herum", "Reduzierte Reisetätigkeit", "Arbeiten von zuhause bei Schub / Erschöpfung", "Weniger Lärm", "Weniger grelles Licht", "Parfümarme Umgebung", "Fester Sitzplatz", "Rückzugsort bei Überlastung"],
  skills: ["Research", "UX", "Schreiben", "Organisation", "Projektmanagement", "Figma", "Canva", "Beratung", "Moderation", "Content", "Konzeption", "Kommunikation"]
};

const NEED_CATEGORIES = [
  { title: "Organisation & Kommunikation", tags: ["Flexible Zeiten", "Teilzeit möglich", "Remote möglich", "Hybrid möglich", "Asynchrone Kommunikation", "Schriftliche Kommunikation", "Klare Kommunikation", "Klare Prioritäten", "Klare Aufgabenbeschreibung", "Klare Deadlines", "Vorhersehbare Abläufe", "Feste Routinen", "Strukturierte Einarbeitung", "Buddy / Ansprechperson", "Job-Coaching", "Zusätzliche Check-ins", "Mehr Bearbeitungszeit", "Angepasste Zielvorgaben", "Flexible Pausen", "Zusätzliche Pausen", "Weniger Meetings", "Meetings nur mit Agenda", "Protokolle nach Meetings", "Aufgaben in kleinen Schritten", "Erinnerungen / Prompts", "Einzelgespräche statt Gruppenrunden"] },
  { title: "Neurodivergenz & Reizregulation", tags: ["Reizarme Umgebung", "Ruhiger Arbeitsplatz", "Einzelbüro", "Ruheraum", "Noise-Cancelling erlaubt", "Kopfhörer erlaubt", "Keine Kamera-Pflicht", "Wenig Kontextwechsel", "Ununterbrochene Fokuszeit", "Visuelle Planungs-Tools", "Schriftliche Briefings", "Keine spontanen Anrufe", "Vorbereitung vor Meetings", "Masking-freie Kultur", "Psychologische Sicherheit", "Sensorische Rücksichtnahme", "Reduzierte soziale Pflichttermine", "Weniger Lärm", "Weniger grelles Licht", "Parfümarme Umgebung", "Fester Sitzplatz", "Rückzugsort bei Überlastung"] },
  { title: "Mobilität & körperliche Barrierefreiheit", tags: ["Barrierefreier Eingang", "Aufzug", "Rampe", "Automatische Türen", "Breite Wege / Türen", "Rollstuhlgerechter Arbeitsplatz", "Höhenverstellbarer Tisch", "Ergonomischer Stuhl", "Angepasste Arbeitsmittel", "Kurze Wege im Büro", "Parkplatz in der Nähe", "Barrierefreie Toilette", "Homeoffice statt Pendeln"] },
  { title: "Sehen", tags: ["Screenreader-kompatible Tools", "Tastaturbedienbare Software", "Große Schrift", "Hoher Kontrast", "Vergrößerungssoftware", "Vorlesefunktionen", "Gute Beleuchtung", "Blendfreies Licht"] },
  { title: "Hören", tags: ["Untertitel / Captions", "Live-Transkription", "Gebärdensprachdolmetschung", "Schriftliche Zusammenfassungen", "Chat statt Telefon", "Visuelle Alarme"] },
  { title: "Lernen & Verstehen", tags: ["Einfache Sprache", "Leichte Sprache", "Schritt-für-Schritt-Anleitungen", "Visuelle Anleitungen", "Mehr Zeit zum Lernen"] },
  { title: "Energie, Gesundheit & Belastung", tags: ["Flexible Startzeiten", "Späterer Arbeitsbeginn", "Pacing / Energiemanagement", "Sitz- und Stehoption", "Temperaturkontrolle", "Zugang zu Wasser / Snacks / Medikamenten", "Termine um Behandlungen herum", "Reduzierte Reisetätigkeit", "Arbeiten von zuhause bei Schub / Erschöpfung"] },
];

const createTagField = () => ({ tags: [], custom: "" });

const EMPTY_PROFILE = {
  full_name: "", headline: "", strengths: createTagField(), work_style: createTagField(),
  needs: createTagField(), skills: createTagField(), work_model: "", looking_for_work: false, avatar_url: "",
};

function parseStoredField(value) {
  if (!value) return createTagField();
  try {
    const parsed = JSON.parse(value);
    if (parsed && Array.isArray(parsed.tags)) return { tags: parsed.tags, custom: parsed.custom || "" };
  } catch (error) {
    return { tags: [], custom: typeof value === "string" ? value : "" };
  }
  return createTagField();
}

function serializeField(value) {
  return JSON.stringify({ tags: value?.tags || [], custom: value?.custom || "" });
}

function renderTagFieldPreview(field) {
  const tags = field?.tags || [];
  const custom = field?.custom?.trim() || "";
  const parts = [...tags, custom].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Noch nichts eingetragen.";
}



function TagField({ label, options, value, onChange, placeholder, categories }) {
  const selectedTags = value?.tags || [];
  const customText = value?.custom || "";

  const toggleTag = (tag) => {
    const nextTags = selectedTags.includes(tag) ? selectedTags.filter((item) => item !== tag) : [...selectedTags, tag];
    onChange({ tags: nextTags, custom: customText });
  };

  const renderTagButton = (tag) => {
    const selected = selectedTags.includes(tag);
    return (
      <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ border: selected ? "1.5px solid #2C2C2C" : "1.5px solid #E2DBD0", background: selected ? "#2C2C2C" : "#F8F4ED", color: selected ? "#F5F0E8" : "#444", borderRadius: 999, padding: "8px 12px", fontFamily: "Source Sans 3", fontSize: 13, cursor: "pointer" }}>
        {tag}
      </button>
    );
  };

  return (
    <div>
      <label style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 8 }}>{label}</label>
      {categories ? (
        <div style={{ display: "grid", gap: 16, marginBottom: 12 }}>
          {categories.map((category) => (
            <div key={category.title} style={{ background: "#FCFAF6", border: "1px solid #EAE2D8", borderRadius: 16, padding: 14 }}>
              <div style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>{category.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{category.tags.map(renderTagButton)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>{options.map(renderTagButton)}</div>
      )}
      <textarea value={customText} onChange={(e) => onChange({ tags: selectedTags, custom: e.target.value })} placeholder={placeholder} rows={3}
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F8F4ED", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 90 }} />
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Fehler: " + error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Fehler: " + error.message);
      else setMessage("✓ Bestätigungs-E-Mail gesendet. Bitte prüfe dein Postfach.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 24, padding: 40, width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: "#2C2C2C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#F5F0E8", fontSize: 16 }}>∞</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22 }}>mole</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{mode === "login" ? "Willkommen zurück" : "Jetzt registrieren"}</h2>
        <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 14, marginBottom: 28 }}>Inklusiv. Für uns. Ab sofort.</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 }}>E-Mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.de" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F5F0E8", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 }}>Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F5F0E8", outline: "none", boxSizing: "border-box" }} />
        </div>
        {message && <div style={{ padding: "12px 16px", borderRadius: 12, background: message.includes("Fehler") ? "#FEE2E2" : "#EEF7F1", color: message.includes("Fehler") ? "#DC2626" : "#2D7A4F", fontFamily: "Source Sans 3", fontSize: 13, marginBottom: 16 }}>{message}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "14px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
          {loading ? "..." : mode === "login" ? "Einloggen" : "Registrieren"}
        </button>
        <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", textAlign: "center" }}>
          {mode === "login" ? "Noch kein Account? " : "Schon dabei? "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: "#8B7EC8", cursor: "pointer", fontWeight: 500 }}>{mode === "login" ? "Registrieren" : "Einloggen"}</span>
        </p>
      </div>
    </div>
  );
}

// Routing-Komponente die entscheidet ob App oder öffentliches Profil
export default function App() {
  const path = window.location.pathname;
  const publicMatch = path.match(/^\/profil\/(.+)$/);

  if (publicMatch) {
    return <PublicProfile userId={publicMatch[1]} />;
  }

  return <MainApp />;
}

