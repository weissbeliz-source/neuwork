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
    <div className="letter-page" style={{
      background: "white", padding: "48px 56px",
      minHeight: "270mm", fontFamily: FF, display: "flex", flexDirection: "column"
    }}>
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

// KI-Prompt aus Profil-Daten aufbauen
function buildPrompt(profile, form) {
  const strengths = [...(profile?.strengths?.tags || []), ...(profile?.strengths_professional?.tags || [])].slice(0, 6).join(", ");
  const skills = (profile?.skills?.tags || []).slice(0, 5).join(", ");
  const needs = (profile?.needs?.tags || []).slice(0, 4).join(", ");
  const workStyle = (profile?.work_style?.tags || []).slice(0, 3).join(", ");
  const experience = profile?.experience?.split("\n").slice(0, 4).join(" ").replace(/[-•]/g, "").trim();
  const education = profile?.education?.split("\n").slice(0, 2).join(" ").trim();

  return `Du bist ein professioneller Bewerbungsberater. Schreibe ein überzeugendes, authentisches Anschreiben auf Deutsch.

PROFIL DER BEWERBENDEN PERSON:
- Name: ${profile?.full_name || ""}
- Headline: ${profile?.headline || ""}
- Über mich: ${profile?.bio || ""}
- Stärken: ${strengths}
- Skills & Tools: ${skills}
- Berufserfahrung: ${experience || "Keine Angabe"}
- Bildungsweg: ${education || "Keine Angabe"}
- Arbeitsstil: ${workStyle}
- Rahmenbedingungen/Bedürfnisse: ${needs}

STELLE:
- Firma: ${form.firma}
- Position: ${form.position}
- Zusatzinfo zur Stelle: ${form.stelleninfo || "Keine"}

ANWEISUNGEN:
- Schreibe NUR den Fließtext des Anschreibens (ohne Anrede, ohne Grußformel, ohne Betreff)
- 3-4 Absätze, je 3-5 Sätze
- Absatz 1: Motivation und Bezug zur Stelle
- Absatz 2: Relevante Erfahrungen und Stärken
- Absatz 3: Konkreter Mehrwert für das Unternehmen
- Absatz 4 (optional): Kurz zu Rahmenbedingungen wenn relevant, sonst Abschlusssatz
- Stärkenorientiert, keine Defizit-Sprache
- Professionell aber menschlich
- Kein "Hiermit bewerbe ich mich" am Anfang
- Trenne Absätze mit einer Leerzeile
- Gib NUR den reinen Text zurück, keine Kommentare, keine Markdown-Formatierung`;
}

export default function AnschreibenExport({ profile, onClose }) {
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const cityMatch = profile?.contact_info?.match(/\d{5}\s+([A-Za-zÄÖÜäöüß\s-]+)/);
  const city = cityMatch ? cityMatch[1].trim() : "Ort";

  const [form, setForm] = useState({
    firma: "",
    strasse: "",
    plzOrt: "",
    position: "",
    stelleninfo: "",
    start: "nächstmöglichen Zeitpunkt",
    stunden: "30–40 Stunden",
    datum: today,
    ort: city,
    anrede: "Sehr geehrte Damen und Herren",
    gruss: "Mit freundlichen Grüßen",
  });

  const [aiText, setAiText] = useState("");
  const [absatz1, setAbsatz1] = useState("");
  const [absatz2, setAbsatz2] = useState("");
  const [absatz3, setAbsatz3] = useState("");
  const [absatz4, setAbsatz4] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);

  const f = k => form[k] || "";
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Absätze aus KI-Text parsen
  const parseAbsaetze = (text) => {
    const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    setAbsatz1(paras[0] || "");
    setAbsatz2(paras[1] || "");
    setAbsatz3(paras[2] || "");
    setAbsatz4(paras[3] || "");
  };

  // Claude API aufrufen
  const generiereAnschreiben = async () => {
    if (!form.firma || !form.position) {
      setAiError("Bitte Firma und Position ausfüllen.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(profile, form) }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";

      if (!text) {
        setAiError("Keine Antwort erhalten. Bitte nochmal versuchen.");
        setAiLoading(false);
        return;
      }

      setAiText(text);
      parseAbsaetze(text);
      setAiGenerated(true);
    } catch (err) {
      setAiError("Fehler beim Generieren: " + err.message);
    }
    setAiLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#0F172A", border: `1.5px solid ${COLORS.border}`,
    borderRadius: 8, color: "#F8FAFC", fontFamily: FONT, fontSize: 14,
    resize: "vertical",
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.07em",
    color: "#94A3B8", marginBottom: 6,
  };

  // Alle Absätze zusammen für Druckvorschau
  const alleAbsaetze = [absatz1, absatz2, absatz3, absatz4].filter(Boolean);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{PRINT_STYLES}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 20px", display: "flex", gap: 10, alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "#94A3B8", marginRight: "auto" }}>
          ✉️ KI-gestütztes Anschreiben — automatisch aus deinem Profil generiert
        </p>
        <button onClick={onClose} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#CBD5E1", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14 }}>
          ← Zurück
        </button>
        <button onClick={() => window.print()} style={{ background: ACCENT, border: "none", color: "white", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700 }}>
          ⬇ Als PDF speichern
        </button>
      </div>

      {/* SCHRITT 1 — Stelle eingeben */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 20px", background: COLORS.bgCard, borderRadius: 12, padding: "24px 28px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>
          Schritt 1 — Stelle angeben
        </p>
        <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
          Füll die wichtigsten Felder aus — dann generiert Claude ein passendes Anschreiben für dich.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Firma / Unternehmen *</label>
            <input value={f("firma")} onChange={e => set("firma", e.target.value)} placeholder="z.B. Muster GmbH" style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Position / Stelle *</label>
            <input value={f("position")} onChange={e => set("position", e.target.value)} placeholder="z.B. UX-Designerin" style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Straße & Nr.</label>
            <input value={f("strasse")} onChange={e => set("strasse", e.target.value)} placeholder="z.B. Musterstraße 1" style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>PLZ + Ort</label>
            <input value={f("plzOrt")} onChange={e => set("plzOrt", e.target.value)} placeholder="z.B. 80331 München" style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Startdatum</label>
            <input value={f("start")} onChange={e => set("start", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Wochenstunden</label>
            <input value={f("stunden")} onChange={e => set("stunden", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Ort (für Datum)</label>
            <input value={f("ort")} onChange={e => set("ort", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Datum</label>
            <input value={f("datum")} onChange={e => set("datum", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Infos zur Stelle (optional — Stellenanzeige einkopieren)</label>
          <textarea value={f("stelleninfo")} onChange={e => set("stelleninfo", e.target.value)} rows={3}
            placeholder="z.B. Aus der Stellenanzeige: 'Wir suchen...' — je mehr Kontext, desto besser das Ergebnis."
            style={inputStyle} />
        </div>

        {/* KI-Button */}
        <div style={{ marginTop: 20 }}>
          <button onClick={generiereAnschreiben} disabled={aiLoading || !form.firma || !form.position}
            style={{
              background: aiLoading ? COLORS.border : COLORS.purple,
              border: "none", color: aiLoading ? "#64748B" : "white",
              padding: "14px 28px", borderRadius: 10, cursor: aiLoading ? "default" : "pointer",
              fontFamily: FONT, fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 10,
              opacity: (!form.firma || !form.position) ? 0.5 : 1,
            }}>
            {aiLoading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Claude schreibt gerade…
              </>
            ) : (
              <>✨ {aiGenerated ? "Neu generieren" : "Anschreiben generieren"}</>
            )}
          </button>
          {aiError && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: COLORS.red, marginTop: 10 }}>{aiError}</p>
          )}
        </div>
      </div>

      {/* SCHRITT 2 — Text bearbeiten (nur nach KI-Generierung) */}
      {aiGenerated && (
        <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 20px", background: COLORS.bgCard, borderRadius: 12, padding: "24px 28px", border: `1px solid ${COLORS.greenBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: COLORS.green }}>
                Anschreiben generiert!
              </p>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8" }}>
                Lies den Text durch und passe ihn bei Bedarf an.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {[
              { label: "Absatz 1 — Motivation", val: absatz1, set: setAbsatz1 },
              { label: "Absatz 2 — Erfahrung & Stärken", val: absatz2, set: setAbsatz2 },
              { label: "Absatz 3 — Mehrwert", val: absatz3, set: setAbsatz3 },
              { label: "Absatz 4 — Abschluss (optional)", val: absatz4, set: setAbsatz4 },
            ].map(({ label, val, set: setter }) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <textarea value={val} onChange={e => setter(e.target.value)} rows={4} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>Anrede</label>
            <input value={f("anrede")} onChange={e => set("anrede", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>
      )}

      {/* DRUCKSEITE */}
      <LetterPage>
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

        {/* Absatz 1 — Einleitungssatz */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 14, textAlign: "justify" }}>
          hiermit bewerbe ich mich zum {f("start")} auf die Position als {f("position") || "[Position]"} bei {f("firma") || "[Unternehmen]"}.
          {f("stunden") !== "30–40 Stunden" ? ` Ich stehe Ihnen mit einem Wochenumfang von ${f("stunden")} zur Verfügung.` : ""}
        </p>

        {/* KI-generierte Absätze */}
        {alleAbsaetze.length > 0 ? (
          alleAbsaetze.map((abs, i) => (
            <p key={i} style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", lineHeight: 1.7, marginBottom: 14, textAlign: "justify" }}>
              {abs}
            </p>
          ))
        ) : (
          <p style={{ fontFamily: FF, fontSize: 13, color: "#aaa", fontStyle: "italic", lineHeight: 1.7, marginBottom: 28 }}>
            [Hier erscheint dein generiertes Anschreiben — klicke oben auf "✨ Anschreiben generieren"]
          </p>
        )}

        {/* Grußformel */}
        <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", marginBottom: 48, marginTop: 14 }}>
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
