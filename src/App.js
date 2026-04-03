import { useState } from "react";

const NAV_ITEMS = ["Entdecken", "Jobs", "Firmen", "Community", "Profil"];

const JOBS = [
  {
    id: 1,
    title: "UX Researcher",
    company: "Klara GmbH",
    tags: ["Remote", "Flexible Zeiten", "Ruhiges Büro", "Kein Open Space"],
    type: "Vollzeit",
    color: "#7C9E87",
    match: 94,
    desc: "Wir suchen jemanden, der mit echtem Einfühlungsvermögen Nutzerbedürfnisse erforscht. Kein Daily-Standup-Zwang, async-first."
  },
  {
    id: 2,
    title: "Backend Entwickler:in",
    company: "Softalpha",
    tags: ["Hybrid", "Masking-frei", "ADHS-freundlich", "Ruhezonen"],
    type: "Teilzeit möglich",
    color: "#8B7EC8",
    match: 87,
    desc: "Python/Django. Wir kommunizieren schriftlich, Meetings nur wenn nötig. Du darfst Kopfhörer tragen, dich bewegen, deinen Rhythmus leben."
  },
  {
    id: 3,
    title: "Grafikdesign & Illustration",
    company: "Bunte Welt Verlag",
    tags: ["Vollständig Remote", "Async", "Flexible Deadlines", "Keine Kamera-Pflicht"],
    type: "Freelance",
    color: "#D4956A",
    match: 81,
    desc: "Kinderbuchillustrationen und Marketingmaterial. Wir respektieren deine Energie und arbeiten mit klaren, schriftlichen Briefings."
  },
  {
    id: 4,
    title: "Data Analyst:in",
    company: "GreenStats AG",
    tags: ["Remote", "Einzelbüro möglich", "Reizarme Umgebung"],
    type: "Vollzeit",
    color: "#5B9BAD",
    match: 76,
    desc: "Nachhaltigkeitsdaten analysieren und visualisieren. Kleine Team, flache Hierarchie, du bekommst klare Aufgaben mit Kontext."
  }
];

const COMPANIES = [
  {
    id: 1,
    name: "Klara GmbH",
    sector: "UX & Design",
    badge: "Zertifiziert inklusiv",
    checks: ["Neurodivergenz-Awareness-Training", "Flexible Arbeitszeiten", "Ruhezonen im Büro", "Async-First Kommunikation", "Individuelle Onboarding-Pläne"],
    employees: "45–60",
    color: "#7C9E87"
  },
  {
    id: 2,
    name: "Softalpha",
    sector: "Software & IT",
    badge: "ADHS-freundlich",
    checks: ["Kein Masking erwartet", "Kopfhörer-freundlich", "Schriftliche Kommunikation bevorzugt", "Reizarme Meetingräume"],
    employees: "20–35",
    color: "#8B7EC8"
  },
  {
    id: 3,
    name: "auticon Deutschland",
    sector: "IT-Consulting",
    badge: "Spezialisiert auf Autismus",
    checks: ["Von Autisten gegründet", "100% neurodivergente Mitarbeitende", "Job-Coaches inklusive", "Individuelle Begleitung"],
    employees: "200+",
    color: "#5B9BAD"
  }
];
const WAITLIST_URL = "https://2dc38334.sibforms.com/serve/MUIFAPKpOnstY_-htfpGf8fSuN_3L6kSak_nq5bhpByLgceCY8Y4ELFy6yuneqI_G573gDtR1KAmb5Fkk7WHrhGXc3Ymc91KV9F95wvezX667FuUj-Q0XPJKutk5kc11IMYiH8umCTSuum50v4T5evlteY7oFAwPo05t1ZzxiUOtcTggYVSF4FtdLP1TZBYHjqLXC8vnMXFOX0hNlA==";
const PROFILE = {
  name: "Maya Berger",
  pronouns: "sie/ihr",
  tagline: "UX Designerin mit Blick fürs Detail · Autistisch · Systemdenkerin",
  strengths: ["Deep Focus", "Mustererkennung", "Detailgenauigkeit", "Ehrliche Kommunikation", "Kreative Problemlösung"],
  workstyle: {
    "Kommunikation": "Schriftlich bevorzugt, klare Strukturen",
    "Umgebung": "Ruhig, reizarm, keine Großraumbüros",
    "Meetings": "Wenige, mit Agenda im Voraus",
    "Energie": "Morgens fokussiert, Pausen sind wichtig",
  },
  needs: ["Klare Erwartungen", "Kein spontanes Anrufen", "Feedback schriftlich", "Flexible Pausenzeiten"],
  skills: ["Figma", "User Research", "Barrierefreiheit", "Prototyping", "Accessibility Audits"],
  openTo: "Remote & Hybrid in Berlin"
};

export default function App() {
  const [activeNav, setActiveNav] = useState("Entdecken");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  };

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#F5F0E8",
      minHeight: "100vh",
      color: "#2C2C2C"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0E8; }
        .nav-item { cursor: pointer; padding: 8px 16px; border-radius: 20px; transition: all 0.2s; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.3px; }
        .nav-item:hover { background: rgba(0,0,0,0.07); }
        .nav-item.active { background: #2C2C2C; color: #F5F0E8; }
        .job-card { background: white; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.25s; border: 2px solid transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .job-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .job-card.selected { border-color: #2C2C2C; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-family: 'Source Sans 3', sans-serif; font-weight: 500; background: #F5F0E8; color: #555; margin: 3px 3px 3px 0; }
        .btn-primary { background: #2C2C2C; color: #F5F0E8; border: none; padding: 12px 24px; border-radius: 24px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; letter-spacing: 0.3px; }
        .btn-primary:hover { background: #444; transform: translateY(-1px); }
        .btn-outline { background: transparent; color: #2C2C2C; border: 2px solid #2C2C2C; padding: 10px 22px; border-radius: 24px; cursor: pointer; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .btn-outline:hover { background: #2C2C2C; color: #F5F0E8; }
        .company-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.2s; }
        .company-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .strength-pill { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-family: 'Source Sans 3', sans-serif; margin: 4px; background: #EEE8DC; color: #2C2C2C; }
        .section-label { font-family: 'Source Sans 3', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 12px; }
        .match-badge { display: inline-flex; align-items: center; gap: 4px; background: #EEF7F1; color: #2D7A4F; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-family: 'Source Sans 3', sans-serif; font-weight: 600; }
        input, select { font-family: 'Source Sans 3', sans-serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#F5F0E8", borderBottom: "1px solid #E2DBD0", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#2C2C2C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#F5F0E8", fontSize: 14, fontFamily: "Georgia" }}>∞</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>neuwork</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button key={item} className={`nav-item${activeNav === item ? " active" : ""}`} onClick={() => { setActiveNav(item); setSelectedJob(null); }}>
                {item}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#8B7EC8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 600, fontFamily: "Source Sans 3" }}>MB</span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* ENTDECKEN */}
        {activeNav === "Entdecken" && (
          <div> <div style={{background:"white", borderRadius:20, padding:32, marginBottom:40, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", textAlign:"center"}}>
          <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:24, marginBottom:8}}>Jetzt vormerken lassen</h2>
          <p style={{fontFamily:"Source Sans 3", color:"#888", marginBottom:20}}>Sei dabei wenn neuwork startet!</p>
          <iframe src={WAITLIST_URL} width="100%" height="305" frameBorder="0" scrolling="auto" style={{maxWidth:540, display:"block", margin:"0 auto"}}></iframe>
        </div>
            <div style={{ marginBottom: 48, maxWidth: 600 }}>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>Willkommen zurück, Maya</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
                Arbeit, die zu<br />
                <em style={{ fontStyle: "italic", color: "#8B7EC8" }}>dir</em> passt.
              </h1>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 480 }}>
                Ein Netzwerk ohne Masking-Zwang. Firmen, die neurodivergente Stärken wirklich schätzen – nicht nur tolerieren.
              </p>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
              {[
                { n: "247", label: "Inklusive Firmen", color: "#7C9E87" },
                { n: "1.840", label: "Offene Stellen", color: "#8B7EC8" },
                { n: "12.500+", label: "Mitglieder", color: "#D4956A" }
              ].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.n}</div>
                  <div style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#888" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Featured Jobs */}
            <div style={{ marginBottom: 16 }}>
              <p className="section-label">Passend für dich</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {JOBS.slice(0, 2).map(job => (
                <div key={job.id} className="job-card" onClick={() => { setActiveNav("Jobs"); setSelectedJob(job); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: job.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: job.color }} />
                    </div>
                    <span className="match-badge">✓ {job.match}% Match</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{job.title}</h3>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", marginBottom: 12 }}>{job.company} · {job.type}</p>
                  <div>{job.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button className="btn-outline" onClick={() => setActiveNav("Jobs")}>Alle Jobs ansehen →</button>
            </div>
          </div>
        )}

        {/* JOBS */}
        {activeNav === "Jobs" && (
          <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr 1.2fr" : "1fr", gap: 28 }}>
            <div>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Offene Stellen</h2>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#888" }}>Gefiltert nach deinen Bedürfnissen</p>
              </div>

              {/* Filter Tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {["Remote", "Async", "ADHS-freundlich", "Ruhige Umgebung", "Teilzeit"].map(f => (
                  <span key={f} style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid #ddd", fontSize: 13, fontFamily: "Source Sans 3", cursor: "pointer", background: "white", color: "#555" }}>{f}</span>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {JOBS.map(job => (
                  <div key={job.id} className={`job-card${selectedJob?.id === job.id ? " selected" : ""}`} onClick={() => setSelectedJob(job)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: job.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: job.color }} />
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, marginBottom: 2 }}>{job.title}</h3>
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
                    <div style={{ marginTop: 12 }}>
                      {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Detail */}
            {selectedJob && (
              <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", height: "fit-content", position: "sticky", top: 84 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: selectedJob.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: selectedJob.color }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>{selectedJob.title}</h2>
                    <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 14 }}>{selectedJob.company} · {selectedJob.type}</p>
                  </div>
                </div>

                <p style={{ fontFamily: "Source Sans 3", fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 24 }}>{selectedJob.desc}</p>

                <div style={{ marginBottom: 24 }}>
                  <p className="section-label">Inklusive Arbeitsbedingungen</p>
                  {selectedJob.tags.map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedJob.color }} />
                      <span style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#333" }}>{t}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1 }}>Jetzt bewerben</button>
                  <button onClick={() => toggleSave(selectedJob.id)} style={{ background: "none", border: "2px solid #ddd", borderRadius: 24, padding: "10px 16px", cursor: "pointer", fontSize: 18, color: savedJobs.includes(selectedJob.id) ? "#D4956A" : "#aaa", transition: "all 0.2s" }}>
                    {savedJobs.includes(selectedJob.id) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIRMEN */}
        {activeNav === "Firmen" && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Inklusive Firmen</h2>
              <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15 }}>Geprüfte Arbeitgeber, die neurodivergente Menschen wirklich willkommen heißen</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {COMPANIES.map(c => (
                <div key={c.id} className="company-card">
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: c.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600 }}>{c.name}</h3>
                      <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888" }}>{c.sector}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <span style={{ background: c.color + "22", color: c.color, padding: "4px 12px", borderRadius: 12, fontSize: 12, fontFamily: "Source Sans 3", fontWeight: 600 }}>
                      ✓ {c.badge}
                    </span>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <p className="section-label">Was diese Firma bietet</p>
                    {c.checks.map(check => (
                      <div key={check} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                        <span style={{ color: c.color, fontSize: 14, marginTop: 1 }}>✓</span>
                        <span style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#555", lineHeight: 1.4 }}>{check}</span>
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

            <div style={{ marginTop: 40, background: "white", borderRadius: 20, padding: 32, textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ihr seid eine inklusive Firma?</h3>
              <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15, marginBottom: 20 }}>Werdet Teil unseres geprüften Netzwerks und findet neurodivergente Talente.</p>
              <button className="btn-primary">Firma registrieren</button>
            </div>
          </div>
        )}

        {/* COMMUNITY */}
        {activeNav === "Community" && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Community</h2>
              <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 15 }}>Austausch ohne Druck. Schreibe wenn du magst, lies wann du willst.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { title: "ADHS & Beruf", desc: "Tipps, Strategien und Solidarität für den Arbeitsalltag mit ADHS", members: 2847, color: "#8B7EC8", posts: 142 },
                { title: "Autismus & Karriere", desc: "Erfahrungen teilen, Fragen stellen, Netzwerk aufbauen", members: 1923, color: "#7C9E87", posts: 98 },
                { title: "Bewerbungsgesprächs-Hilfe", desc: "Gemeinsam üben, Fragen klären, Nerven beruhigen", members: 1456, color: "#D4956A", posts: 76 },
                { title: "Arbeitsrechte & Nachteilsausgleich", desc: "Rechtliche Infos, Erfahrungen mit Arbeitgebern", members: 987, color: "#5B9BAD", posts: 54 },
                { title: "Erfolgsgeschichten", desc: "Inspirierende Jobs und Momente teilen", members: 3102, color: "#C4A86E", posts: 203 },
                { title: "Remote Work", desc: "Tipps für produktives, neurodiv-freundliches Homeoffice", members: 2210, color: "#A07890", posts: 119 }
              ].map(group => (
                <div key={group.title} className="company-card" style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: group.color + "22", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: group.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{group.title}</h3>
                      <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 12 }}>{group.desc}</p>
                      <div style={{ display: "flex", gap: 16 }}>
                        <span style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#aaa" }}>👥 {group.members.toLocaleString()} Mitglieder</span>
                        <span style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#aaa" }}>💬 {group.posts} Posts</span>
                      </div>
                    </div>
                    <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0 }}>Beitreten</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFIL */}
        {activeNav === "Profil" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ background: "white", borderRadius: 20, padding: 32, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#8B7EC8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontSize: 26, fontWeight: 600, fontFamily: "Source Sans 3" }}>MB</span>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>{PROFILE.name}</h2>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#aaa", marginBottom: 6 }}>{PROFILE.pronouns}</p>
                  <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#555", lineHeight: 1.5 }}>{PROFILE.tagline}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary">Profil bearbeiten</button>
                <button className="btn-outline">Teilen</button>
              </div>
            </div>

            {/* Stärken */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p className="section-label">Meine Stärken</p>
              <div>{PROFILE.strengths.map(s => <span key={s} className="strength-pill">{s}</span>)}</div>
            </div>

            {/* Arbeitsweise */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p className="section-label">Wie ich arbeite</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {Object.entries(PROFILE.workstyle).map(([key, val]) => (
                  <div key={key} style={{ background: "#F5F0E8", borderRadius: 12, padding: "16px 18px" }}>
                    <p style={{ fontFamily: "Source Sans 3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 4 }}>{key}</p>
                    <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#333" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bedürfnisse */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p className="section-label">Was ich brauche</p>
              <div>{PROFILE.needs.map(n => (
                <div key={n} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B7EC8", flexShrink: 0 }} />
                  <span style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#444" }}>{n}</span>
                </div>
              ))}</div>
            </div>

            {/* Skills */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p className="section-label">Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROFILE.skills.map(s => (
                  <span key={s} style={{ padding: "6px 16px", borderRadius: 20, background: "#2C2C2C", color: "#F5F0E8", fontFamily: "Source Sans 3", fontSize: 13 }}>{s}</span>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "14px 18px", background: "#EEF7F1", borderRadius: 12 }}>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2D7A4F" }}>✓ Offen für: <strong>{PROFILE.openTo}</strong></p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
