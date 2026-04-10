import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { parseStoredField } from "./profileUtils";
import { COLORS, FONT } from "./constants";

// Bedürfnisse nach Kategorien zuordnen
const NEED_MAP = {
  "Organisation & Kommunikation": ["Flexible Zeiten","Teilzeit möglich","Remote möglich","Hybrid möglich","Asynchrone Kommunikation","Schriftliche Kommunikation","Klare Kommunikation","Klare Prioritäten","Klare Aufgabenbeschreibung","Klare Deadlines","Vorhersehbare Abläufe","Feste Routinen","Strukturierte Einarbeitung","Buddy / Ansprechperson","Job-Coaching","Zusätzliche Check-ins","Mehr Bearbeitungszeit","Angepasste Zielvorgaben","Flexible Pausen","Zusätzliche Pausen","Weniger Meetings","Meetings nur mit Agenda","Protokolle nach Meetings","Aufgaben in kleinen Schritten","Erinnerungen / Prompts","Einzelgespräche statt Gruppenrunden"],
  "Neurodivergenz & Reizregulation": ["Reizarme Umgebung","Ruhiger Arbeitsplatz","Einzelbüro","Ruheraum","Noise-Cancelling erlaubt","Kopfhörer erlaubt","Keine Kamera-Pflicht","Wenig Kontextwechsel","Ununterbrochene Fokuszeit","Visuelle Planungs-Tools","Schriftliche Briefings","Keine spontanen Anrufe","Vorbereitung vor Meetings","Masking-freie Kultur","Psychologische Sicherheit","Sensorische Rücksichtnahme","Reduzierte soziale Pflichttermine","Weniger Lärm","Weniger grelles Licht","Parfümarme Umgebung","Fester Sitzplatz","Rückzugsort bei Überlastung"],
  "Mobilität & Barrierefreiheit": ["Barrierefreier Eingang","Aufzug","Rampe","Automatische Türen","Breite Wege / Türen","Rollstuhlgerechter Arbeitsplatz","Höhenverstellbarer Tisch","Ergonomischer Stuhl","Angepasste Arbeitsmittel","Kurze Wege im Büro","Parkplatz in der Nähe","Barrierefreie Toilette","Homeoffice statt Pendeln"],
  "Sehen": ["Screenreader-kompatible Tools","Tastaturbedienbare Software","Große Schrift","Hoher Kontrast","Vergrößerungssoftware","Vorlesefunktionen","Gute Beleuchtung","Blendfreies Licht"],
  "Hören": ["Untertitel / Captions","Live-Transkription","Gebärdensprachdolmetschung","Schriftliche Zusammenfassungen","Chat statt Telefon","Visuelle Alarme"],
  "Lernen & Verstehen": ["Einfache Sprache","Leichte Sprache","Schritt-für-Schritt-Anleitungen","Visuelle Anleitungen","Mehr Zeit zum Lernen"],
  "Energie & Gesundheit": ["Flexible Startzeiten","Späterer Arbeitsbeginn","Pacing / Energiemanagement","Sitz- und Stehoption","Temperaturkontrolle","Zugang zu Wasser / Snacks / Medikamenten","Termine um Behandlungen herum","Reduzierte Reisetätigkeit","Arbeiten von zuhause bei Schub / Erschöpfung"],
};

function categorize(allNeeds) {
  const result = {};
  const rest = [];
  allNeeds.forEach(n => {
    let found = false;
    for (const [cat, tags] of Object.entries(NEED_MAP)) {
      if (tags.includes(n)) { result[cat] = [...(result[cat] || []), n]; found = true; break; }
    }
    if (!found) rest.push(n);
  });
  if (rest.length) result["Weitere"] = rest;
  return result;
}

// Aufklappbare Sektion — alle standardmäßig ZUGEKLAPPT
function Section({ title, children, accent = COLORS.purple, count }) {
  const [open, setOpen] = useState(false);
  if (!count) return null;
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "16px 0", background: "none",
          border: "none", cursor: "pointer", textAlign: "left", gap: 12,
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{
            background: accent + "22", color: accent, border: `1px solid ${accent}44`,
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            padding: "2px 10px", fontFamily: FONT,
          }}>{count}</span>
          <span style={{ color: accent, fontSize: 20, lineHeight: 1, fontWeight: 300 }}>
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

function TagCloud({ tags, color = COLORS.purple }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tags.map(t => (
        <span key={t} style={{
          padding: "7px 16px", borderRadius: 8,
          background: color + "22", color,
          border: `1.5px solid ${color}55`,
          fontSize: 15, fontFamily: FONT, lineHeight: 1.4, fontWeight: 500,
        }}>{t}</span>
      ))}
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
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (data) {
        setProfile({
          ...data,
          strengths: parseStoredField(data.strengths),
          strengths_professional: parseStoredField(data.strengths_professional),
          strengths_others: parseStoredField(data.strengths_others),
          strengths_special: parseStoredField(data.strengths_special),
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
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94A3B8", fontFamily: FONT, fontSize: 16 }}>Profil wird geladen…</p>
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <p style={{ color: "#94A3B8", fontFamily: FONT, fontSize: 16 }}>Profil nicht gefunden.</p>
      <a href="/" style={{ color: COLORS.purple, fontFamily: FONT }}>← Zurück</a>
    </div>
  );

  const initials = profile.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const all = (field) => [...(field?.tags || []), field?.custom?.trim()].filter(Boolean);

  const strengths = all(profile.strengths);
  const strengthsPro = all(profile.strengths_professional);
  const strengthsOthers = all(profile.strengths_others);
  const strengthsSpecial = all(profile.strengths_special);
  const skills = all(profile.skills);
  const workStyle = all(profile.work_style);
  const comm = all(profile.communication_prefs);
  const tech = all(profile.assistive_tech);
  const needs = all(profile.needs);
  const categorizedNeeds = categorize(needs);

  const card = {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 16,
  };

  const sectionLabel = {
    fontFamily: FONT, fontSize: 12, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#64748B", marginBottom: 16,
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :focus-visible { outline: 3px solid ${COLORS.purple}; outline-offset: 3px; border-radius: 4px; }
        @media print { .no-print { display: none !important; } }
        @media (max-width: 600px) { .hero-flex { flex-direction: column !important; } }
      `}</style>

      {/* Header — nur im eingebetteten Modus */}
      {!isPublic && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 20 }} className="no-print">
          <button onClick={() => window.print()} style={{
            background: "transparent", border: `1.5px solid ${COLORS.border}`,
            color: "#CBD5E1", padding: "10px 18px", borderRadius: 10,
            cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 500,
          }}>
            ⬇ Als PDF
          </button>
          {onEdit && (
            <button onClick={onEdit} style={{
              background: COLORS.purple, border: "none", color: "white",
              padding: "10px 20px", borderRadius: 10, cursor: "pointer",
              fontFamily: FONT, fontSize: 14, fontWeight: 600,
            }}>
              ✏️ Bearbeiten
            </button>
          )}
        </div>
      )}

      {/* Hero */}
      <div style={card}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }} className="hero-flex">
          {profile.avatar_url ? (
            <div style={{ width: 110, height: 110, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `3px solid ${COLORS.purple}`, position: "relative" }}>
              <img
                src={profile.avatar_url}
                alt={`Foto von ${profile.full_name}`}
                draggable={false}
                style={{
                  width: "160%", height: "160%",
                  objectFit: "cover",
                  position: "absolute",
                  left: `${profile.avatar_x ?? -30}%`,
                  top: `${profile.avatar_y ?? -30}%`,
                }}
              />
            </div>
          ) : (
            <div style={{ width: 110, height: 110, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.purple}, #7C3AED)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 36, fontWeight: 700, color: "white" }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: "#F8FAFC",
              marginBottom: 8, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              {profile.full_name || "Anonym"}
            </h1>
            {profile.headline && (
              <p style={{ fontSize: 19, color: "#CBD5E1", marginBottom: 12, lineHeight: 1.5, fontWeight: 500 }}>
                {profile.headline}
              </p>
            )}
            {profile.bio && (
              <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.75,
                marginBottom: 14, fontStyle: "italic", borderLeft: `3px solid ${COLORS.purple}`,
                paddingLeft: 14 }}>
                {profile.bio}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.looking_for_work && (
                <span style={{ background: COLORS.greenBg, color: COLORS.green,
                  fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 8,
                  border: `1px solid ${COLORS.greenBorder}` }}>
                  ✓ Offen für Stellen
                </span>
              )}
              {profile.work_model && (
                <span style={{ background: COLORS.bgInput, color: "#CBD5E1",
                  fontSize: 13, fontWeight: 500, padding: "5px 14px", borderRadius: 8,
                  border: `1px solid ${COLORS.border}` }}>
                  📍 {profile.work_model}
                </span>
              )}
              {profile.availability && (
                <span style={{ background: COLORS.yellowBg, color: COLORS.yellow,
                  fontSize: 13, fontWeight: 500, padding: "5px 14px", borderRadius: 8,
                  border: `1px solid ${COLORS.yellowBorder}` }}>
                  🗓 {profile.availability}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stärken */}
      {(strengths.length > 0 || strengthsPro.length > 0 || strengthsOthers.length > 0 || strengthsSpecial.length > 0 || skills.length > 0 || profile.special_interests) && (
        <div style={card}>
          <p style={sectionLabel}>Stärken & Kompetenzen</p>
          <Section title="Persönliche Stärken" count={strengths.length} accent={COLORS.purple}>
            <TagCloud tags={strengths} color={COLORS.purple} />
          </Section>
          <Section title="Fachliche Stärken" count={strengthsPro.length} accent={COLORS.green}>
            <TagCloud tags={strengthsPro} color={COLORS.green} />
          </Section>
          <Section title="Skills & Tools" count={skills.length} accent={COLORS.yellow}>
            <TagCloud tags={skills} color={COLORS.yellow} />
          </Section>
          <Section title="Wie andere mich erleben" count={strengthsOthers.length} accent={COLORS.purple}>
            <TagCloud tags={strengthsOthers} color={COLORS.purple} />
          </Section>
          <Section title="Besondere Fähigkeiten" count={strengthsSpecial.length} accent={COLORS.green}>
            <TagCloud tags={strengthsSpecial} color={COLORS.green} />
          </Section>
          {profile.special_interests && (
            <Section title="Spezialinteressen" count={1} accent={COLORS.yellow}>
              <p style={{ fontSize: 15, color: "#CBD5E1", lineHeight: 1.7 }}>
                {profile.special_interests}
              </p>
            </Section>
          )}
        </div>
      )}

      {/* Arbeitsweise */}
      {(workStyle.length > 0 || comm.length > 0 || tech.length > 0) && (
        <div style={card}>
          <p style={sectionLabel}>Wie ich arbeite</p>
          <Section title="Arbeitsstil" count={workStyle.length} accent={COLORS.green}>
            <TagCloud tags={workStyle} color={COLORS.green} />
          </Section>
          <Section title="Kommunikation" count={comm.length} accent={COLORS.green}>
            <TagCloud tags={comm} color={COLORS.green} />
          </Section>
          <Section title="Hilfsmittel & Technologien" count={tech.length} accent={COLORS.green}>
            <TagCloud tags={tech} color={COLORS.green} />
          </Section>
        </div>
      )}

      {/* Bedürfnisse */}
      {needs.length > 0 && (
        <div style={card}>
          <p style={sectionLabel}>Was ich brauche um gut zu arbeiten</p>
          <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 16 }}>
            Aufgeklappt per Kategorie — klick um zu öffnen:
          </p>
          {Object.entries(categorizedNeeds).map(([cat, items]) => (
            <Section key={cat} title={cat} count={items.length} accent={COLORS.purple}>
              <TagCloud tags={items} color={COLORS.purple} />
            </Section>
          ))}
        </div>
      )}

      {/* Werdegang */}
      {(profile.experience || profile.education || profile.languages) && (
        <div style={card}>
          <p style={sectionLabel}>Werdegang</p>
          <Section title="Berufserfahrung" count={profile.experience ? 1 : 0} accent={COLORS.yellow}>
            <p style={{ fontSize: 16, color: "#CBD5E1", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {profile.experience}
            </p>
          </Section>
          <Section title="Ausbildung & Bildungsweg" count={profile.education ? 1 : 0} accent={COLORS.yellow}>
            <p style={{ fontSize: 16, color: "#CBD5E1", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {profile.education}
            </p>
          </Section>
          <Section title="Sprachen" count={profile.languages ? 1 : 0} accent={COLORS.yellow}>
            <p style={{ fontSize: 16, color: "#CBD5E1", lineHeight: 1.8 }}>
              {profile.languages}
            </p>
          </Section>
        </div>
      )}

      {/* Kontakt — nur eingeloggt */}
      {!isPublic && profile.contact_info && (
        <div style={card}>
          <p style={sectionLabel}>Kontakt</p>
          <p style={{ fontSize: 15, color: "#CBD5E1", lineHeight: 1.7 }}>
            {profile.contact_info}
          </p>
        </div>
      )}

      {isPublic && (
        <footer style={{ textAlign: "center", marginTop: 40, paddingBottom: 40 }} className="no-print">
          <p style={{ fontSize: 13, color: "#94A3B8" }}>
            Erstellt mit{" "}
            <a href="/" style={{ color: COLORS.purple }}>Diffusion</a>
            {" "}— Different.Inclusion
          </p>
        </footer>
      )}
    </div>
  );
}
