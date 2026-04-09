import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import AuthScreen from "./AuthScreen";
import FoerderInfo from "./FoerderInfo";
import PublicProfile from "./PublicProfile";
import {
  EMPTY_PROFILE, TAG_OPTIONS, NEED_CATEGORIES,
} from "./constants";
import { parseStoredField, serializeField } from "./profileUtils";

const NAV = [
  { id: "profil", label: "Profil" },
  { id: "foerder", label: "Fördercheck" },
  { id: "jobs", label: "Jobs" },
  { id: "vorbilder", label: "Vorbilder" },
  { id: "pinnwand", label: "Pinnwand" },
];

const ROLEMODEL_TAGS = [
  "Neurodivergent", "ADHS", "Autismus", "Körperbehinderung", "Sehbehinderung",
  "Hörbehinderung", "Chronische Erkrankung", "Psychische Erkrankung",
  "Lernschwierigkeit", "ME/CFS", "Diverse Behinderung",
];

function TagField({ label, options, value, onChange, placeholder, categories }) {
  const [open, setOpen] = useState(false);
  const selectedTags = value?.tags || [];
  const customText = value?.custom || "";

  const toggleTag = (tag) => {
    const nextTags = selectedTags.includes(tag) ? selectedTags.filter(i => i !== tag) : [...selectedTags, tag];
    onChange({ tags: nextTags, custom: customText });
  };

  const selectedCount = selectedTags.length + (customText.trim() ? 1 : 0);

  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#1a1a1a", border: "1.5px solid #ff69b4", borderRadius: 10, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", color: "white", fontSize: 14 }}>
        <span style={{ fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {selectedCount > 0 && <span style={{ background: "#A855F7", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{selectedCount}</span>}
          <span style={{ color: "#4169e1", fontSize: 18 }}>{open ? "−" : "+"}</span>
        </span>
      </button>
      
      {open && (
        <div style={{ background: "#ff7f50", border: "1.5px solid #40e0d0", borderTop: "none", borderRadius: "0 0 10px 10px", padding: 16 }}>
          {categories ? (
            <div style={{ display: "grid", gap: 12 }}>
              {categories.map(cat => (
                <div key={cat.title}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 8 }}>{cat.title}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cat.tags.map(tag => {
                      const sel = selectedTags.includes(tag);
                      return <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel ? "#A855F7" : "#ff69b4"}`, background: sel ? "#23375b" : "transparent", color: sel ? "#A855F7" : "#888", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer" }}>{tag}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {options.map(tag => {
                const sel = selectedTags.includes(tag);
                return <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel ? "#A855F7" : "#ff69b4"}`, background: sel ? "#23375b" : "transparent", color: sel ? "#A855F7" : "#888", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, cursor: "pointer" }}>{tag}</button>;
              })}
            </div>
          )}
          <textarea value={customText} onChange={e => onChange({ tags: selectedTags, custom: e.target.value })} placeholder={placeholder} rows={2}
            style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1.5px solid #ff69b4", borderRadius: 8, color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, resize: "vertical", marginTop: 12 }} />
        </div>
      )}
    </div>
  );
}

export default function MainApp() {
  const [activeNav, setActiveNav] = useState("profil");
  const [profileMode, setProfileMode] = useState("view"); // "view" | "edit"
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadProfile();
    else { setProfile(EMPTY_PROFILE); setSaveMessage(""); }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (activeNav === "pinnwand") loadPinnwand();
    if (activeNav === "vorbilder") loadVorbilder();
  }, [activeNav]); // eslint-disable-line

  async function loadProfile() {
    setProfileLoading(true);
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setProfileLoading(false); return; }
    const { data, error } = await supabase.from("profiles").select("*").eq("id", cu.id).maybeSingle();
    if (error) { setSaveMessage("Profil konnte nicht geladen werden."); setProfileLoading(false); return; }
    if (data) {
      setProfile({
        full_name: data.full_name || "", headline: data.headline || "", bio: data.bio || "",
        strengths: parseStoredField(data.strengths),
        strengths_professional: parseStoredField(data.strengths_professional),
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
      });
    } else { setProfile(EMPTY_PROFILE); }
    setProfileLoading(false);
  }

  async function loadPinnwand() {
    setPinnwandLoading(true);
    const { data } = await supabase.from("pinnwand").select("*, profiles(full_name, avatar_url)").order("created_at", { ascending: false }).limit(50);
    if (data) setPinnwandBeitraege(data);
    setPinnwandLoading(false);
  }

  async function loadVorbilder() {
    const { data } = await supabase.from("profiles").select("id, full_name, headline, avatar_url, rolemodel_tags, work_model, looking_for_work").eq("is_rolemodel", true).limit(50);
    if (data) setVorbilder(data);
  }

  async function uploadAvatar(file) {
    setAvatarUploading(true);
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setAvatarUploading(false); return; }
    const fileExt = file.name.split(".").pop();
    const filePath = `${cu.id}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) { setSaveMessage("Bild-Upload fehlgeschlagen."); setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile(prev => ({ ...prev, avatar_url: data.publicUrl + "?t=" + Date.now() }));
    setAvatarUploading(false);
    setSaveMessage("Bild hochgeladen! Bitte Profil speichern.");
  }

  async function saveProfile() {
    setSaveMessage("");
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) { setSaveMessage("Bitte zuerst einloggen."); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: cu.id,
      full_name: profile.full_name, headline: profile.headline, bio: profile.bio,
      strengths: serializeField(profile.strengths),
      strengths_professional: serializeField(profile.strengths_professional),
      special_interests: profile.special_interests,
      work_style: serializeField(profile.work_style),
      communication_prefs: serializeField(profile.communication_prefs),
      assistive_tech: serializeField(profile.assistive_tech),
      needs: serializeField(profile.needs),
      skills: serializeField(profile.skills),
      experience: profile.experience, education: profile.education,
      languages: profile.languages, availability: profile.availability,
      contact_info: profile.contact_info, work_model: profile.work_model,
      looking_for_work: profile.looking_for_work, avatar_url: profile.avatar_url,
      has_disability_id: profile.has_disability_id,
      disability_degree: profile.disability_degree, support_needs: profile.support_needs,
      is_rolemodel: profile.is_rolemodel, rolemodel_tags: profile.rolemodel_tags,
    }, { onConflict: "id" });
    if (error) setSaveMessage("Speichern hat nicht funktioniert: " + error.message);
    else { setSaveMessage("✓ Gespeichert!"); setProfileMode("view"); }
  }

  async function copyProfileLink() {
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) return;
    navigator.clipboard.writeText(`${window.location.origin}/profil/${cu.id}`).then(() => {
      setCopyMessage("✓ Link kopiert!");
      setTimeout(() => setCopyMessage(""), 3000);
    });
  }

  async function postBeitrag() {
    if (!neuerBeitrag.trim()) return;
    const { data: { user: cu } } = await supabase.auth.getUser();
    if (!cu) return;
    const { error } = await supabase.from("pinnwand").insert({
      user_id: cu.id,
      inhalt: neuerBeitrag.trim(),
      kategorie: beitragKategorie,
      anonym,
      anzeigename: anonym ? null : profile.full_name || cu.email,
    });
    if (!error) { setNeuerBeitrag(""); loadPinnwand(); }
  }

  async function deleteBeitrag(id) {
    await supabase.from("pinnwand").delete().eq("id", id);
    loadPinnwand();
  }

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const avatarInitial = (profile.full_name?.[0] || user?.email?.[0] || "D").toUpperCase();

  const inp = (extra = {}) => ({ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1.5px solid #ff69b4", borderRadius: 10, color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, ...extra });
  const lbl = { display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 6 };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "'Space Grotesk', sans-serif" }}>Lädt…</p>
    </div>
  );

  if (!user) return <AuthScreen />;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "white", fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :focus-visible { outline: 3px solid #A855F7; outline-offset: 2px; }
        button { font-family: 'Space Grotesk', sans-serif; }
        input, textarea, select { font-family: 'Space Grotesk', sans-serif; }
        input:focus, textarea:focus, select:focus { outline: 2px solid #A855F7; border-color: #A855F7 !important; }
        .nav-btn { transition: all 0.15s; }
        .nav-btn:hover { background: #1a1a1a !important; }
        .edit-banner { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.8; } }
        @media (max-width: 600px) { .two-col { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#0A0A0A", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 32, height: 32 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 22, height: 22, borderRadius: "50%", background: "#A855F7" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "#4ade80", opacity: 0.85 }} />
            </div>
            <div>
              <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px" }}>Diffusion</span>
              <span style={{ fontSize: 20, color: "#444", display: "block", letterSpacing: "0.05em" }}>Different.Inclusion</span>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map(item => (
              <button key={item.id} className="nav-btn" onClick={() => { setActiveNav(item.id); if (item.id === "profil") setProfileMode("view"); }}
                style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: activeNav === item.id ? "#23375b" : "transparent", color: activeNav === item.id ? "#A855F7" : "#888", borderBottom: activeNav === item.id ? "2px solid #A855F7" : "2px solid transparent" }}>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #A855F7" }} onClick={() => setActiveNav("profil")} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontWeight: 700 }} onClick={() => setActiveNav("profil")}>
                {avatarInitial}
              </div>
            )}
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ff69b4", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: "#666" }}>Logout</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: activeNav === "profil" ? 800 : 1100, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ==================== PROFIL ==================== */}
        {activeNav === "profil" && (
          <div>
            {/* Profil-Header mit Link + Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>Mein Profil</h1>
                <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                  {profile.full_name ? `${profile.full_name} · ` : ""}{profileMode === "edit" ? "Bearbeitungsmodus aktiv" : "Profilansicht"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {profileMode === "view" ? (
                  <>
                    <button onClick={() => { copyProfileLink(); }} style={{ background: "transparent", border: "1.5px solid #ff69b4", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                      {copyMessage || "🔗 Link teilen"}
                    </button>
                    <button onClick={() => setProfileMode("edit")} style={{ background: "#A855F7", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                      ✏️ Bearbeiten
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setProfileMode("view")} style={{ background: "transparent", border: "1.5px solid #ff69b4", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                      Abbrechen
                    </button>
                    <button onClick={saveProfile} style={{ background: "#4ade80", border: "none", color: "#0A0A0A", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                      ✓ Speichern
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bearbeitungsmodus Banner */}
            {profileMode === "edit" && (
              <div className="edit-banner" style={{ background: "#23375b", border: "2px solid #A855F7", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>✏️</span>
                <p style={{ fontSize: 14, color: "#4169e1", fontWeight: 600 }}>Du bist im Bearbeitungsmodus — Änderungen werden erst nach "Speichern" übernommen.</p>
              </div>
            )}

            {/* PROFILANSICHT */}
            {profileMode === "view" && (
              <PublicProfile userId={user?.id} isPublic={false} onEdit={() => setProfileMode("edit")} />
            )}

            {/* BEARBEITUNGSMODUS */}
            {profileMode === "edit" && (
              <div style={{ background: "#141414", border: "2px solid #A855F7", borderRadius: 14, padding: "28px 32px" }}>
                <div style={{ display: "grid", gap: 20 }}>

                  {/* Avatar */}
                  <div>
                    <label style={lbl}>Profilbild</label>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current?.click()}>
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #A855F7" }} />
                        ) : (
                          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>{avatarInitial}</div>
                        )}
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <span style={{ color: "white", fontSize: 11, fontWeight: 600 }}>{avatarUploading ? "..." : "Ändern"}</span>
                        </div>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0]); }} />
                      <p style={{ fontSize: 12, color: "#555" }}>Klick auf das Bild zum Ändern</p>
                    </div>
                  </div>

                  {/* Basis */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#4169e1", marginBottom: 16 }}>Wer ich bin</p>
                    <div style={{ display: "grid", gap: 14 }}>
                      <div><label style={lbl}>Name</label><input type="text" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Dein Name" style={inp()} /></div>
                      <div><label style={lbl}>Headline</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} placeholder="z.B. UX-Designerin mit Fokus auf Barrierefreiheit" style={inp()} /></div>
                      <div><label style={lbl}>Über mich (2-3 Sätze)</label><textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Was treibt mich an? Was macht mich besonders?" style={inp({ resize: "vertical", minHeight: 80 })} /></div>
                    </div>
                  </div>

                  {/* Stärken */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", marginBottom: 16 }}>Was ich mitbringe</p>
                    <div style={{ display: "grid", gap: 10 }}>
                      <TagField label="Persönliche Stärken" options={TAG_OPTIONS.strengths_personal} value={profile.strengths} onChange={v => setProfile({ ...profile, strengths: v })} placeholder="Weitere Stärken..." />
                      <TagField label="Fachliche Stärken" options={TAG_OPTIONS.strengths_professional} value={profile.strengths_professional} onChange={v => setProfile({ ...profile, strengths_professional: v })} placeholder="Weitere fachliche Stärken..." />
                      <TagField label="Skills & Tools" options={TAG_OPTIONS.skills} value={profile.skills} onChange={v => setProfile({ ...profile, skills: v })} placeholder="Weitere Skills..." />
                      <div><label style={lbl}>Spezialinteressen</label><textarea value={profile.special_interests} onChange={e => setProfile({ ...profile, special_interests: e.target.value })} placeholder="z.B. Systemdenken, Klimaschutz, Programmieren..." style={inp({ resize: "vertical", minHeight: 70 })} /></div>
                    </div>
                  </div>

                  {/* Arbeitsweise */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#facc15", marginBottom: 16 }}>Wie ich arbeite</p>
                    <div style={{ display: "grid", gap: 10 }}>
                      <TagField label="Arbeitsstil" options={TAG_OPTIONS.work_style} value={profile.work_style} onChange={v => setProfile({ ...profile, work_style: v })} placeholder="Wie arbeitest du am liebsten?" />
                      <TagField label="Kommunikation" options={TAG_OPTIONS.communication} value={profile.communication_prefs} onChange={v => setProfile({ ...profile, communication_prefs: v })} placeholder="Kommunikationspräferenzen..." />
                      <TagField label="Hilfsmittel & Technologien" options={TAG_OPTIONS.assistive_tech} value={profile.assistive_tech} onChange={v => setProfile({ ...profile, assistive_tech: v })} placeholder="Weitere Hilfsmittel..." />
                    </div>
                  </div>

                  {/* Bedürfnisse */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#4169e1", marginBottom: 16 }}>Was ich brauche</p>
                    <TagField label="Bedürfnisse am Arbeitsplatz" options={TAG_OPTIONS.needs} categories={NEED_CATEGORIES} value={profile.needs} onChange={v => setProfile({ ...profile, needs: v })} placeholder="Weitere Bedürfnisse..." />
                  </div>

                  {/* Werdegang */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#facc15", marginBottom: 16 }}>Werdegang</p>
                    <div style={{ display: "grid", gap: 14 }}>
                      <div><label style={lbl}>Berufserfahrung</label><textarea value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} placeholder="Jobs, Projekte, Ehrenamt..." style={inp({ resize: "vertical", minHeight: 80 })} /></div>
                      <div><label style={lbl}>Werdegang (Ausbildung, Studium, Praktika...)</label><textarea value={profile.education} onChange={e => setProfile({ ...profile, education: e.target.value })} placeholder="Offen für alle Wege" style={inp({ resize: "vertical", minHeight: 80 })} /></div>
                      <div><label style={lbl}>Sprachen</label><input type="text" value={profile.languages} onChange={e => setProfile({ ...profile, languages: e.target.value })} placeholder="z.B. Deutsch (Muttersprache), Englisch (B2)" style={inp()} /></div>
                    </div>
                  </div>

                  {/* Verfügbarkeit */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", marginBottom: 16 }}>Verfügbarkeit & Kontakt</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
                      <div><label style={lbl}>Verfügbar ab</label><input type="text" value={profile.availability} onChange={e => setProfile({ ...profile, availability: e.target.value })} placeholder="z.B. Ab sofort" style={inp()} /></div>
                      <div><label style={lbl}>Arbeitsmodell</label><input type="text" value={profile.work_model} onChange={e => setProfile({ ...profile, work_model: e.target.value })} placeholder="Remote, Hybrid, Vor Ort" style={inp()} /></div>
                    </div>
                    <div style={{ marginTop: 14 }}><label style={lbl}>Kontakt (optional — nur für dich sichtbar im öffentlichen Profil nicht)</label><input type="text" value={profile.contact_info} onChange={e => setProfile({ ...profile, contact_info: e.target.value })} placeholder="E-Mail, LinkedIn, Portfolio..." style={inp()} /></div>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 14, color: "#aaa", cursor: "pointer" }}>
                      <input type="checkbox" checked={profile.looking_for_work} onChange={e => setProfile({ ...profile, looking_for_work: e.target.checked })} />
                      Ich suche gerade aktiv eine Stelle
                    </label>
                  </div>

                  {/* Vorbild */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#facc15", marginBottom: 8 }}>Als Vorbild sichtbar sein</p>
                    <p style={{ fontSize: 13, color: "#555", marginBottom: 14 }}>Wenn du möchtest, kannst du dein Profil in der Vorbilder-Galerie zeigen — ohne Kontaktdaten.</p>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#aaa", cursor: "pointer", marginBottom: 12 }}>
                      <input type="checkbox" checked={profile.is_rolemodel} onChange={e => setProfile({ ...profile, is_rolemodel: e.target.checked })} />
                      Ich möchte als Vorbild sichtbar sein
                    </label>
                    {profile.is_rolemodel && (
                      <div>
                        <label style={lbl}>Meine Tags (z.B. Neurodivergent, ADHS...)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                          {ROLEMODEL_TAGS.map(tag => {
                            const currentTags = profile.rolemodel_tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
                            const sel = currentTags.includes(tag);
                            return <button key={tag} type="button" onClick={() => {
                              const tags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
                              setProfile({ ...profile, rolemodel_tags: tags.join(", ") });
                            }} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel ? "#facc15" : "#ff69b4"}`, background: sel ? "#facc1522" : "transparent", color: sel ? "#facc15" : "#666", fontSize: 12, cursor: "pointer" }}>{tag}</button>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fördercheck */}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 20 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 8 }}>Für den Fördercheck (nur für dich)</p>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#aaa", cursor: "pointer", marginBottom: 12 }}>
                      <input type="checkbox" checked={profile.has_disability_id} onChange={e => setProfile({ ...profile, has_disability_id: e.target.checked })} />
                      Ich habe einen Schwerbehindertenausweis (oder habe einen beantragt)
                    </label>
                    {profile.has_disability_id && (
                      <div><label style={lbl}>Grad der Behinderung (GdB)</label><input type="text" value={profile.disability_degree} onChange={e => setProfile({ ...profile, disability_degree: e.target.value })} placeholder="z.B. GdB 50" style={inp()} /></div>
                    )}
                  </div>

                  {profileLoading && <div style={{ padding: "10px 16px", borderRadius: 8, background: "#1a1a1a", color: "#666", fontSize: 13 }}>Wird geladen...</div>}
                  {saveMessage && <div style={{ padding: "10px 16px", borderRadius: 8, background: saveMessage.includes("✓") ? "#4ade8022" : "#ef444422", color: saveMessage.includes("✓") ? "#4ade80" : "#ef4444", border: `1px solid ${saveMessage.includes("✓") ? "#4ade8044" : "#ef444444"}`, fontSize: 13 }}>{saveMessage}</div>}

                  <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                    <button onClick={saveProfile} style={{ background: "#4ade80", border: "none", color: "#0A0A0A", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>✓ Profil speichern</button>
                    <button onClick={() => setProfileMode("view")} style={{ background: "transparent", border: "1.5px solid #ff69b4", color: "#888", padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>Abbrechen</button>
                    <button onClick={handleLogout} style={{ background: "transparent", border: "1.5px solid #ff69b4", color: "#666", padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, marginLeft: "auto" }}>Ausloggen</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== FÖRDERCHECK ==================== */}
        {activeNav === "foerder" && (
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <FoerderInfo profile={profile} />
          </div>
        )}

        {/* ==================== JOBS ==================== */}
        {activeNav === "jobs" && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>Jobs finden</h1>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 40 }}>Direkte Links zu inklusiven Stellenbörsen und allgemeinen Jobbörsen.</p>

            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 16 }}>Inklusive Jobbörsen</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }} className="two-col">
              {[
                { name: "myAbility.jobs", desc: "Größte inklusive Jobbörse DE/AT/CH — speziell für Menschen mit Behinderungen & chronischen Erkrankungen. Kein Schwerbehindertenausweis nötig.", url: "https://www.myability.jobs/de/", farbe: "#A855F7", badge: "Empfohlen" },
                { name: "Agentur für Arbeit", desc: "Offizielle Jobbörse der Bundesagentur für Arbeit — Filter für Schwerbehinderung & Inklusion verfügbar.", url: "https://www.arbeitsagentur.de/jobsuche/", farbe: "#4ade80", badge: null },
                { name: "talentplus.de", desc: "Förderdatenbank & Jobportal speziell für Menschen mit Behinderungen — mit Infos zu finanziellen Förderungen.", url: "https://www.talentplus.de", farbe: "#facc15", badge: null },
                { name: "Rehadat-Jobs", desc: "Stellenportal des Bundesministeriums für Arbeit — speziell für Menschen mit Behinderungen.", url: "https://www.rehadat-jobs.de", farbe: "#4ade80", badge: null },
              ].map(job => (
                <a key={job.name} href={job.url} target="_blank" rel="noreferrer"
                  style={{ background: "#141414", border: `1px solid ${job.farbe}44`, borderRadius: 14, padding: "20px 24px", textDecoration: "none", display: "block", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = job.farbe}
                  onMouseLeave={e => e.currentTarget.style.borderColor = job.farbe + "44"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, color: "white" }}>{job.name}</p>
                    {job.badge && <span style={{ background: job.farbe + "22", color: job.farbe, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>{job.badge}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>{job.desc}</p>
                  <span style={{ fontSize: 13, color: job.farbe, fontWeight: 600 }}>Zur Jobbörse →</span>
                </a>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", marginBottom: 16 }}>Allgemeine Jobbörsen</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="two-col">
              {[
                { name: "Stepstone", url: "https://www.stepstone.de", tipp: "Filter: 'Schwerbehinderung willkommen'" },
                { name: "Indeed", url: "https://de.indeed.com", tipp: "Suche + 'Schwerbehinderung' oder 'Inklusion'" },
                { name: "LinkedIn", url: "https://www.linkedin.com/jobs", tipp: "Filter: 'Disability (Protected Veteran)'" },
                { name: "Xing", url: "https://www.xing.com/jobs", tipp: "Deutschsprachiger Schwerpunkt" },
                { name: "Bundesjobs", url: "https://www.interamt.de", tipp: "Öffentlicher Dienst — Schwerbehinderung bevorzugt" },
                { name: "Jobware", url: "https://www.jobware.de", tipp: "Fachkräfte-Fokus" },
              ].map(j => (
                <a key={j.name} href={j.url} target="_blank" rel="noreferrer"
                  style={{ background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "14px 16px", textDecoration: "none", display: "block" }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "white", marginBottom: 4 }}>{j.name}</p>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>💡 {j.tipp}</p>
                </a>
              ))}
            </div>

            <div style={{ background: "#141414", border: "1px solid #A855F744", borderRadius: 14, padding: "20px 24px", marginTop: 32 }}>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#4169e1" }}>💡 Tipp: Profil-Link bei Bewerbungen mitschicken</p>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 15 }}>Schick deinen Diffusion-Profillink direkt in der Bewerbung mit — inklusiv, ehrlich, ohne Stigma.</p>
              <button onClick={() => { copyProfileLink(); setActiveNav("profil"); }} style={{ background: "#A855F7", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                {copyMessage || "🔗 Meinen Profillink kopieren"}
              </button>
            </div>
          </div>
        )}

        {/* ==================== VORBILDER ==================== */}
        {activeNav === "vorbilder" && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>Vorbilder</h1>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>Menschen die ihr inklusives Profil öffentlich teilen — als Inspiration und Ermutigung.</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              <button onClick={() => setVorbildFilter("")} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: vorbildFilter === "" ? "#A855F7" : "#ff69b4", background: vorbildFilter === "" ? "#23375b" : "transparent", color: vorbildFilter === "" ? "#A855F7" : "#666", cursor: "pointer", fontSize: 13 }}>
                Alle
              </button>
              {ROLEMODEL_TAGS.map(tag => (
                <button key={tag} onClick={() => setVorbildFilter(tag)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: vorbildFilter === tag ? "#A855F7" : "#ff69b4", background: vorbildFilter === tag ? "#23375b" : "transparent", color: vorbildFilter === tag ? "#A855F7" : "#666", cursor: "pointer", fontSize: 13 }}>
                  {tag}
                </button>
              ))}
            </div>

            {vorbilder.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#ff69b4" }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>🌱</p>
                <p style={{ fontSize: 16, marginBottom: 8 }}>Noch keine Vorbilder eingetragen.</p>
                <p style={{ fontSize: 14, color: "#444" }}>Sei die erste Person — aktiviere "Als Vorbild sichtbar sein" in deinem Profil!</p>
                <button onClick={() => { setActiveNav("profil"); setProfileMode("edit"); }} style={{ marginTop: 20, background: "#A855F7", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  Profil bearbeiten →
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {vorbilder.filter(v => !vorbildFilter || v.rolemodel_tags?.includes(vorbildFilter)).map(v => {
                  const initials = v.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
                  const tags = v.rolemodel_tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
                  return (
                    <a key={v.id} href={`/profil/${v.id}`} style={{ background: "#4169e1", border: "1px solid #ff69b4", borderRadius: 14, padding: "20px", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#A855F7"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#ffd700" }>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                        {v.avatar_url ? (
                          <img src={v.avatar_url} alt={v.full_name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #A855F7" }} />
                        ) : (
                          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                        )}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 15, color: "white", marginBottom: 2 }}>{v.full_name || "Anonym"}</p>
                          {v.headline && <p style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>{v.headline}</p>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {tags.map(tag => <span key={tag} style={{ padding: "3px 8px", borderRadius: 4, background: "#23375b", color: "#4169e1", fontSize: 11, border: "1px solid #A855F744" }}>{tag}</span>)}
                        {v.looking_for_work && <span style={{ padding: "3px 8px", borderRadius: 4, background: "#4ade8022", color: "#4ade80", fontSize: 11, border: "1px solid #4ade8044" }}>Offen für Stellen</span>}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== PINNWAND ==================== */}
        {activeNav === "pinnwand" && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>Pinnwand</h1>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>Teile Erfahrungen, Tipps und Sorgen — anonym oder mit Namen.</p>

            {/* Neuer Beitrag */}
            <div style={{ background: "#141414", border: "1px solid #ff69b4", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "#aaa" }}>Neuer Beitrag</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }} className="two-col">
                <select value={beitragKategorie} onChange={e => setBeitragKategorie(e.target.value)}
                  style={{ padding: "10px 14px", background: "#1a1a1a", border: "1.5px solid #ff69b4", borderRadius: 8, color: "white", fontSize: 13 }}>
                  {["Erfahrung", "Tipp", "Arbeitgeber", "Amt / Behörde", "Frage", "Erfolg", "Sonstiges"].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={anonym} onChange={e => setAnonym(e.target.checked)} />
                  Anonym
                </label>
              </div>
              <textarea value={neuerBeitrag} onChange={e => setNeuerBeitrag(e.target.value)} placeholder="Was möchtest du teilen? Erfahrungen mit Arbeitgebern, Ämtern, Tipps, Fragen..." rows={4}
                style={{ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1.5px solid #ff69b4", borderRadius: 10, color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, resize: "vertical" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={postBeitrag} disabled={!neuerBeitrag.trim()} style={{ background: "#A855F7", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, opacity: neuerBeitrag.trim() ? 1 : 0.4 }}>
                  Veröffentlichen
                </button>
              </div>
            </div>

            {/* Beiträge */}
            {pinnwandLoading ? (
              <p style={{ color: "#444", textAlign: "center", padding: "40px 0" }}>Lädt...</p>
            ) : pinnwandBeitraege.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#ff69b4" }}>
                <p style={{ fontSize: 40, marginBottom: 16 }}>📌</p>
                <p style={{ fontSize: 16 }}>Noch keine Beiträge. Sei die erste Person!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {pinnwandBeitraege.map(b => {
                  const isOwn = b.user_id === user?.id;
                  const catColors = { "Erfahrung": "#A855F7", "Tipp": "#4ade80", "Arbeitgeber": "#facc15", "Amt / Behörde": "#f97316", "Frage": "#38bdf8", "Erfolg": "#4ade80", "Sonstiges": "#888" };
                  const catColor = catColors[b.kategorie] || "#888";
                  return (
                    <div key={b.id} style={{ background: "#141414", border: "1px solid #ff69b4", borderRadius: 12, padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 6, background: catColor + "22", color: catColor, fontSize: 11, fontWeight: 600, border: `1px solid ${catColor}44` }}>{b.kategorie}</span>
                          <span style={{ fontSize: 13, color: "#555" }}>{b.anonym ? "Anonym" : b.anzeigename || "Nutzer:in"}</span>
                          <span style={{ fontSize: 11, color: "#ff69b4" }}>{new Date(b.created_at).toLocaleDateString("de-DE")}</span>
                        </div>
                        {isOwn && (
                          <button onClick={() => deleteBeitrag(b.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "0 4px" }} title="Löschen">×</button>
                        )}
                      </div>
                      <p style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7 }}>{b.inhalt}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 15, color: "#ff69b4" }}>
          <a href="/impressum" style={{ color: "#444", textDecoration: "none" }}>Impressum & Datenschutz</a>
          {" · "}
          <span>Diffusion — Different.Inclusion</span>
          {" · "}
          <span style={{ color: "#222" }}>Domain: {window.location.hostname}</span>
        </p>
      </footer>
    </div>
  );
}
