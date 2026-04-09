import { COLORS, FONT } from "./constants";

// Lebenslauf-Druck-Styles — nach dem Vorbild
const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: white; color: #1a1a2e; font-family: 'Schibsted Grotesk', Arial, sans-serif; }

  @media print {
    @page { margin: 15mm 18mm; size: A4; }
    .no-print { display: none !important; }
    body { background: white !important; color: #1a1a2e !important; }
    .page-break { page-break-before: always; }
  }

  @media screen {
    body { background: #f1f5f9; padding: 40px 20px; }
    .cv-page { box-shadow: 0 4px 32px rgba(0,0,0,0.12); max-width: 794px; margin: 0 auto 40px; }
  }
`;

function CVPage({ children }) {
  return (
    <div className="cv-page" style={{ background: "white", padding: "40px 48px", minHeight: "297mm" }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, color = "#1e3a5f" }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ height: 1, background: "#ccc", flex: 1 }} />
        <h2 style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, fontWeight: 600, color, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
          ― {children} ―
        </h2>
        <div style={{ height: 1, background: "#ccc", flex: 1 }} />
      </div>
    </div>
  );
}

function ExperienceEntry({ text }) {
  if (!text) return null;
  // Parst Erfahrungs-Einträge die mit "DATUM — Firma\nRolle\n- Aufgabe" formatiert sind
  const lines = text.split("\n").filter(l => l.trim());
  const entries = [];
  let current = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^\d{2}[/.]\d{4}/) || trimmed.match(/^\d{4}/) || trimmed.toLowerCase().includes(" – ") || trimmed.toLowerCase().includes(" - ")) {
      if (current) entries.push(current);
      current = { header: trimmed, role: "", bullets: [] };
    } else if (current && !current.role && !trimmed.startsWith("-") && !trimmed.startsWith("•")) {
      current.role = trimmed;
    } else if (current && (trimmed.startsWith("-") || trimmed.startsWith("•"))) {
      current.bullets.push(trimmed.replace(/^[-•]\s*/, ""));
    } else if (current) {
      current.bullets.push(trimmed);
    }
  });
  if (current) entries.push(current);

  if (entries.length === 0) {
    // Freitext — einfach anzeigen
    return (
      <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, marginTop: 8, whiteSpace: "pre-wrap" }}>
        {text}
      </p>
    );
  }

  return (
    <div>
      {entries.map((e, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 11, color: "#888", lineHeight: 1.5, paddingTop: 2 }}>
            {e.header}
          </span>
          <div>
            {e.role && (
              <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>
                {e.role}
              </p>
            )}
            {e.bullets.map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                <span style={{ color: "#1e3a5f", flexShrink: 0, fontSize: 13 }}>·</span>
                <span style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LebenslaufExport({ profile, onClose }) {
  if (!profile) return null;

  const all = (field) => [...(field?.tags || []), field?.custom?.trim()].filter(Boolean);

  const strengths = all(profile.strengths);
  const strengthsPro = all(profile.strengths_professional);
  const skills = all(profile.skills);
  const workStyle = all(profile.work_style);
  const needs = all(profile.needs);

  // Wichtigste Bedürfnisse — max 8 für Lebenslauf
  const topNeeds = needs.slice(0, 8);

  const accentColor = "#1e3a5f";

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk', Arial, sans-serif" }}>
      <style>{PRINT_STYLES}</style>

      {/* Buttons — nicht drucken */}
      <div className="no-print" style={{
        maxWidth: 794, margin: "0 auto 20px",
        display: "flex", gap: 10, justifyContent: "flex-end"
      }}>
        <button onClick={onClose} style={{
          background: "transparent", border: `1px solid ${COLORS.border}`,
          color: COLORS.textSecondary, padding: "10px 20px", borderRadius: 8,
          cursor: "pointer", fontFamily: FONT, fontSize: 14,
        }}>
          ← Zurück
        </button>
        <button onClick={() => window.print()} style={{
          background: accentColor, border: "none", color: "white",
          padding: "10px 24px", borderRadius: 8, cursor: "pointer",
          fontFamily: FONT, fontSize: 14, fontWeight: 700,
        }}>
          ⬇ Als PDF drucken / speichern
        </button>
      </div>

      {/* SEITE 1 — Deckblatt */}
      <CVPage>
        {/* Header-Kasten */}
        <div style={{
          border: `1px solid #dde3f0`, borderRadius: 8,
          padding: "40px 40px 32px", textAlign: "center", marginBottom: 32,
        }}>
          {/* Chevron oben */}
          <div style={{ fontSize: 20, color: "#ccc", marginBottom: 16 }}>∨</div>

          {/* Name */}
          <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 20, color: accentColor, fontWeight: 500, marginBottom: 2 }}>
            {profile.full_name?.split(" ")[0] || ""}
          </p>
          <h1 style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 42, fontWeight: 700, color: "#1a1a2e", marginBottom: 4, letterSpacing: "-1px" }}>
            {profile.full_name?.split(" ").slice(1).join(" ") || profile.full_name || ""}
          </h1>

          {/* Trennlinie */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", margin: "12px 0" }}>
            <div style={{ height: 1, width: 60, background: "#ccc" }} />
            <div style={{ fontSize: 16, color: "#aaa" }}>∨</div>
            <div style={{ height: 1, width: 60, background: "#ccc" }} />
          </div>

          {/* Headline */}
          {profile.headline && (
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 15, color: "#444", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 24px" }}>
              {profile.headline}
            </p>
          )}

          {/* Avatar */}
          {profile.avatar_url && (
            <div style={{ margin: "0 auto 24px", width: 180, height: 190 }}>
              <img src={profile.avatar_url} alt={profile.full_name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, textAlign: "justify", marginBottom: 24 }}>
              {profile.bio}
            </p>
          )}

          {/* Chevron unten */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", margin: "16px 0" }}>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
          </div>

          {/* Kontakt */}
          {profile.contact_info && (
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#666" }}>
              {profile.contact_info}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", margin: "16px 0" }}>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
          </div>

          <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#888" }}>
            Lebenslauf
          </p>
        </div>
      </CVPage>

      {/* SEITE 2 — Lebenslauf */}
      <CVPage>
        {/* Mini-Header */}
        <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: 8, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
            <span style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, fontWeight: 700, color: accentColor }}>
              {profile.full_name}
            </span>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
          </div>
          {profile.contact_info && (
            <p style={{ textAlign: "center", fontSize: 11, color: "#888", fontFamily: "'Schibsted Grotesk', Arial", marginTop: 4 }}>
              {profile.contact_info}
            </p>
          )}
        </div>

        <h1 style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 28, fontWeight: 400, color: "#1a1a2e", marginBottom: 8 }}>
          Lebenslauf
        </h1>

        {/* Berufserfahrung */}
        {profile.experience && (
          <>
            <SectionTitle color={accentColor}>Berufserfahrung</SectionTitle>
            <ExperienceEntry text={profile.experience} />
          </>
        )}

        {/* Bildungsweg */}
        {profile.education && (
          <>
            <SectionTitle color={accentColor}>Bildungsweg & Werdegang</SectionTitle>
            <ExperienceEntry text={profile.education} />
          </>
        )}

        {/* Stärken & Skills */}
        {(strengths.length > 0 || strengthsPro.length > 0) && (
          <>
            <SectionTitle color={accentColor}>Persönliche Fähigkeiten</SectionTitle>
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, marginTop: 8 }}>
              {[...strengths, ...strengthsPro].join(", ")}
            </p>
          </>
        )}

        {/* Skills & Tools */}
        {skills.length > 0 && (
          <>
            <SectionTitle color={accentColor}>Skills & Tools</SectionTitle>
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, marginTop: 8 }}>
              {skills.join(", ")}
            </p>
          </>
        )}

        {/* Sprachen */}
        {profile.languages && (
          <>
            <SectionTitle color={accentColor}>Sprachen</SectionTitle>
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, marginTop: 8 }}>
              {profile.languages}
            </p>
          </>
        )}

        {/* Arbeitsstil & Bedürfnisse */}
        {(workStyle.length > 0 || topNeeds.length > 0) && (
          <>
            <SectionTitle color={accentColor}>Rahmenbedingungen & Arbeitsweise</SectionTitle>
            <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 12, color: "#888", marginTop: 8, marginBottom: 6 }}>
              Diese Bedingungen helfen mir, mein Bestes zu geben:
            </p>
            {workStyle.length > 0 && (
              <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7, marginBottom: 6 }}>
                <strong>Arbeitsstil:</strong> {workStyle.join(", ")}
              </p>
            )}
            {topNeeds.length > 0 && (
              <p style={{ fontFamily: "'Schibsted Grotesk', Arial", fontSize: 13, color: "#333", lineHeight: 1.7 }}>
                <strong>Bedürfnisse:</strong> {topNeeds.join(", ")}
                {needs.length > 8 ? ` + ${needs.length - 8} weitere` : ""}
              </p>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", marginBottom: 8 }}>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
            <div style={{ fontSize: 16, color: "#aaa" }}>∨</div>
            <div style={{ height: 1, width: 40, background: "#ccc" }} />
          </div>
          <p style={{ fontSize: 11, color: "#aaa", fontFamily: "'Schibsted Grotesk', Arial" }}>
            Erstellt mit Diffusion — Different.Inclusion · diffusion-inclusion.de
          </p>
        </div>
      </CVPage>
    </div>
  );
}