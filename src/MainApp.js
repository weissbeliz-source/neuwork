import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";
import {
  EMPTY_PROFILE,
  NAV_ITEMS,
  TAG_OPTIONS,
  NEED_CATEGORIES,
  JOBS,
  COMPANIES,
  parseStoredField,
  serializeField,
  renderTagFieldPreview
} from "./App";


function MainApp() {
  const [activeNav, setActiveNav] = useState("Entdecken");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const fileInputRef = useRef(null);

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

  async function loadProfile() {
    setProfileLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setProfileLoading(false); return; }
    const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
    if (error) { setSaveMessage("Profil konnte nicht geladen werden."); setProfileLoading(false); return; }
    if (data) {
      setProfile({
        full_name: data.full_name || "", headline: data.headline || "",
        strengths: parseStoredField(data.strengths), work_style: parseStoredField(data.work_style),
        needs: parseStoredField(data.needs), skills: parseStoredField(data.skills),
        work_model: data.work_model || "", looking_for_work: !!data.looking_for_work, avatar_url: data.avatar_url || "",
      });
    } else { setProfile(EMPTY_PROFILE); }
    setProfileLoading(false);
  }

  async function uploadAvatar(file) {
    setAvatarUploading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setAvatarUploading(false); return; }
    const fileExt = file.name.split(".").pop();
    const filePath = `${currentUser.id}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) { setSaveMessage("Bild-Upload fehlgeschlagen."); setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl + "?t=" + Date.now();
    setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
    setAvatarUploading(false);
    setSaveMessage("Bild hochgeladen! Bitte Profil speichern.");
  }

  async function saveProfile() {
    setSaveMessage("");
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setSaveMessage("Bitte zuerst einloggen."); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: currentUser.id, full_name: profile.full_name, headline: profile.headline,
      strengths: serializeField(profile.strengths), work_style: serializeField(profile.work_style),
      needs: serializeField(profile.needs), skills: serializeField(profile.skills),
      work_model: profile.work_model, looking_for_work: profile.looking_for_work, avatar_url: profile.avatar_url,
    }, { onConflict: "id" });
    if (error) setSaveMessage("Speichern hat nicht funktioniert.");
    else setSaveMessage("✓ Profil gespeichert!");
  }

  async function deleteProfile() {
    const confirmed = window.confirm("Willst du dein Profil wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.");
    if (!confirmed) return;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setSaveMessage("Bitte zuerst einloggen."); return; }
    if (profile.avatar_url) {
      try {
        const url = new URL(profile.avatar_url);
        const pathParts = url.pathname.split("/object/public/avatars/");
        const filePath = pathParts[1];
        if (filePath) await supabase.storage.from("avatars").remove([filePath]);
      } catch (error) { console.error("Avatar konnte nicht gelöscht werden:", error); }
    }
    const { error } = await supabase.from("profiles").delete().eq("id", currentUser.id);
    if (error) { setSaveMessage("Profil konnte nicht gelöscht werden."); return; }
    setProfile(EMPTY_PROFILE);
    setSaveMessage("Profil gelöscht.");
  }

  async function copyProfileLink() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;
    const url = `${window.location.origin}/profil/${currentUser.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyMessage("✓ Link kopiert!");
      setTimeout(() => setCopyMessage(""), 3000);
    });
  }

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const toggleSave = (id) => { setSavedJobs((prev) => prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]); };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F8F4ED", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 };
  const avatarInitial = (profile.full_name?.[0] || user?.email?.[0] || "M").toUpperCase();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#888" }}>mole lädt...</span>
    </div>
  );

  if (!user) return <AuthScreen />;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#F5F0E8", minHeight: "100vh", color: "#2C2C2C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-item { cursor: pointer; padding: 8px 16px; border-radius: 20px; transition: all 0.2s; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; background: none; border: none; }
        .nav-item:hover { background: rgba(0,0,0,0.07); }
        .nav-item.active { background: #2C2C2C; color: #F5F0E8; }
        .job-card { background: white; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.25s; border: 2px solid transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .job-card.selected { border-color: #2C2C2C; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-family: 'Source Sans 3', sans-serif; font-weight: 500; background: #F5F0E8; color: #555; margin: 3px 3px 3px 0; }
        .btn-primary { background: #2C2C2C; color: #F5F0E8; border: none; padding: 12px 24px; border-radius: 24px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .btn-primary:hover { background: #444; }
        .btn-outline { background: transparent; color: #2C2C2C; border: 2px solid #2C2C2C; padding: 10px 22px; border-radius: 24px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .btn-outline:hover { background: #2C2C2C; color: #F5F0E8; }
        .company-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.2s; }
        .section-label { font-family: 'Source Sans 3', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 12px; }
        .match-badge { display: inline-flex; align-items: center; background: #EEF7F1; color: #2D7A4F; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-family: 'Source Sans 3', sans-serif; font-weight: 600; }
        .avatar-upload:hover .avatar-overlay { opacity: 1 !important; }
      `}</style>

      <header style={{ background: "#F5F0E8", borderBottom: "1px solid #E2DBD0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#2C2C2C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#F5F0E8", fontSize: 14 }}>∞</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>mole</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <button key={item} className={`nav-item${activeNav === item ? " active" : ""}`} onClick={() => { setActiveNav(item); setSelectedJob(null); }}>{item}</button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }} onClick={() => setActiveNav("Profil")} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#8B7EC8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setActiveNav("Profil")}>
                <span style={{ color: "white", fontSize: 14, fontWeight: 600, fontFamily: "Source Sans 3" }}>{avatarInitial}</span>
              </div>
            )}
            <button onClick={handleLogout} style={{ background: "none", border: "1.5px solid #ddd", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 12, color: "#888" }}>Logout</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {activeNav === "Entdecken" && (
          <div>
            <div style={{ background: "white", borderRadius: 20, padding: 32, marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Jetzt vormerken lassen</h2>
              <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15, marginBottom: 24 }}>Sei dabei wenn mole startet – trag dich in die Warteliste ein.</p>
              <iframe src={WAITLIST_URL} width="100%" height="305" frameBorder="0" scrolling="auto" title="Waitlist" style={{ maxWidth: 540, display: "block", margin: "0 auto" }}></iframe>
            </div>
            <div style={{ marginBottom: 48, maxWidth: 600 }}>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>Willkommen, {user.email}</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
                Inklusiv. Für uns.<br /><em style={{ fontStyle: "italic", color: "#8B7EC8" }}>Ab sofort.</em>
              </h1>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 480 }}>Ein Netzwerk ohne Masking-Zwang. Firmen, die neurodivergente Stärken wirklich schätzen – nicht nur tolerieren.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
              {[{ n: "247", label: "Inklusive Firmen", color: "#7C9E87" }, { n: "1.840", label: "Offene Stellen", color: "#8B7EC8" }, { n: "12.500+", label: "Mitglieder", color: "#D4956A" }].map((s) => (
                <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.n}</div>
                  <div style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#888" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p className="section-label">Passend für dich</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
              {JOBS.slice(0, 2).map((job) => (
                <div key={job.id} className="job-card" onClick={() => { setActiveNav("Jobs"); setSelectedJob(job); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: job.color + "22" }} />
                    <span className="match-badge">✓ {job.match}%</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{job.title}</h3>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", marginBottom: 12 }}>{job.company} · {job.type}</p>
                  <div>{job.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button className="btn-outline" onClick={() => setActiveNav("Jobs")}>Alle Jobs ansehen →</button>
            </div>
          </div>
        )}

        {activeNav === "Jobs" && (
          <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr 1.2fr" : "1fr", gap: 28 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Offene Stellen</h2>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#888", marginBottom: 24 }}>Gefiltert nach deinen Bedürfnissen</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {JOBS.map((job) => (
                  <div key={job.id} className={`job-card${selectedJob?.id === job.id ? " selected" : ""}`} onClick={() => setSelectedJob(job)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: job.color + "22", flexShrink: 0 }} />
                        <div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600 }}>{job.title}</h3>
                          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888" }}>{job.company} · {job.type}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="match-badge">{job.match}%</span>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: savedJobs.includes(job.id) ? "#D4956A" : "#ccc" }}>
                          {savedJobs.includes(job.id) ? "♥" : "♡"}
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>{job.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
            {selectedJob && (
              <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", height: "fit-content", position: "sticky", top: 84 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{selectedJob.title}</h2>
                <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 14, marginBottom: 20 }}>{selectedJob.company} · {selectedJob.type}</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 24 }}>{selectedJob.desc}</p>
                <p className="section-label">Inklusive Arbeitsbedingungen</p>
                {selectedJob.tags.map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedJob.color }} />
                    <span style={{ fontFamily: "Source Sans 3", fontSize: 14 }}>{t}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button className="btn-primary" style={{ flex: 1 }}>Jetzt bewerben</button>
                  <button onClick={() => toggleSave(selectedJob.id)} style={{ background: "none", border: "2px solid #ddd", borderRadius: 24, padding: "10px 16px", cursor: "pointer", fontSize: 18, color: savedJobs.includes(selectedJob.id) ? "#D4956A" : "#aaa" }}>
                    {savedJobs.includes(selectedJob.id) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeNav === "Firmen" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Inklusive Firmen</h2>
            <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15, marginBottom: 36 }}>Geprüfte Arbeitgeber, die neurodivergente Menschen wirklich willkommen heißen</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {COMPANIES.map((c) => (
                <div key={c.id} className="company-card">
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: c.color + "22", flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600 }}>{c.name}</h3>
                      <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888" }}>{c.sector}</p>
                    </div>
                  </div>
                  <span style={{ background: c.color + "22", color: c.color, padding: "4px 12px", borderRadius: 12, fontSize: 12, fontFamily: "Source Sans 3", fontWeight: 600 }}>✓ {c.badge}</span>
                  <div style={{ margin: "16px 0" }}>
                    <p className="section-label">Was diese Firma bietet</p>
                    {c.checks.map((check) => (
                      <div key={check} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: c.color }}>✓</span>
                        <span style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#555" }}>{check}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#aaa" }}>{c.employees} Mitarbeitende</span>
                    <button className="btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>Profil ansehen</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "Community" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Community</h2>
            <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15, marginBottom: 36 }}>Austausch ohne Druck. Schreibe wenn du magst, lies wann du willst.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { title: "ADHS & Beruf", desc: "Tipps, Strategien und Solidarität für den Arbeitsalltag mit ADHS", members: 2847, color: "#8B7EC8", posts: 142 },
                { title: "Autismus & Karriere", desc: "Erfahrungen teilen, Fragen stellen, Netzwerk aufbauen", members: 1923, color: "#7C9E87", posts: 98 },
                { title: "Bewerbungsgesprächs-Hilfe", desc: "Gemeinsam üben, Fragen klären, Nerven beruhigen", members: 1456, color: "#D4956A", posts: 76 },
                { title: "Arbeitsrechte & Nachteilsausgleich", desc: "Rechtliche Infos, Erfahrungen mit Arbeitgebern", members: 987, color: "#5B9BAD", posts: 54 },
                { title: "Erfolgsgeschichten", desc: "Inspirierende Jobs und Momente teilen", members: 3102, color: "#C4A86E", posts: 203 },
                { title: "Remote Work", desc: "Tipps für produktives, neurodiv-freundliches Homeoffice", members: 2210, color: "#A07890", posts: 119 },
              ].map((group) => (
                <div key={group.title} className="company-card" style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: group.color + "22", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{group.title}</h3>
                      <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 8 }}>{group.desc}</p>
                      <span style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#aaa" }}>👥 {group.members.toLocaleString()} · 💬 {group.posts} Posts</span>
                    </div>
                    <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0, height: "fit-content" }}>Beitreten</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "Profil" && (
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ background: "white", borderRadius: 20, padding: 32, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
                <div className="avatar-upload" style={{ position: "relative", cursor: "pointer", flexShrink: 0 }} onClick={() => fileInputRef.current?.click()}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profilbild" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#8B7EC8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "white", fontSize: 28, fontWeight: 600, fontFamily: "Source Sans 3" }}>{avatarInitial}</span>
                    </div>
                  )}
                  <div className="avatar-overlay" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}>
                    <span style={{ color: "white", fontSize: 11, fontFamily: "Source Sans 3", fontWeight: 600 }}>{avatarUploading ? "..." : "Ändern"}</span>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0]); }} />
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{profile.full_name || user.email}</h2>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#888" }}>{profile.headline || "Mole-Mitglied"}</p>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#aaa", marginTop: 4 }}>Klick auf das Bild um es zu ändern</p>
                </div>
              </div>

              {/* Profil teilen */}
              <div style={{ background: "#F5F0E8", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 600, color: "#2C2C2C", marginBottom: 2 }}>🔗 Profil teilen</p>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888" }}>Schick diesen Link an Firmen – ohne E-Mail, ohne Login</p>
                </div>
                <button onClick={copyProfileLink} style={{ background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                  {copyMessage || "Link kopieren"}
                </button>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Dein Name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Headline</label>
                  <input type="text" value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} placeholder="Zum Beispiel: UX Research mit Fokus auf Barrierefreiheit" style={inputStyle} />
                </div>
                <TagField label="Deine Stärken" options={TAG_OPTIONS.strengths} value={profile.strengths} onChange={(v) => setProfile({ ...profile, strengths: v })} placeholder="Optional: weitere Stärken frei ergänzen" />
                <TagField label="Wie arbeitest du am liebsten?" options={TAG_OPTIONS.work_style} value={profile.work_style} onChange={(v) => setProfile({ ...profile, work_style: v })} placeholder="Optional: deine Arbeitsweise frei ergänzen" />
                <TagField label="Was brauchst du, um gut arbeiten zu können?" options={TAG_OPTIONS.needs} categories={NEED_CATEGORIES} value={profile.needs} onChange={(v) => setProfile({ ...profile, needs: v })} placeholder="Optional: weitere Bedürfnisse frei ergänzen" />
                <TagField label="Skills" options={TAG_OPTIONS.skills} value={profile.skills} onChange={(v) => setProfile({ ...profile, skills: v })} placeholder="Optional: weitere Skills frei ergänzen" />
                <div>
                  <label style={labelStyle}>Arbeitsmodell</label>
                  <input type="text" value={profile.work_model} onChange={(e) => setProfile({ ...profile, work_model: e.target.value })} placeholder="Remote, Hybrid oder Vor Ort" style={inputStyle} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Source Sans 3", fontSize: 14, color: "#444" }}>
                  <input type="checkbox" checked={profile.looking_for_work} onChange={(e) => setProfile({ ...profile, looking_for_work: e.target.checked })} />
                  Ich suche gerade aktiv
                </label>
                {profileLoading && <div style={{ padding: "12px 16px", borderRadius: 12, background: "#F3F4F6", color: "#666", fontFamily: "Source Sans 3", fontSize: 13 }}>Profil wird geladen...</div>}
                {saveMessage && <div style={{ padding: "12px 16px", borderRadius: 12, background: saveMessage.includes("nicht") || saveMessage.includes("fehlge") ? "#FEE2E2" : "#EEF7F1", color: saveMessage.includes("nicht") || saveMessage.includes("fehlge") ? "#DC2626" : "#2D7A4F", fontFamily: "Source Sans 3", fontSize: 13 }}>{saveMessage}</div>}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={saveProfile}>Profil speichern</button>
                  <button className="btn-outline" onClick={handleLogout}>Ausloggen</button>
                  <button onClick={deleteProfile} style={{ background: "transparent", color: "#B42318", border: "2px solid #F1B5AE", padding: "10px 18px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 600 }}>Profil löschen</button>
                </div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p className="section-label">Vorschau</p>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#8B7EC8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: 20, fontWeight: 600, fontFamily: "Source Sans 3" }}>{avatarInitial}</span>
                  </div>
                )}
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{profile.full_name || "Dein Name"}</h3>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#666" }}>{profile.headline || "Deine Headline erscheint hier."}</p>
                </div>
              </div>
              <div style={{ display: "grid", gap: 18 }}>
                {[{ label: "Stärken", field: profile.strengths }, { label: "Arbeitsweise", field: profile.work_style }, { label: "Bedürfnisse", field: profile.needs }, { label: "Skills", field: profile.skills }].map(({ label, field }) => (
                  <div key={label}>
                    <p className="section-label">{label}</p>
                    <p style={{ fontFamily: "Source Sans 3", lineHeight: 1.7, color: "#444" }}>{renderTagFieldPreview(field)}</p>
                  </div>
                ))}
                <div>
                  <p className="section-label">Arbeitsmodell</p>
                  <p style={{ fontFamily: "Source Sans 3", lineHeight: 1.7, color: "#444" }}>{profile.work_model || "Noch nichts eingetragen."}</p>
                </div>
                <div>
                  <p className="section-label">Aktuell</p>
                  <p style={{ fontFamily: "Source Sans 3", lineHeight: 1.7, color: "#444" }}>{profile.looking_for_work ? "Sucht aktuell aktiv" : "Sucht aktuell nicht aktiv"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>

  );
}
export default MainApp;