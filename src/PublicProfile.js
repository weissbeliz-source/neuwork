import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { parseStoredField } from "./profileUtils";

export default function PublicProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        setProfile({
          ...data,
          strengths: parseStoredField(data.strengths),
          strengths_professional: parseStoredField(data.strengths_professional),
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
    <div style={s.centered} role="status" aria-live="polite">
      <p style={s.loadingText}>Profil wird geladen…</p>
    </div>
  );

  if (!profile) return (
    <div style={s.centered} role="alert">
      <p style={s.loadingText}>Profil nicht gefunden.</p>
      <a href="/" style={s.link}>← Zurück zu mole</a>
    </div>
  );

  const initials = profile.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const allNeeds = [...(profile.needs?.tags || []), profile.needs?.custom?.trim()].filter(Boolean);
  const allStrengths = [...(profile.strengths?.tags || []), profile.strengths?.custom?.trim()].filter(Boolean);
  const allStrengthsPro = [...(profile.strengths_professional?.tags || []), profile.strengths_professional?.custom?.trim()].filter(Boolean);
  const allSkills = [...(profile.skills?.tags || []), profile.skills?.custom?.trim()].filter(Boolean);
  const allWorkStyle = [...(profile.work_style?.tags || []), profile.work_style?.custom?.trim()].filter(Boolean);
  const allComm = [...(profile.communication_prefs?.tags || []), profile.communication_prefs?.custom?.trim()].filter(Boolean);
  const allTech = [...(profile.assistive_tech?.tags || []), profile.assistive_tech?.custom?.trim()].filter(Boolean);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :focus-visible { outline: 3px solid #1A1A1A; outline-offset: 3px; border-radius: 4px; }
        .skip-link:focus { top: 0 !important; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .card { box-shadow: none !important; border: 1px solid #ccc !important; page-break-inside: avoid; }
        }
        @media (max-width: 600px) {
          .two-col { grid-template-columns: 1fr !important; }
          .hero-inner { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <a href="#main-content" className="skip-link no-print" style={s.skipLink}>
        Zum Hauptinhalt springen
      </a>

      <header style={s.header} className="no-print">
        <div style={s.headerInner}>
          <a href="/" style={s.logoLink} aria-label="mole — zur Startseite">
            <div style={s.logoIcon} aria-hidden="true">∞</div>
            <span style={s.logoText}>mole</span>
          </a>
          <button onClick={() => window.print()} style={s.printBtn} aria-label="Profil drucken oder als PDF speichern">
            Als PDF speichern
          </button>
        </div>
      </header>

      <main id="main-content" style={s.main}>

        {/* Hero */}
        <section aria-label="Profilübersicht" style={{ ...s.card, marginBottom: 16 }} className="card">
          <div style={s.heroInner} className="hero-inner">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={`Profilfoto von ${profile.full_name}`} style={s.avatar} />
            ) : (
              <div style={s.avatarFallback} aria-hidden="true">
                <span style={s.avatarInitials}>{initials}</span>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={s.name}>{profile.full_name || "Anonym"}</h1>
              {profile.headline && <p style={s.headline}>{profile.headline}</p>}
              {profile.bio && <p style={s.bio}>{profile.bio}</p>}
              <div style={s.badges}>
                {profile.looking_for_work && (
                  <span style={s.badgeGreen} role="status">✓ Offen für Stellen</span>
                )}
                {profile.work_model && (
                  <span style={s.badgeGray}>📍 {profile.work_model}</span>
                )}
                {profile.availability && (
                  <span style={s.badgeGray}>🗓 {profile.availability}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stärken */}
        {(allStrengths.length > 0 || allStrengthsPro.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
            {allStrengths.length > 0 && (
              <section aria-labelledby="strengths-heading" style={s.card} className="card">
                <h2 id="strengths-heading" style={s.sectionHeading}>Persönliche Stärken</h2>
                <div style={s.tagList} role="list">
                  {allStrengths.map(t => <span key={t} style={s.tag} role="listitem">{t}</span>)}
                </div>
              </section>
            )}
            {allStrengthsPro.length > 0 && (
              <section aria-labelledby="strengths-pro-heading" style={s.card} className="card">
                <h2 id="strengths-pro-heading" style={s.sectionHeading}>Fachliche Stärken</h2>
                <div style={s.tagList} role="list">
                  {allStrengthsPro.map(t => <span key={t} style={s.tag} role="listitem">{t}</span>)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Spezialinteressen */}
        {profile.special_interests && (
          <section aria-labelledby="interests-heading" style={{ ...s.card, marginBottom: 16 }} className="card">
            <h2 id="interests-heading" style={s.sectionHeading}>Spezialinteressen & Themen die mich begeistern</h2>
            <p style={s.text}>{profile.special_interests}</p>
          </section>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <section aria-labelledby="skills-heading" style={{ ...s.card, marginBottom: 16 }} className="card">
            <h2 id="skills-heading" style={s.sectionHeading}>Skills</h2>
            <div style={s.tagList} role="list">
              {allSkills.map(t => (
                <span key={t} style={{ ...s.tag, background: "#1A1A1A", color: "#F5F0E8" }} role="listitem">{t}</span>
              ))}
            </div>
          </section>
        )}

        {/* Arbeitsstil + Kommunikation */}
        {(allWorkStyle.length > 0 || allComm.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
            {allWorkStyle.length > 0 && (
              <section aria-labelledby="workstyle-heading" style={s.card} className="card">
                <h2 id="workstyle-heading" style={s.sectionHeading}>Wie ich am liebsten arbeite</h2>
                <div style={s.tagList} role="list">
                  {allWorkStyle.map(t => <span key={t} style={s.tag} role="listitem">{t}</span>)}
                </div>
              </section>
            )}
            {allComm.length > 0 && (
              <section aria-labelledby="comm-heading" style={s.card} className="card">
                <h2 id="comm-heading" style={s.sectionHeading}>Kommunikationspräferenzen</h2>
                <div style={s.tagList} role="list">
                  {allComm.map(t => <span key={t} style={s.tag} role="listitem">{t}</span>)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Bedürfnisse */}
        {allNeeds.length > 0 && (
          <section aria-labelledby="needs-heading" style={{ ...s.card, marginBottom: 16 }} className="card">
            <h2 id="needs-heading" style={s.sectionHeading}>Was ich brauche, um gut arbeiten zu können</h2>
            <p style={{ fontSize: 15, color: "#444", marginBottom: 14, lineHeight: 1.5 }}>
              Diese Rahmenbedingungen helfen mir, mein Bestes zu geben:
            </p>
            <div style={s.tagList} role="list">
              {allNeeds.map(t => (
                <span key={t} style={{ ...s.tag, background: "#E8F0FF", color: "#1A3A8F", border: "1px solid #B8CCF8" }} role="listitem">{t}</span>
              ))}
            </div>
          </section>
        )}

        {/* Hilfsmittel */}
        {allTech.length > 0 && (
          <section aria-labelledby="tech-heading" style={{ ...s.card, marginBottom: 16 }} className="card">
            <h2 id="tech-heading" style={s.sectionHeading}>Ich arbeite effektiv mit</h2>
            <div style={s.tagList} role="list">
              {allTech.map(t => (
                <span key={t} style={{ ...s.tag, background: "#F0F0F0", color: "#333" }} role="listitem">{t}</span>
              ))}
            </div>
          </section>
        )}

        {/* Werdegang */}
        {(profile.experience || profile.education) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
            {profile.experience && (
              <section aria-labelledby="exp-heading" style={s.card} className="card">
                <h2 id="exp-heading" style={s.sectionHeading}>Berufserfahrung</h2>
                <p style={s.text}>{profile.experience}</p>
              </section>
            )}
            {profile.education && (
              <section aria-labelledby="edu-heading" style={s.card} className="card">
                <h2 id="edu-heading" style={s.sectionHeading}>Werdegang</h2>
                <p style={s.text}>{profile.education}</p>
              </section>
            )}
          </div>
        )}

        {/* Sprachen + Kontakt */}
        {(profile.languages || profile.contact_info) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
            {profile.languages && (
              <section aria-labelledby="lang-heading" style={s.card} className="card">
                <h2 id="lang-heading" style={s.sectionHeading}>Sprachen</h2>
                <p style={s.text}>{profile.languages}</p>
              </section>
            )}
            {profile.contact_info && (
              <section aria-labelledby="contact-heading" style={s.card} className="card">
                <h2 id="contact-heading" style={s.sectionHeading}>Kontakt</h2>
                <p style={s.text}>{profile.contact_info}</p>
              </section>
            )}
          </div>
        )}

        <footer style={s.footer} className="no-print">
          <p style={s.footerText}>
            Dieses Profil wurde mit <a href="/" style={s.link}>mole</a> erstellt — inklusives Jobportal
          </p>
        </footer>
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Source Sans 3', sans-serif", color: "#1A1A1A" },
  centered: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#F5F0E8", fontFamily: "'Source Sans 3', sans-serif" },
  loadingText: { fontSize: 18, color: "#1A1A1A" },
  skipLink: { position: "absolute", top: -100, left: 0, background: "#1A1A1A", color: "white", padding: "8px 16px", fontSize: 16, zIndex: 9999, textDecoration: "none" },
  header: { background: "#1A1A1A" },
  headerInner: { maxWidth: 800, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoLink: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoIcon: { width: 36, height: 36, background: "#F5F0E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#1A1A1A", fontWeight: 700 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F5F0E8" },
  printBtn: { background: "#F5F0E8", color: "#1A1A1A", border: "2px solid #F5F0E8", padding: "8px 18px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif" },
  main: { maxWidth: 800, margin: "0 auto", padding: "32px 24px 64px" },
  card: { background: "white", borderRadius: 12, padding: "28px 32px", border: "1.5px solid #D0C8B8" },
  heroInner: { display: "flex", gap: 24, alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #D0C8B8" },
  avatarFallback: { width: 120, height: 120, borderRadius: "50%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarInitials: { color: "white", fontSize: 36, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif" },
  name: { fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#1A1A1A", marginBottom: 6, lineHeight: 1.2 },
  headline: { fontSize: 17, color: "#333", lineHeight: 1.5, marginBottom: 8 },
  bio: { fontSize: 15, color: "#444", lineHeight: 1.65, marginBottom: 12, fontStyle: "italic" },
  badges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badgeGreen: { background: "#D4EDDA", color: "#155724", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid #A3D5AF" },
  badgeGray: { background: "#F0EBE0", color: "#3A3330", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid #C8BFB0" },
  sectionHeading: { fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: 14, fontFamily: "'Source Sans 3', sans-serif" },
  tagList: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: { display: "inline-block", padding: "6px 14px", borderRadius: 6, background: "#F0EBE0", color: "#1A1A1A", fontSize: 14, border: "1px solid #C8BFB0", lineHeight: 1.4 },
  text: { fontSize: 15, color: "#333", lineHeight: 1.7 },
  footer: { marginTop: 48, textAlign: "center" },
  footerText: { fontSize: 14, color: "#666" },
  link: { color: "#1A1A1A", fontWeight: 600 },
};
