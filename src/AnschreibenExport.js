import { useState } from "react";
import { FONT, COLORS } from "./constants";

const ACCENT = "#1e3a5f";
const FF = "'Schibsted Grotesk', Arial, sans-serif";

const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @media print {
    @page { margin: 20mm 22mm; size: A4; }
    .no-print { display: none !important; }
    body { background: white !important; }
    .letter-page { box-shadow: none !important; }
  }
  @media screen {
    .letter-page { box-shadow: 0 4px 32px rgba(0,0,0,0.12); max-width: 794px; margin: 0 auto 40px; }
  }
`;

function LetterPage({ children }) {
  return (
    <div className="letter-page" style={{ background: "white", padding: "48px 56px", minHeight: "270mm", fontFamily: FF, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}

function HeaderBar({ name, contact }) {
  if (!name) return null;
  const parts = contact?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [];
  return (
    <div style={{ borderBottom: `2px solid ${ACCENT}`, paddingBottom: 10, marginBottom: 36, textAlign: "center" }}>
      <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: ACCENT, letterSpacing: "0.04em" }}>
        ― {name} ―
      </p>
      {parts.length > 0 && (
        <p style={{ fontFamily: FF, fontSize: 11, color: "#555", marginTop: 4 }}>
          {parts.join(" ― ")}
        </p>
      )}
    </div>
  );
}

export default function AnschreibenExport({ profile, onClose }) {
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Stadtname aus Kontakt extrahieren (z.B. "89079 Ulm" → "Ulm")
  const cityMatch = profile?.contact_info?.match(/\d{5}\s+([A-Za-zÄÖÜäöüß\s-]+)/);
  const city = cityMatch ? cityMatch[1].trim() : "Ort";

  const allStrengths = [
    ...(profile?.strengths?.tags || []),
    ...(profile?.strengths_professional?.tags || []),
  ].slice(0, 5).join(", ");

  const allSkills = (profile?.skills?.tags || []).slice(0, 4).join(", ");

  const [form, setForm] = useState({
    firma: "",
    strasse: "",
    plzOrt: "",
    position: "",
    start: "nächstmöglichen Zeitpunkt",
    stunden: "30–40 Stunden",
    datum: today,
    ort: city,
    anrede: "Sehr geehrte Damen und Herren",
    motivation: `Meine Motivation resultiert aus dem Wunsch, ${(profile?.headline || "meine Kompetenzen einzusetzen").toLowerCase()}. Meine fachliche Basis bilden ${allStrengths || "vielfältige berufliche Erfahrungen sowie ausgeprägte Kernkompetenzen"}.`,
    erfahrung: profile?.experience
      ? profile.experience.split("\n").filter(l => l.trim() && !l.match(/^\d/) && !l.startsWith("-") && !l.startsWith("•")).slice(0, 2).join(" ").trim() || "Durch meine bisherige Erfahrung bringe ich relevante Kompetenzen mit, die ich gerne in Ihrer Organisation einbringen möchte."
      : "Durch meine bisherige Erfahrung bringe ich relevante Kompetenzen mit, die ich gerne in Ihrer Organisation einbringen möchte.",
    skills: allSkills ? `Hierfür nutze ich routiniert ${allSkills}. Ich freue mich auf ein persönliches Kennenlernen.` : "Ich freue mich auf ein persönliches Kennenlernen und eine mögliche Zusammenarbeit.",
    gruss: "Mit freundlichen Grüßen",
  });

  const f = (key) => form[key] || "";
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#0F172A", border: `1.5px solid ${COLORS.border}`,
    borderRadius: 8, color: "#F8FAFC", fontFamily: FONT, fontSize: 14,
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: COLORS.textMuted, marginBottom: 6,
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{PRINT_STYLES}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 20px", display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginRight: "auto" }}>
          ✏️ Felder ausfüllen — Vorschau aktualisiert sich automatisch
        </p>
        <button onClick={onClose} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.textSecondary, padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14 }}>
          ← Zurück
        </button>
        <button onClick={() => window.print()} style={{ background: ACCENT, border: "none", color: "white", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700 }}>
          ⬇ Als PDF speichern
        </button>
      </div>

      {/* Bearbeitungsformular */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 32px", background: COLORS.bgCard, borderRadius: 12, padding: "24px 28px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 20 }}>
          Angaben für das Anschreiben
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={labelStyle}>Firma / Unternehmen</label><input value={f("firma")} onChange={e => set("firma", e.target.value)} placeholder="z.B. Muster GmbH" style={inputStyle} /></div>
          <div><label style={labelStyle}>Straße & Nr.</label><input value={f("strasse")} onChange={e => set("strasse", e.target.value)} placeholder="z.B. Musterstraße 1" style={inputStyle} /></div>
          <div><label style={labelStyle}>PLZ + Ort</label><input value={f("plzOrt")} onChange={e => set("plzOrt", e.target.value)} placeholder="z.B. 80331 München" style={inputStyle} /></div>
          <div><label style={labelStyle}>Position / Stelle</label><input value={f("position")} onChange={e => set("position", e.target.value)} placeholder="z.B. UX-Designerin" style={inputStyle} /></div>
          <div><label style={labelStyle}>Startdatum</label><input value={f("start")} onChange={e => set("start", e.target.value)} placeholder="z.B. 01.06.2026" style={inputStyle} /></div>
          <div><label style={labelStyle}>Wochenstunden</label><input value={f("stunden")} onChange={e => set("stunden", e.target.value)} placeholder="z.B. 20–30 Stunden" style={inputStyle} /></div>
          <div><label style={labelStyle}>Ort (für Datum)</label><input value={f("ort")} onChange={e => set("ort", e.target.value)} placeholder="z.B. Ulm" style={inputStyle} /></div>
          <div><label style={labelStyle}>Datum</label><input value={f("datum")} onChange={e => set("datum", e.target.value)} style={inputStyle} /></div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Anrede</label>
          <input value={f("anrede")} onChange={e => set("anrede", e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Motivation (Absatz 2)</label>
          <textarea value={f("motivation")} onChange={e => set("motivation", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Erfahrung (Absatz 3)</label>
          <textarea value={f("erfahrung")} onChange={e => set("erfahrung", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Skills & Abschluss (Absatz 4)</label>
          <textarea value={f("skills")} onChange={e => set("skills", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
      </div>

      {/* DRUCKSEITE — Vorschau */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 12px" }}>
        <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Vorschau — wird so gedruckt:
        </p>
      </div>
      <LetterPage>
        {/* Header */}
        <HeaderBar name={profile?.full_name} contact={profile?.contact_info} />

        {/* Empfänger */}
        <div style={{ marginBottom: 32 }}>
          {f("firma") && <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 }}>{f("firma")}</p>}
          {f("strasse") && <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", marginBottom: 2 }}>{f("strasse")}</p>}
          {f("plzOrt") && <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e" }}>{f("plzOrt")}</p>}
        </div>

        {/* Datum */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", textAlign: "right", marginBottom: 28 }}>
          {f("ort")}{f("ort") && f("datum") ? ", " : ""}{f("datum")}
        </p>

        {/* Betreff */}
        {f("position") && (
          <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", fontStyle: "italic", marginBottom: 24, lineHeight: 1.5 }}>
            ―Bewerbung als {f("position")}―
          </p>
        )}

        {/* Anrede */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", marginBottom: 16 }}>
          {f("anrede")},
        </p>

        {/* Absatz 1 — Einleitung */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 14, textAlign: "justify" }}>
          hiermit bewerbe ich mich zum {f("start")} auf die Position als {f("position") || "[Position]"} bei {f("firma") || "[Unternehmen]"}. Ich stehe Ihnen mit einem Wochenumfang von {f("stunden")} zur Verfügung.
        </p>

        {/* Absatz 2 — Motivation */}
        {f("motivation") && (
          <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 14, textAlign: "justify" }}>
            {f("motivation")}
          </p>
        )}

        {/* Absatz 3 — Erfahrung */}
        {f("erfahrung") && (
          <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 14, textAlign: "justify" }}>
            {f("erfahrung")}
          </p>
        )}

        {/* Absatz 4 — Skills & Abschluss */}
        {f("skills") && (
          <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 28, textAlign: "justify" }}>
            {f("skills")}
          </p>
        )}

        {/* Grußformel */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", marginBottom: 48 }}>
          {f("gruss")}
        </p>

        {/* Unterschrift */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", fontWeight: 600 }}>
          {profile?.full_name}
        </p>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 48, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 8 }}>
            <div style={{ height: 1, flex: 1, background: "#ddd" }} />
            <span style={{ fontSize: 14, color: "#aaa" }}>∨</span>
            <div style={{ height: 1, flex: 1, background: "#ddd" }} />
          </div>
          <p style={{ fontFamily: FF, fontSize: 11, color: "#aaa" }}>
            Erstellt mit Diffusion — Different.Inclusion
          </p>
        </div>
      </LetterPage>
    </div>
  );
}
