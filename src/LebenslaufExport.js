import { useState } from "react";
import { FONT, COLORS } from "./constants";

const FF = "'Schibsted Grotesk', Arial, sans-serif";
const ACCENT = "#1e3a5f";

const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @media print {
    @page { margin: 15mm 18mm; size: A4; }
    .no-print { display: none !important; }
    body { background: white !important; }
    .cv-page { box-shadow: none !important; max-width: none !important; }
  }
  @media screen {
    body { background: #f1f5f9; padding: 40px 20px; font-family: ${FF}; }
    .cv-page { box-shadow: 0 4px 32px rgba(0,0,0,0.12); max-width: 794px; margin: 0 auto 32px; }
  }
`;

function CVPage({ children }) {
  return (
    <div className="cv-page" style={{ background: "white", padding: "44px 52px", minHeight: "270mm", fontFamily: FF }}>
      {children}
    </div>
  );
}

function HeaderBar({ name, contact }) {
  if (!name) return null;
  const parts = contact?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [];
  return (
    <div style={{ borderBottom: `2px solid ${ACCENT}`, paddingBottom: 10, marginBottom: 28, textAlign: "center" }}>
      <p style={{ fontFamily: FF, fontSize: 14, fontWeight: 700, color: ACCENT, letterSpacing: "0.04em" }}>
        ― {name} ―
      </p>
      {parts.length > 0 && (
        <p style={{ fontFamily: FF, fontSize: 11, color: "#666", marginTop: 4 }}>
          {parts.join(" ― ")}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 10px" }}>
      <div style={{ height: 1, flex: 1, background: "#ccc" }} />
      <h2 style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: ACCENT, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>
        ― {children} ―
      </h2>
      <div style={{ height: 1, flex: 1, background: "#ccc" }} />
    </div>
  );
}

function EntryRow({ date, title, subtitle, bullets }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, marginBottom: 14 }}>
      <span style={{ fontFamily: FF, fontSize: 11, color: "#888", lineHeight: 1.5, paddingTop: 1 }}>{date}</span>
      <div>
        {subtitle && <p style={{ fontFamily: FF, fontSize: 13, color: "#444", marginBottom: 2 }}>{subtitle}</p>}
        {title && <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: bullets?.length ? 4 : 0 }}>{title}</p>}
        {bullets?.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 2 }}>
            <span style={{ color: ACCENT, flexShrink: 0, fontSize: 13, lineHeight: 1.5 }}>·</span>
            <span style={{ fontFamily: FF, fontSize: 12, color: "#333", lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseEntries(text) {
  if (!text?.trim()) return [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const entries = [];
  let cur = null;
  for (const line of lines) {
    const isDate = /^\d{2}[./]\d{4}|^\d{4}/.test(line) || (line.includes("–") && /\d{4}/.test(line));
    const isBullet = /^[-•·]\s/.test(line);
    if (isDate && !isBullet) {
      if (cur) entries.push(cur);
      const tabSplit = line.split(/\s{2,}|\t/);
      cur = { date: tabSplit[0] || line, subtitle: tabSplit.slice(1).join(" ") || "", title: "", bullets: [] };
    } else if (cur && !cur.title && !cur.subtitle && !isBullet) {
      cur.subtitle = line;
    } else if (cur && cur.subtitle && !cur.title && !isBullet) {
      cur.title = line;
    } else if (cur && isBullet) {
      cur.bullets.push(line.replace(/^[-•·]\s*/, ""));
    } else if (cur) {
      if (!cur.title) cur.title = line;
      else cur.bullets.push(line);
    }
  }
  if (cur) entries.push(cur);
  return entries;
}

export default function LebenslaufExport({ profile, onClose }) {
  const [form, setForm] = useState({
    name: profile?.full_name || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
    contact: profile?.contact_info || "",
    experience: profile?.experience || "",
    education: profile?.education || "",
    languages: profile?.languages || "",
    strengths: [
      ...(profile?.strengths?.tags || []),
      ...(profile?.strengths_professional?.tags || []),
    ].join(", "),
    skills: (profile?.skills?.tags || []).join(", "),
    needs: (profile?.needs?.tags || []).slice(0, 6).join(", "),
    workStyle: (profile?.work_style?.tags || []).slice(0, 4).join(", "),
  });

  const f = k => form[k] || "";
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const expEntries = parseEntries(f("experience"));
  const eduEntries = parseEntries(f("education"));

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

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{PRINT_STYLES}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 20px", display: "flex", gap: 10, alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "#94A3B8", marginRight: "auto" }}>
          ✏️ Alle Felder direkt bearbeitbar — Vorschau aktualisiert sich sofort
        </p>
        <button onClick={onClose} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#CBD5E1", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14 }}>
          ← Zurück
        </button>
        <button onClick={() => window.print()} style={{ background: ACCENT, border: "none", color: "white", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700 }}>
          ⬇ Als PDF speichern
        </button>
      </div>

      {/* Bearbeitungsformular */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 32px", background: COLORS.bgCard, borderRadius: 12, padding: "24px 28px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginBottom: 20 }}>
          Lebenslauf bearbeiten
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={labelStyle}>Name</label><input value={f("name")} onChange={e => set("name", e.target.value)} style={{ ...inputStyle, resize: "none" }} /></div>
          <div><label style={labelStyle}>Kontakt</label><input value={f("contact")} onChange={e => set("contact", e.target.value)} placeholder="E-Mail, Tel, Ort" style={{ ...inputStyle, resize: "none" }} /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Headline / Position</label><input value={f("headline")} onChange={e => set("headline", e.target.value)} style={{ ...inputStyle, resize: "none" }} /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Kurzprofil (Deckblatt)</label><textarea value={f("bio")} onChange={e => set("bio", e.target.value)} rows={3} style={inputStyle} /></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>Berufserfahrung — "MM.JJJJ – MM.JJJJ  Firma" → neue Zeile "Position" → "- Aufgabe"</label>
          <textarea value={f("experience")} onChange={e => set("experience", e.target.value)} rows={8} style={inputStyle}
            placeholder={"09.2022 – heute  Stadt Ulm\nFallmanagement\n- Individuelle Beratung\n- Projektarbeit"} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Bildungsweg — gleicher Format</label>
          <textarea value={f("education")} onChange={e => set("education", e.target.value)} rows={5} style={inputStyle}
            placeholder={"10.2018 – 03.2022  Hochschule RheinMain\nB.A. Soziale Arbeit\n- Schwerpunkt: Sozialrecht"} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <div><label style={labelStyle}>Stärken (kommagetrennt)</label><textarea value={f("strengths")} onChange={e => set("strengths", e.target.value)} rows={2} style={inputStyle} /></div>
          <div><label style={labelStyle}>Skills & Tools</label><textarea value={f("skills")} onChange={e => set("skills", e.target.value)} rows={2} style={inputStyle} /></div>
          <div><label style={labelStyle}>Sprachen</label><input value={f("languages")} onChange={e => set("languages", e.target.value)} style={{ ...inputStyle, resize: "none" }} /></div>
          <div><label style={labelStyle}>Rahmenbedingungen / Bedürfnisse</label><input value={f("needs")} onChange={e => set("needs", e.target.value)} style={{ ...inputStyle, resize: "none" }} /></div>
        </div>
      </div>

      {/* ── DECKBLATT ── */}
      <CVPage>
        <div style={{ textAlign: "center", marginBottom: 16, color: "#ccc", fontSize: 20 }}>∨</div>

        <div style={{ border: "1px solid #d8e4f0", borderRadius: 6, padding: "36px 48px 32px", textAlign: "center" }}>
          <p style={{ fontFamily: FF, fontSize: 20, color: ACCENT, fontWeight: 500, marginBottom: 4 }}>
            {f("name").split(" ")[0]}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 8 }}>
            <div style={{ height: 1, width: 52, background: "#ccc" }} />
            <h1 style={{ fontFamily: FF, fontSize: 38, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-1px" }}>
              {f("name").split(" ").slice(1).join(" ") || f("name")}
            </h1>
            <div style={{ height: 1, width: 52, background: "#ccc" }} />
          </div>
          <div style={{ color: "#ccc", fontSize: 18, marginBottom: 16 }}>∨</div>

          {f("headline") && (
            <p style={{ fontFamily: FF, fontSize: 14, color: "#444", lineHeight: 1.55, maxWidth: 460, margin: "0 auto 20px" }}>
              {f("headline")}
            </p>
          )}

          {profile?.avatar_url && (
            <div style={{ margin: "0 auto 20px", width: 170, height: 195, overflow: "hidden", borderRadius: 3 }}>
              <img src={profile.avatar_url} alt={f("name")} draggable={false}
                style={{ width: "160%", height: "160%", objectFit: "cover", marginLeft: `${profile.avatar_x ?? -30}%`, marginTop: `${profile.avatar_y ?? -30}%` }} />
            </div>
          )}

          {f("bio") && (
            <p style={{ fontFamily: FF, fontSize: 13, color: "#333", lineHeight: 1.7, textAlign: "justify", marginBottom: 20, marginTop: profile?.avatar_url ? 0 : 16 }}>
              {f("bio")}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", margin: "14px 0 10px" }}>
            <div style={{ height: 1, width: 36, background: "#ccc" }} />
            <div style={{ height: 1, width: 36, background: "#ccc" }} />
          </div>
          {f("contact") && (
            <p style={{ fontFamily: FF, fontSize: 13, color: "#555" }}>
              {f("contact").split(/[|,]/).map(s => s.trim()).filter(Boolean).join("  |  ")}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", margin: "10px 0 8px" }}>
            <div style={{ height: 1, width: 36, background: "#ccc" }} />
            <div style={{ height: 1, width: 36, background: "#ccc" }} />
          </div>
          <p style={{ fontFamily: FF, fontSize: 12, color: "#888" }}>Anlagen: Lebenslauf</p>
        </div>
      </CVPage>

      {/* ── LEBENSLAUF-SEITE ── */}
      <CVPage>
        <HeaderBar name={f("name")} contact={f("contact")} />
        <h1 style={{ fontFamily: FF, fontSize: 26, fontWeight: 400, color: "#1a1a2e", marginBottom: 2 }}>Lebenslauf</h1>

        {expEntries.length > 0 && (
          <><SectionTitle>Berufserfahrung</SectionTitle>
            {expEntries.map((e, i) => <EntryRow key={i} {...e} />)}</>
        )}
        {f("experience") && expEntries.length === 0 && (
          <><SectionTitle>Berufserfahrung</SectionTitle>
            <p style={{ fontFamily: FF, fontSize: 13, color: "#333", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{f("experience")}</p></>
        )}

        {eduEntries.length > 0 && (
          <><SectionTitle>Bildungsweg</SectionTitle>
            {eduEntries.map((e, i) => <EntryRow key={i} {...e} />)}</>
        )}

        {f("strengths") && (
          <><SectionTitle>Persönliche Fähigkeiten</SectionTitle>
            <p style={{ fontFamily: FF, fontSize: 13, color: "#1a1a2e", fontWeight: 600, lineHeight: 1.7 }}>{f("strengths")}</p></>
        )}

        {f("skills") && (
          <><SectionTitle>Skills & Tools</SectionTitle>
            <p style={{ fontFamily: FF, fontSize: 13, color: "#333", lineHeight: 1.7 }}>{f("skills")}</p></>
        )}

        {f("languages") && (
          <><SectionTitle>Sprachen</SectionTitle>
            <p style={{ fontFamily: FF, fontSize: 13, color: "#333", lineHeight: 1.7 }}>{f("languages")}</p></>
        )}

        {f("needs") && (
          <><SectionTitle>Rahmenbedingungen & Arbeitsweise</SectionTitle>
            <p style={{ fontFamily: FF, fontSize: 12, color: "#888", marginBottom: 4 }}>Diese Bedingungen helfen mir, mein Bestes zu geben:</p>
            <p style={{ fontFamily: FF, fontSize: 13, color: "#333", lineHeight: 1.7 }}>
              {f("needs")}{f("workStyle") ? ` · Arbeitsstil: ${f("workStyle")}` : ""}
            </p></>
        )}

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 6 }}>
            <div style={{ height: 1, flex: 1, background: "#e0e0e0" }} />
            <span style={{ fontSize: 14, color: "#bbb" }}>∨</span>
            <div style={{ height: 1, flex: 1, background: "#e0e0e0" }} />
          </div>
          <p style={{ fontFamily: FF, fontSize: 10, color: "#bbb" }}>Lebenslauf · Erstellt mit Diffusion — Different.Inclusion</p>
        </div>
      </CVPage>
    </div>
  );
}
