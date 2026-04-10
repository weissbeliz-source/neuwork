import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import AuthScreen from "./AuthScreen";
import FoerderInfo from "./FoerderInfo";
import PublicProfile from "./PublicProfile";
import LebenslaufExport from "./LebenslaufExport";
import AnschreibenExport from "./AnschreibenExport";
import { EMPTY_PROFILE, TAG_OPTIONS, NEED_CATEGORIES, COLORS, FONT, NAV_ITEMS, ROLEMODEL_TAGS } from "./constants";
import { parseStoredField, serializeField } from "./profileUtils";

// ─── KI Stärken-Generator ────────────────────────────────────────────────────
function StaerkenGenerator({ onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const generiere = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        "https://zyeixswgxrwybolobnzn.supabase.co/functions/v1/generate-staerken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ erfahrungen: text }),
        }
      );
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setResult(data);
    } catch (e) {
      setError("Verbindungsfehler: " + e.message);
    }
    setLoading(false);
  };

  const inp = { width: "100%", padding: "10px 14px", background: "#0F172A", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, color: "#F8FAFC", fontFamily: FONT, fontSize: 14, resize: "vertical" };

  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.purpleBg, border: `1.5px solid ${COLORS.purple}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: COLORS.purple }}>
        ✨ Stärken mit KI aus Erfahrungen entdecken {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ background: "#0B1120", border: `1.5px solid ${COLORS.purple}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 18px" }}>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginBottom: 10, lineHeight: 1.6 }}>
            Beschreibe was du bisher gemacht hast — auch Ehrenamt, Pflege, Hobbys, Schule. Claude findet deine Stärken.
          </p>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4} style={inp}
            placeholder={"z.B. Ich habe 3 Jahre meine Oma gepflegt. Davor war ich in der Schülervertretung und habe Events organisiert. Ich liebe es Dinge zu reparieren und programmiere manchmal kleine Tools..."} />
          <button type="button" onClick={generiere} disabled={loading || !text.trim()}
            style={{ marginTop: 10, background: loading ? COLORS.border : COLORS.purple, border: "none", color: loading ? "#64748B" : "white", padding: "10px 22px", borderRadius: 8, cursor: loading ? "default" : "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, opacity: !text.trim() ? 0.5 : 1 }}>
            {loading ? "✨ Claude analysiert..." : "✨ Stärken entdecken"}
          </button>
          {error && <p style={{ color: COLORS.red, fontFamily: FONT, fontSize: 13, marginTop: 8 }}>{error}</p>}

          {result && (
            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              {result.kurzprofil && (
                <div style={{ background: COLORS.purpleBg, border: `1px solid ${COLORS.purpleBorder}`, borderRadius: 8, padding: "10px 14px" }}>
                  <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: COLORS.purple, marginBottom: 4 }}>Kurzprofil-Vorschlag</p>
                  <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1" }}>{result.kurzprofil}</p>
                  <button type="button" onClick={() => onAdd("bio", result.kurzprofil)} style={{ marginTop: 6, background: COLORS.purple, border: "none", color: "white", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>
                    + Zum Profil hinzufügen
                  </button>
                </div>
              )}
              {[
                { key: "staerken_persoenlich", label: "Persönliche Stärken", field: "strengths" },
                { key: "staerken_fachlich", label: "Fachliche Stärken", field: "strengths_professional" },
                { key: "skills", label: "Skills", field: "skills" },
              ].map(({ key, label, field }) => result[key]?.length > 0 && (
                <div key={key} style={{ background: "#0F172A", borderRadius: 8, padding: "10px 14px" }}>
                  <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B", marginBottom: 8 }}>{label}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {result[key].map(s => (
                      <span key={s} style={{ padding: "4px 12px", borderRadius: 6, background: COLORS.purpleBg, color: COLORS.purple, border: `1px solid ${COLORS.purpleBorder}`, fontSize: 13, fontFamily: FONT }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <button type="button" onClick={() => onAdd(field, result[key])}
                    style={{ background: COLORS.purple, border: "none", color: "white", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>
                    + Alle zu "{label}" hinzufügen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tag-Auswahl-Komponente ──────────────────────────────────────────────────
function TagField({ label, options, value, onChange, placeholder, categories }) {
  const [open, setOpen] = useState(false);
  const selectedTags = value?.tags || [];
  const customText = value?.custom || "";
  const count = selectedTags.length + (customText.trim() ? 1 : 0);

  const toggle = (tag) => {
    const next = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
    onChange({ tags: next, custom: customText });
  };

  const tagBtn = (tag) => {
    const sel = selectedTags.includes(tag);
    return (
      <button key={tag} type="button" onClick={() => toggle(tag)} style={{
        padding: "6px 14px", borderRadius: 8, cursor: "pointer",
        border: `1.5px solid ${sel ? COLORS.purple : COLORS.border}`,
        background: sel ? COLORS.purpleBg : "transparent",
        color: sel ? COLORS.purple : COLORS.textMuted,
        fontFamily: FONT, fontSize: 13, transition: "all 0.1s",
      }}>{tag}</button>
    );
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 18px", background: COLORS.bgCard, border: `1.5px solid ${open ? COLORS.purple : COLORS.border}`,
        borderRadius: open ? "10px 10px 0 0" : 10, cursor: "pointer", fontFamily: FONT,
      }}>
        <span style={{ fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8" }}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {count > 0 && <span style={{ background: COLORS.purple, color: "white", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{count}</span>}
          <span style={{ color: COLORS.purple, fontSize: 20, fontWeight: 300 }}>{open ? "−" : "+"}</span>
        </span>
      </button>
      {open && (
        <div style={{ background: "#0B1120", border: `1.5px solid ${COLORS.purple}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 18px" }}>
          {categories ? (
            <div style={{ display: "grid", gap: 16 }}>
              {categories.map(cat => (
                <div key={cat.title}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 8 }}>{cat.title}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{cat.tags.map(tagBtn)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {options.map(tagBtn)}
            </div>
          )}
          <textarea
            value={customText}
            onChange={e => onChange({ tags: selectedTags, custom: e.target.value })}
            placeholder={placeholder}
            rows={2}
            style={{ width: "100%", padding: "10px 14px", background: COLORS.bgInput, border: `1.5px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontFamily: FONT, fontSize: 14, resize: "vertical", marginTop: 12 }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Aufklappbare Edit-Sektion ────────────────────────────────────────────────
// ─── KI Pitch-Generator ──────────────────────────────────────────────────────
function PitchGenerator({ profile, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const generiere = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        "https://zyeixswgxrwybolobnzn.supabase.co/functions/v1/generate-pitch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profil: {
              name: profile.full_name || "",
              headline: profile.headline || "",
              staerken: (profile.strengths?.tags || []).join(", "),
              staerken_fachlich: (profile.strengths_professional?.tags || []).join(", "),
              skills: (profile.skills?.tags || []).join(", "),
              erfahrung: profile.experience || "",
              beduerfnisse: (profile.needs?.tags || []).slice(0, 5).join(", "),
              arbeitsstil: (profile.work_style?.tags || []).join(", "),
            }
          }),
        }
      );
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setResult(data);
    } catch (e) {
      setError("Verbindungsfehler: " + e.message);
    }
    setLoading(false);
  };

  const versions = result ? [
    { key: "kurz", label: "Kurz (1 Satz)", desc: "Knackiger Pitch" },
    { key: "mittel", label: "Mittel (2–3 Sätze)", desc: "Für Bio / Profil" },
    { key: "lang", label: "Lang (4–5 Sätze)", desc: "Vollständige Vorstellung" },
  ] : [];

  return (
    <div style={{ marginBottom: 4 }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#0F172A", border: `1.5px solid ${COLORS.green}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: COLORS.green, width: "100%" }}>
        <span>🎤 Vorstellungstext mit KI schreiben lassen</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ background: "#0B1120", border: `1.5px solid ${COLORS.green}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 18px" }}>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginBottom: 12, lineHeight: 1.6 }}>
            Claude schreibt drei Versionen — kurz, mittel und lang. Basierend auf deinen Stärken, Skills und Arbeitsweise. Bedürfnisse werden positiv formuliert.
          </p>

          <button type="button" onClick={generiere} disabled={loading} style={{ background: loading ? COLORS.border : COLORS.green, border: "none", color: loading ? "#64748B" : "#0A0A0A", padding: "10px 22px", borderRadius: 8, cursor: loading ? "default" : "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700 }}>
            {loading ? "🎤 Claude schreibt..." : result ? "↻ Neu generieren" : "🎤 Text generieren"}
          </button>
          {error && <p style={{ color: "#F87171", fontFamily: FONT, fontSize: 13, marginTop: 8 }}>{error}</p>}

          {result && (
            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <div style={{ background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}`, borderRadius: 8, padding: "8px 14px", marginBottom: 4 }}>
                <p style={{ fontFamily: FONT, fontSize: 13, color: COLORS.green, fontWeight: 600 }}>
                  ✅ Drei Versionen generiert — wähle eine aus:
                </p>
              </div>
              {versions.map(({ key, label, desc }) => result[key] && (
                <div key={key} style={{ background: "#0F172A", borderRadius: 8, padding: "12px 14px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748B" }}>{label}</span>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: "#475569", marginLeft: 8 }}>— {desc}</span>
                    </div>
                    <button type="button" onClick={() => onAdd(result[key])} style={{ background: COLORS.green, border: "none", color: "#0A0A0A", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      + Übernehmen
                    </button>
                  </div>
                  <p style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1", lineHeight: 1.65 }}>{result[key]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditSektion({ label, icon, filled, tip, children }) {
  const [open, setOpen] = useState(false);
  const hasFilled = filled > 0;
  return (
    <div style={{ border: `1.5px solid ${open ? COLORS.purple : hasFilled ? COLORS.border : COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: open ? COLORS.purpleBg : hasFilled ? "#1a2235" : COLORS.bgCard, border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#F8FAFC", flex: 1 }}>{label}</span>
        {hasFilled > 0 && !open && (
          <span style={{ background: COLORS.green + "33", color: COLORS.green, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, border: `1px solid ${COLORS.greenBorder}` }}>
            ✓ {typeof hasFilled === "number" && hasFilled > 1 ? `${hasFilled} Einträge` : "ausgefüllt"}
          </span>
        )}
        <span style={{ color: open ? COLORS.purple : "#64748B", fontSize: 18, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "4px 18px 18px", background: "#0B1120", borderTop: `1px solid ${COLORS.border}` }}>
          {tip && (
            <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748B", marginBottom: 12, marginTop: 12, lineHeight: 1.5 }}>
              💡 {tip}
            </p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Haupt-App ───────────────────────────────────────────────────────────────
export default function MainApp() {
  const [activeNav, setActiveNav] = useState("profil");
  const [profileMode, setProfileMode] = useState("view"); // "view" | "edit" | "lebenslauf"
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const fileInputRef = useRef(null);

  // Pinnwand
  const [pinnwandBeitraege, setPinnwandBeitraege] = useState([]);
  const [neuerBeitrag, setNeuerBeitrag] = useState("");
  const [beitragKategorie, setBeitragKategorie] = useState("Erfahrung");
  const [anonym, setAnonym] = useState(false);
  const [pinnwandLoading, setPinnwandLoading] = useState(false);

  // Vorbilder
  const [vorbilder, setVorbilder] = useState([]);
  const [vorbildFilter, setVorbildFilter] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadProfile(); else setProfile(EMPTY_PROFILE); }, [user]); // eslint-disable-line
  useEffect(() => { if (activeNav === "pinnwand") loadPinnwand(); if (activeNav === "vorbilder") loadVorbilder(); }, [activeNav]); // eslint-disable-line

  async function loadProfile() {
    setProfileLoading(true);
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setProfileLoading(false); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", cu.id).maybeSingle();
    if (data) {
      setProfile({
        full_name: data.full_name || "", headline: data.headline || "", bio: data.bio || "",
        strengths: parseStoredField(data.strengths),
        strengths_professional: parseStoredField(data.strengths_professional),
        strengths_others: parseStoredField(data.strengths_others),
        strengths_special: parseStoredField(data.strengths_special),
        special_interests: data.special_interests || "",
        work_style: parseStoredField(data.work_style),
        communication_prefs: parseStoredField(data.communication_prefs),
        assistive_tech: parseStoredField(data.assistive_tech),
        needs: parseStoredField(data.needs),
        skills: parseStoredField(data.skills),
        experience: data.experience || "", education: data.education || "",
        languages: data.languages || "", availability: data.availability || "",
        contact_info: data.contact_info || "", work_model: data.work_model || "",
        looking_for_work: !!data.looking_for_work, avatar_url: data.avatar_url || "",
        has_disability_id: !!data.has_disability_id,
        disability_degree: data.disability_degree || "", support_needs: data.support_needs || "",
        is_rolemodel: !!data.is_rolemodel, rolemodel_tags: data.rolemodel_tags || "",
        avatar_x: data.avatar_x ?? -30, avatar_y: data.avatar_y ?? -30,
      });
    }
    setProfileLoading(false);
  }

  async function loadPinnwand() {
    setPinnwandLoading(true);
    const { data } = await supabase.from("pinnwand").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) setPinnwandBeitraege(data);
    setPinnwandLoading(false);
  }

  async function loadVorbilder() {
    const { data } = await supabase.from("profiles").select("id,full_name,headline,avatar_url,rolemodel_tags,work_model,looking_for_work").eq("is_rolemodel", true).limit(50);
    if (data) setVorbilder(data);
  }

  async function uploadAvatar(file) {
    setAvatarUploading(true);
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setAvatarUploading(false); return; }
    const ext = file.name.split(".").pop();
    const path = `${cu.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setSaveMessage("Bild-Upload fehlgeschlagen."); setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile(p => ({ ...p, avatar_url: data.publicUrl + "?t=" + Date.now() }));
    setAvatarUploading(false);
    setSaveMessage("✓ Bild hochgeladen! Speichern nicht vergessen.");
  }

  async function saveProfile() {
    setSaveMessage("");
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setSaveMessage("Bitte einloggen."); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: cu.id,
      full_name: profile.full_name, headline: profile.headline, bio: profile.bio,
      strengths: serializeField(profile.strengths),
      strengths_professional: serializeField(profile.strengths_professional),
      strengths_others: serializeField(profile.strengths_others),
      strengths_special: serializeField(profile.strengths_special),
      special_interests: profile.special_interests,
      work_style: serializeField(profile.work_style),
      communication_prefs: serializeField(profile.communication_prefs),
      assistive_tech: serializeField(profile.assistive_tech),
      needs: serializeField(profile.needs), skills: serializeField(profile.skills),
      experience: profile.experience, education: profile.education,
      languages: profile.languages, availability: profile.availability,
      contact_info: profile.contact_info, work_model: profile.work_model,
      looking_for_work: profile.looking_for_work, avatar_url: profile.avatar_url,
      has_disability_id: profile.has_disability_id,
      disability_degree: profile.disability_degree, support_needs: profile.support_needs,
      is_rolemodel: profile.is_rolemodel, rolemodel_tags: profile.rolemodel_tags,
      avatar_x: profile.avatar_x ?? -30, avatar_y: profile.avatar_y ?? -30,
    }, { onConflict: "id" });
    if (error) setSaveMessage("Fehler: " + error.message);
    else { setSaveMessage("✓ Gespeichert!"); setProfileMode("view"); }
  }

  async function copyProfileLink() {
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) return;
    await navigator.clipboard.writeText(`${window.location.origin}/profil/${cu.id}`);
    setCopyMessage("✓ Link kopiert!");
    setTimeout(() => setCopyMessage(""), 3000);
  }

  function handleAddStaerken(field, values) {
    if (field === "bio") {
      setProfile(p => ({ ...p, bio: values }));
      return;
    }
    setProfile(p => {
      const existing = p[field]?.tags || [];
      const newTags = Array.isArray(values) ? values : [values];
      const merged = [...new Set([...existing, ...newTags])];
      return { ...p, [field]: { ...p[field], tags: merged } };
    });
  }

  async function postBeitrag() {
    if (!neuerBeitrag.trim()) return;
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) return;
    await supabase.from("pinnwand").insert({
      user_id: cu.id, inhalt: neuerBeitrag.trim(),
      kategorie: beitragKategorie, anonym,
      anzeigename: anonym ? null : (profile.full_name || cu.email),
    });
    setNeuerBeitrag("");
    loadPinnwand();
  }

  async function deleteBeitrag(id) {
    await supabase.from("pinnwand").delete().eq("id", id);
    loadPinnwand();
  }

  const handleLogout = () => supabase.auth.signOut();
  const avatarInitial = (profile.full_name?.[0] || user?.email?.[0] || "D").toUpperCase();

  // Styles — WCAG AA konform
  const inp = (extra = {}) => ({ width: "100%", padding: "13px 16px", background: COLORS.bgInput, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, color: "#F8FAFC", fontFamily: FONT, fontSize: 16, ...extra });
  const lbl = { display: "block", fontSize: 14, fontWeight: 600, color: "#CBD5E1", marginBottom: 8 };
  const sectionHead = (color = COLORS.purple) => ({ fontSize: 17, fontWeight: 700, color, marginBottom: 18, marginTop: 4, paddingBottom: 10, borderBottom: `1px solid ${COLORS.border}` });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94A3B8", fontFamily: FONT, fontSize: 18 }}>Lädt…</p>
    </div>
  );

  if (!user) return <AuthScreen />;

  // Lebenslauf-Ansicht
  if (profileMode === "lebenslauf") {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <LebenslaufExport profile={profile} onClose={() => setProfileMode("view")} />
      </div>
    );
  }

  // Anschreiben-Ansicht
  if (profileMode === "anschreiben") {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT, padding: "32px 24px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <AnschreibenExport profile={profile} onClose={() => setProfileMode("view")} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :focus-visible { outline: 3px solid ${COLORS.purple}; outline-offset: 2px; border-radius: 4px; }
        button, input, textarea, select { font-family: ${FONT}; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${COLORS.purple} !important; }
        .nav-btn:hover { background: ${COLORS.bgCard} !important; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.75 } }
        @media (max-width:640px) { .two-col { grid-template-columns: 1fr !important; } .nav-label { display: none; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 26, height: 26, borderRadius: "50%", background: COLORS.purple }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: COLORS.green, opacity: 0.85 }} />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1 }}>Diffusion</p>
              <p style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.04em" }}>Different.Inclusion</p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} className="nav-btn" onClick={() => { setActiveNav(item.id); if (item.id === "profil") setProfileMode("view"); }}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, background: activeNav === item.id ? COLORS.purpleBg : "transparent", color: activeNav === item.id ? COLORS.purple : "#CBD5E1", borderBottom: `2px solid ${activeNav === item.id ? COLORS.purple : "transparent"}`, transition: "all 0.15s" }}>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Avatar + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setActiveNav("profil")} style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", cursor: "pointer", border: `2px solid ${COLORS.purple}`, flexShrink: 0 }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>{avatarInitial}</div>
              )}
            </div>
            <button onClick={handleLogout} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "#94A3B8" }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: activeNav === "profil" ? 860 : 1100, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ══════════ PROFIL ══════════ */}
        {activeNav === "profil" && (
          <div>
            {/* Profil-Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6, color: "#F8FAFC" }}>Mein Profil</h1>
                <p style={{ fontSize: 15, color: "#94A3B8" }}>
                  {profileMode === "edit" ? "✏️ Bearbeitungsmodus aktiv" : profileMode === "view" ? "Profilansicht" : "Lebenslauf-Vorschau"}
                </p>
              </div>

              {/* Aktions-Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {profileMode === "view" && (
                  <>
                    {/* Link teilen */}
                    <button onClick={copyProfileLink} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#CBD5E1", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                      {copyMessage || "🔗 Link teilen"}
                    </button>
                    {/* Lebenslauf */}
                    <button onClick={() => setProfileMode("lebenslauf")} style={{ background: COLORS.yellowBg, border: `1.5px solid ${COLORS.yellow}`, color: COLORS.yellow, padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                      📄 Lebenslauf
                    </button>
                    {/* Anschreiben */}
                    <button onClick={() => setProfileMode("anschreiben")} style={{ background: COLORS.greenBg, border: `1.5px solid ${COLORS.green}`, color: COLORS.green, padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                      ✉️ Anschreiben
                    </button>
                    {/* Bearbeiten */}
                    <button onClick={() => setProfileMode("edit")} style={{ background: COLORS.purple, border: "none", color: "white", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                      ✏️ Bearbeiten
                    </button>
                  </>
                )}
                {profileMode === "edit" && (
                  <>
                    <button onClick={() => { setProfileMode("view"); setSaveMessage(""); }} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#94A3B8", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>
                      Abbrechen
                    </button>
                    <button onClick={saveProfile} style={{ background: COLORS.green, border: "none", color: "#0A0A0A", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                      ✓ Speichern
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bearbeitungs-Banner */}
            {profileMode === "edit" && (
              <div style={{ background: COLORS.purpleBg, border: `2px solid ${COLORS.purple}`, borderRadius: 12, padding: "12px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, animation: "pulse 3s infinite" }}>
                <span style={{ fontSize: 20 }}>✏️</span>
                <p style={{ fontSize: 15, color: COLORS.purple, fontWeight: 600 }}>
                  Du bist im Bearbeitungsmodus — klick "Speichern" um Änderungen zu übernehmen.
                </p>
              </div>
            )}

            {/* PROFILANSICHT */}
            {profileMode === "view" && (
              <PublicProfile userId={user?.id} isPublic={false} />
            )}

            {/* BEARBEITUNGSMODUS */}
            {profileMode === "edit" && (
              <div style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.purple}`, borderRadius: 16, padding: "28px 32px" }}>
                {profileLoading && <p style={{ color: "#94A3B8", marginBottom: 16, fontSize: 14 }}>Profil wird geladen…</p>}

                <div style={{ display: "grid", gap: 16 }}>

                  {/* ── PFLICHTFELDER (immer sichtbar) ── */}
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                    {/* Avatar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                      <div onClick={() => !profile.avatar_url && fileInputRef.current?.click()}
                        style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: `3px solid ${COLORS.purple}`, flexShrink: 0, position: "relative", cursor: profile.avatar_url ? "default" : "pointer", background: COLORS.bgInput }}>
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="avatar" draggable={false} style={{ width: "160%", height: "160%", objectFit: "cover", position: "absolute", left: `${profile.avatar_x ?? -30}%`, top: `${profile.avatar_y ?? -30}%`, cursor: "grab", userSelect: "none" }}
                            onMouseDown={e => {
                              e.preventDefault();
                              const startX = e.clientX, startY = e.clientY;
                              const startObjX = profile.avatar_x ?? -30, startObjY = profile.avatar_y ?? -30;
                              const onMove = mv => {
                                const newX = Math.min(0, Math.max(-60, startObjX + ((mv.clientX - startX) / 100) * 100));
                                const newY = Math.min(0, Math.max(-60, startObjY + ((mv.clientY - startY) / 100) * 100));
                                setProfile(p => ({ ...p, avatar_x: newX, avatar_y: newY }));
                              };
                              const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
                              window.addEventListener("mousemove", onMove);
                              window.addEventListener("mouseup", onUp);
                            }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white", background: COLORS.purple }}>{avatarInitial}</div>
                        )}
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: "#94A3B8", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 11 }}>
                        {avatarUploading ? "Lädt..." : "Foto"}
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0]); }} />
                    </div>

                    {/* Name + Headline + Kontakt */}
                    <div style={{ flex: 1, display: "grid", gap: 12, minWidth: 200 }}>
                      <div><label style={lbl}>Name</label><input type="text" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Dein Name" style={inp()} /></div>
                      <div><label style={lbl}>Headline</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} placeholder="z.B. Systemsprengerin mit Herz für Inklusion" style={inp()} /></div>
                      <div><label style={lbl}>Kontakt (E-Mail, Tel, Ort)</label><input type="text" value={profile.contact_info} onChange={e => setProfile({ ...profile, contact_info: e.target.value })} placeholder="name@email.de | 0178 ... | Ulm" style={inp()} /></div>
                    </div>
                  </div>

                  {/* Offen für Stellen */}
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#CBD5E1", cursor: "pointer" }}>
                      <input type="checkbox" checked={profile.looking_for_work} onChange={e => setProfile({ ...profile, looking_for_work: e.target.checked })} style={{ width: 18, height: 18 }} />
                      Ich suche aktiv eine Stelle
                    </label>
                    <input type="text" value={profile.availability} onChange={e => setProfile({ ...profile, availability: e.target.value })} placeholder="Verfügbar ab z.B. sofort" style={inp({ width: "auto", flex: 1, minWidth: 150 })} />
                    <input type="text" value={profile.work_model} onChange={e => setProfile({ ...profile, work_model: e.target.value })} placeholder="Remote / Hybrid / Vor Ort" style={inp({ width: "auto", flex: 1, minWidth: 150 })} />
                  </div>

                  {/* ── OPTIONALE SEKTIONEN (aufklappbar) ── */}
                  {[
                    {
                      id: "bio", label: "Über mich", icon: "💬",
                      filled: !!profile.bio,
                      tip: "2–3 Sätze reichen völlig — oder lass Claude einen Pitch-Text für dich schreiben.",
                      content: (
                        <div style={{ display: "grid", gap: 10 }}>
                          <PitchGenerator profile={profile} onAdd={(text) => setProfile(p => ({ ...p, bio: text }))} />
                          <StaerkenGenerator onAdd={handleAddStaerken} />
                          <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Was treibt mich an? Was macht mich besonders?" rows={3} style={inp({ resize: "vertical" })} />
                        </div>
                      )
                    },
                    {
                      id: "staerken", label: "Stärken & Skills", icon: "⭐",
                      filled: (profile.strengths?.tags?.length || 0) + (profile.skills?.tags?.length || 0),
                      tip: "3–6 persönliche Stärken reichen. Bei Skills 5–10 konkrete Tools/Methoden.",
                      content: (
                        <div style={{ display: "grid", gap: 8 }}>
                          <TagField label="Persönliche Stärken" options={TAG_OPTIONS.strengths_personal} value={profile.strengths} onChange={v => setProfile({ ...profile, strengths: v })} placeholder="Weitere Stärken…" />
                          <TagField label="Fachliche Stärken" options={TAG_OPTIONS.strengths_professional} value={profile.strengths_professional} onChange={v => setProfile({ ...profile, strengths_professional: v })} placeholder="Weitere fachliche Stärken…" />
                          <TagField label="Skills & Tools" options={TAG_OPTIONS.skills} value={profile.skills} onChange={v => setProfile({ ...profile, skills: v })} placeholder="Weitere Skills…" />
                          <TagField label="Wie andere mich erleben" options={TAG_OPTIONS.strengths_others} value={profile.strengths_others} onChange={v => setProfile({ ...profile, strengths_others: v })} placeholder="z.B. Bin ein Sonnenschein im Team…" />
                          <TagField label="Besondere Fähigkeiten" options={TAG_OPTIONS.strengths_special} value={profile.strengths_special} onChange={v => setProfile({ ...profile, strengths_special: v })} placeholder="z.B. Hyperfokus…" />
                          <div><label style={lbl}>Spezialinteressen</label><textarea value={profile.special_interests} onChange={e => setProfile({ ...profile, special_interests: e.target.value })} placeholder="z.B. Klimaschutz, Astronomie…" rows={2} style={inp({ resize: "vertical" })} /></div>
                        </div>
                      )
                    },
                    {
                      id: "beduerfnisse", label: "Bedürfnisse am Arbeitsplatz", icon: "⚙️",
                      filled: profile.needs?.tags?.length || 0,
                      tip: "Wähle zuerst die relevanten Kategorien — dann nur innerhalb auswählen. Die 3 häufigsten werden im Profil oben angezeigt.",
                      content: (
                        <div style={{ display: "grid", gap: 8 }}>
                          <TagField label="Bedürfnisse" options={TAG_OPTIONS.needs} categories={NEED_CATEGORIES} value={profile.needs} onChange={v => setProfile({ ...profile, needs: v })} placeholder="Weitere Bedürfnisse…" />
                        </div>
                      )
                    },
                    {
                      id: "arbeitsweise", label: "Wie ich arbeite", icon: "🔄",
                      filled: (profile.work_style?.tags?.length || 0) + (profile.communication_prefs?.tags?.length || 0),
                      tip: "Optional — hilft Arbeitgebern einzuschätzen wie du am besten arbeitest.",
                      content: (
                        <div style={{ display: "grid", gap: 8 }}>
                          <TagField label="Arbeitsstil" options={TAG_OPTIONS.work_style} value={profile.work_style} onChange={v => setProfile({ ...profile, work_style: v })} placeholder="Wie arbeitest du am liebsten?" />
                          <TagField label="Kommunikation" options={TAG_OPTIONS.communication} value={profile.communication_prefs} onChange={v => setProfile({ ...profile, communication_prefs: v })} placeholder="Kommunikationspräferenzen…" />
                          <TagField label="Hilfsmittel & Technologien" options={TAG_OPTIONS.assistive_tech} value={profile.assistive_tech} onChange={v => setProfile({ ...profile, assistive_tech: v })} placeholder="Weitere Hilfsmittel…" />
                        </div>
                      )
                    },
                    {
                      id: "werdegang", label: "Werdegang", icon: "📋",
                      filled: !!profile.experience || !!profile.education,
                      tip: "Format für Stationen: \"MM.JJJJ – MM.JJJJ  Firma\" → neue Zeile \"Position\" → \"- Aufgabe\"",
                      content: (
                        <div style={{ display: "grid", gap: 14 }}>
                          <div>
                            <label style={lbl}>Berufserfahrung</label>
                            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>Format: "09.2022 – heute  Firma GmbH" → neue Zeile "Position" → "- Aufgabe"</p>
                            <textarea value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} placeholder={"09.2022 – heute  Stadt Ulm\nFallmanagement\n- Individuelle Beratung"} rows={6} style={inp({ resize: "vertical" })} />
                          </div>
                          <div>
                            <label style={lbl}>Bildungsweg</label>
                            <textarea value={profile.education} onChange={e => setProfile({ ...profile, education: e.target.value })} placeholder={"10.2018 – 03.2022  Hochschule XY\nB.A. Soziale Arbeit"} rows={4} style={inp({ resize: "vertical" })} />
                          </div>
                          <div><label style={lbl}>Sprachen</label><input type="text" value={profile.languages} onChange={e => setProfile({ ...profile, languages: e.target.value })} placeholder="Deutsch (Muttersprache), Englisch (B2)" style={inp()} /></div>
                        </div>
                      )
                    },
                    {
                      id: "einstellungen", label: "Vorbild & Fördercheck", icon: "🔧",
                      filled: profile.is_rolemodel || profile.has_disability_id ? 1 : 0,
                      tip: "Optional — nur ausfüllen wenn relevant.",
                      content: (
                        <div style={{ display: "grid", gap: 16 }}>
                          <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#CBD5E1", cursor: "pointer", marginBottom: 12 }}>
                              <input type="checkbox" checked={profile.is_rolemodel} onChange={e => setProfile({ ...profile, is_rolemodel: e.target.checked })} style={{ width: 18, height: 18 }} />
                              Als Vorbild in der Galerie sichtbar sein
                            </label>
                            {profile.is_rolemodel && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {ROLEMODEL_TAGS.map(tag => {
                                  const curr = profile.rolemodel_tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
                                  const sel = curr.includes(tag);
                                  return <button key={tag} type="button" onClick={() => { const next = sel ? curr.filter(t => t !== tag) : [...curr, tag]; setProfile({ ...profile, rolemodel_tags: next.join(", ") }); }} style={{ padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${sel ? COLORS.yellow : COLORS.border}`, background: sel ? COLORS.yellowBg : "transparent", color: sel ? COLORS.yellow : "#94A3B8", fontSize: 13, cursor: "pointer" }}>{tag}</button>;
                                })}
                              </div>
                            )}
                          </div>
                          <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#CBD5E1", cursor: "pointer", marginBottom: 10 }}>
                              <input type="checkbox" checked={profile.has_disability_id} onChange={e => setProfile({ ...profile, has_disability_id: e.target.checked })} style={{ width: 18, height: 18 }} />
                              Ich habe einen Schwerbehindertenausweis
                            </label>
                            {profile.has_disability_id && <input type="text" value={profile.disability_degree} onChange={e => setProfile({ ...profile, disability_degree: e.target.value })} placeholder="GdB z.B. 50" style={inp({ maxWidth: 200 })} />}
                          </div>
                        </div>
                      )
                    },
                  ].map(sektion => (
                    <EditSektion key={sektion.id} label={sektion.label} icon={sektion.icon} filled={sektion.filled} tip={sektion.tip}>
                      {sektion.content}
                    </EditSektion>
                  ))}

                  {saveMessage && (
                    <div style={{ padding: "12px 18px", borderRadius: 10, background: saveMessage.includes("✓") ? COLORS.greenBg : COLORS.redBg, color: saveMessage.includes("✓") ? COLORS.green : "#F87171", fontSize: 15 }}>
                      {saveMessage}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, paddingTop: 8, flexWrap: "wrap" }}>
                    <button onClick={saveProfile} style={{ background: COLORS.green, border: "none", color: "#0A0A0A", padding: "14px 32px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>✓ Profil speichern</button>
                    <button onClick={() => { setProfileMode("view"); setSaveMessage(""); }} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#94A3B8", padding: "14px 24px", borderRadius: 12, cursor: "pointer", fontSize: 15 }}>Abbrechen</button>
                    <button onClick={handleLogout} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, color: "#94A3B8", padding: "14px 20px", borderRadius: 12, cursor: "pointer", fontSize: 15, marginLeft: "auto" }}>Ausloggen</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ FÖRDERCHECK ══════════ */}
        {activeNav === "foerder" && (
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <FoerderInfo profile={profile} />
          </div>
        )}

        {/* ══════════ JOBS ══════════ */}
        {activeNav === "jobs" && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#F8FAFC", marginBottom: 8, letterSpacing: "-0.5px" }}>Jobs finden</h1>
            <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 40 }}>Direkte Links zu inklusiven Stellenbörsen — kein Schwerbehindertenausweis nötig.</p>

            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", marginBottom: 16 }}>Inklusive Jobbörsen</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }} className="two-col">
              {[
                { name: "myAbility.jobs", desc: "Größte inklusive Jobbörse DE/AT/CH — speziell für Menschen mit Behinderungen & chronischen Erkrankungen.", url: "https://www.myability.jobs/de/", color: COLORS.purple, badge: "Empfohlen" },
                { name: "Agentur für Arbeit", desc: "Offizielle Jobbörse der Bundesagentur — Filter für Schwerbehinderung & Inklusion verfügbar.", url: "https://www.arbeitsagentur.de/jobsuche/", color: COLORS.green },
                { name: "talentplus.de", desc: "Förderdatenbank & Jobportal speziell für Menschen mit Behinderungen.", url: "https://www.talentplus.de", color: COLORS.yellow },
              ].map(j => (
                <a key={j.name} href={j.url} target="_blank" rel="noreferrer"
                  style={{ background: COLORS.bgCard, border: `1px solid ${j.color}33`, borderRadius: 14, padding: "24px", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = j.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = j.color + "33"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <p style={{ fontWeight: 700, fontSize: 17, color: COLORS.textPrimary }}>{j.name}</p>
                    {j.badge && <span style={{ background: j.color + "22", color: j.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6 }}>{j.badge}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 14 }}>{j.desc}</p>
                  <span style={{ fontSize: 14, color: j.color, fontWeight: 600 }}>Zur Jobbörse →</span>
                </a>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", marginBottom: 16 }}>Allgemeine Jobbörsen</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }} className="two-col">
              {[
                { name: "Stepstone", url: "https://www.stepstone.de", tipp: "Filter: 'Schwerbehinderung willkommen'" },
                { name: "Indeed", url: "https://de.indeed.com", tipp: "Suche + 'Inklusion' oder 'Schwerbehinderung'" },
                { name: "LinkedIn", url: "https://www.linkedin.com/jobs", tipp: "Netzwerk + Bewerbung kombinieren" },
                { name: "Xing", url: "https://www.xing.com/jobs", tipp: "Deutschsprachiger Schwerpunkt" },
                { name: "Bundesjobs (Interamt)", url: "https://www.interamt.de", tipp: "Öffentlicher Dienst — Schwerbehinderung bevorzugt" },
                { name: "Jobware", url: "https://www.jobware.de", tipp: "Fachkräfte-Fokus" },
              ].map(j => (
                <a key={j.name} href={j.url} target="_blank" rel="noreferrer"
                  style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "16px 18px", textDecoration: "none", display: "block" }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: COLORS.textPrimary, marginBottom: 6 }}>{j.name}</p>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>💡 {j.tipp}</p>
                </a>
              ))}
            </div>

            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.purpleBorder}`, borderRadius: 14, padding: "24px 28px" }}>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: COLORS.purple }}>💡 Tipp: Profil-Link bei Bewerbungen mitschicken</p>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.6, marginBottom: 16 }}>Schick deinen Diffusion-Profillink direkt in der Bewerbung mit — inklusiv, ehrlich, ohne Stigma.</p>
              <button onClick={copyProfileLink} style={{ background: COLORS.purple, border: "none", color: "white", padding: "11px 22px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                {copyMessage || "🔗 Meinen Profillink kopieren"}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ VORBILDER ══════════ */}
        {activeNav === "vorbilder" && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#F8FAFC", marginBottom: 8, letterSpacing: "-0.5px" }}>Vorbilder</h1>
            <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 28 }}>Menschen die ihr Profil öffentlich teilen — als Inspiration.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
              {["", ...ROLEMODEL_TAGS].map(tag => (
                <button key={tag} onClick={() => setVorbildFilter(tag)}
                  style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${vorbildFilter === tag ? COLORS.purple : COLORS.border}`, background: vorbildFilter === tag ? COLORS.purpleBg : "transparent", color: vorbildFilter === tag ? COLORS.purple : COLORS.textMuted, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                  {tag || "Alle"}
                </button>
              ))}
            </div>
            {vorbilder.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🌱</p>
                <p style={{ fontSize: 18, marginBottom: 8 }}>Noch keine Vorbilder eingetragen.</p>
                <p style={{ fontSize: 15, marginBottom: 24, color: "#94A3B8" }}>Sei die erste Person — aktiviere "Als Vorbild sichtbar sein" in deinem Profil!</p>
                <button onClick={() => { setActiveNav("profil"); setProfileMode("edit"); }} style={{ background: COLORS.purple, border: "none", color: "white", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
                  Profil bearbeiten →
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {vorbilder.filter(v => !vorbildFilter || v.rolemodel_tags?.includes(vorbildFilter)).map(v => {
                  const ini = v.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
                  const tags = v.rolemodel_tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
                  return (
                    <a key={v.id} href={`/profil/${v.id}`}
                      style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.purple}
                      onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                        {v.avatar_url ? (
                          <img src={v.avatar_url} alt={v.full_name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${COLORS.purple}` }} />
                        ) : (
                          <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "white", flexShrink: 0 }}>{ini}</div>
                        )}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 16, color: COLORS.textPrimary, marginBottom: 3 }}>{v.full_name || "Anonym"}</p>
                          {v.headline && <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.4 }}>{v.headline}</p>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {tags.map(t => <span key={t} style={{ padding: "4px 10px", borderRadius: 6, background: COLORS.purpleBg, color: COLORS.purple, fontSize: 12, border: `1px solid ${COLORS.purpleBorder}` }}>{t}</span>)}
                        {v.looking_for_work && <span style={{ padding: "4px 10px", borderRadius: 6, background: COLORS.greenBg, color: COLORS.green, fontSize: 12, border: `1px solid ${COLORS.greenBorder}` }}>Offen für Stellen</span>}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ PINNWAND ══════════ */}
        {activeNav === "pinnwand" && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#F8FAFC", marginBottom: 8, letterSpacing: "-0.5px" }}>Pinnwand</h1>
            <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 32 }}>Teile Erfahrungen, Tipps und Sorgen — anonym oder mit Namen.</p>

            {/* Neuer Beitrag */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px 28px", marginBottom: 28 }}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#CBD5E1" }}>Neuer Beitrag</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 14 }} className="two-col">
                <select value={beitragKategorie} onChange={e => setBeitragKategorie(e.target.value)}
                  style={{ padding: "11px 14px", background: COLORS.bgInput, border: `1.5px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontSize: 14 }}>
                  {["Erfahrung", "Tipp", "Arbeitgeber", "Amt / Behörde", "Frage", "Erfolg", "Sonstiges"].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#94A3B8", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={anonym} onChange={e => setAnonym(e.target.checked)} />
                  Anonym
                </label>
              </div>
              <textarea value={neuerBeitrag} onChange={e => setNeuerBeitrag(e.target.value)}
                placeholder="Was möchtest du teilen? Erfahrungen, Tipps, Fragen…" rows={4}
                style={{ width: "100%", padding: "13px 16px", background: COLORS.bgInput, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.textPrimary, fontFamily: FONT, fontSize: 15, resize: "vertical" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button onClick={postBeitrag} disabled={!neuerBeitrag.trim()}
                  style={{ background: COLORS.purple, border: "none", color: "white", padding: "11px 24px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700, opacity: neuerBeitrag.trim() ? 1 : 0.4 }}>
                  Veröffentlichen
                </button>
              </div>
            </div>

            {/* Beiträge */}
            {pinnwandLoading ? (
              <p style={{ color: "#94A3B8", textAlign: "center", padding: "40px 0", fontSize: 16 }}>Lädt…</p>
            ) : pinnwandBeitraege.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>📌</p>
                <p style={{ fontSize: 18 }}>Noch keine Beiträge. Sei die erste Person!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {pinnwandBeitraege.map(b => {
                  const catColors = { "Erfahrung": COLORS.purple, "Tipp": COLORS.green, "Arbeitgeber": COLORS.yellow, "Amt / Behörde": "#FB923C", "Frage": "#38BDF8", "Erfolg": COLORS.green, "Sonstiges": COLORS.textMuted };
                  const cc = catColors[b.kategorie] || COLORS.textMuted;
                  return (
                    <div key={b.id} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ padding: "4px 12px", borderRadius: 6, background: cc + "22", color: cc, fontSize: 12, fontWeight: 600, border: `1px solid ${cc}44` }}>{b.kategorie}</span>
                          <span style={{ fontSize: 13, color: "#94A3B8" }}>{b.anonym ? "Anonym" : b.anzeigename || "Nutzer:in"}</span>
                          <span style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(b.created_at).toLocaleDateString("de-DE")}</span>
                        </div>
                        {b.user_id === user?.id && (
                          <button onClick={() => deleteBeitrag(b.id)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 18, padding: "0 4px" }} title="Löschen">×</button>
                        )}
                      </div>
                      <p style={{ fontSize: 15, color: "#CBD5E1", lineHeight: 1.75 }}>{b.inhalt}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#94A3B8" }}>
          <a href="/impressum" style={{ color: "#94A3B8", textDecoration: "none" }}>Impressum & Datenschutz</a>
          {" · "}Diffusion — Different.Inclusion
        </p>
      </footer>
    </div>
  );
}
