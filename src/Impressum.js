export default function Impressum() {
  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={s.inner}>
        <a href="/" style={s.back}>← Zurück zu Diffusion</a>

        <h1 style={s.h1}>Impressum & Datenschutz</h1>

        <section style={s.section}>
          <h2 style={s.h2}>Impressum</h2>
          <p style={s.text}>Angaben gemäß § 5 TMG</p>
          <div style={s.box}>
            <p style={s.text}><strong>Name / Organisation:</strong> [BITTE AUSFÜLLEN]</p>
            <p style={s.text}><strong>Adresse:</strong> [BITTE AUSFÜLLEN]</p>
            <p style={s.text}><strong>E-Mail:</strong> [BITTE AUSFÜLLEN]</p>
          </div>
          <p style={{ ...s.text, color: "#f59e0b", marginTop: 12 }}>
            ⚠️ Bitte vollständige Angaben vor dem Launch eintragen. Ein fehlendes Impressum kann mit Bußgeldern geahndet werden.
          </p>
        </section>

        <section style={s.section}>
          <h2 style={s.h2}>Datenschutzerklärung</h2>
          <p style={s.text}>Wir nehmen den Schutz deiner persönlichen Daten ernst.</p>

          <h3 style={s.h3}>Welche Daten wir speichern</h3>
          <p style={s.text}>Bei der Registrierung und Nutzung von Diffusion speichern wir:</p>
          <ul style={s.list}>
            <li>E-Mail-Adresse (für den Login)</li>
            <li>Profildaten die du freiwillig einträgst (Name, Headline, Stärken, Bedürfnisse etc.)</li>
            <li>Profilbild (falls hochgeladen)</li>
            <li>Pinnwand-Beiträge (falls erstellt)</li>
          </ul>

          <h3 style={s.h3}>Wer deine Daten sieht</h3>
          <ul style={s.list}>
            <li>Dein öffentliches Profil ist nur sichtbar wenn du den Link aktiv teilst</li>
            <li>Als Vorbild (Role-Model) sichtbar wenn du das Häkchen aktivierst</li>
            <li>Kontaktdaten (E-Mail, Telefon) werden nie öffentlich angezeigt</li>
            <li>Fördercheck-Daten sind nur für dich sichtbar</li>
          </ul>

          <h3 style={s.h3}>Deine Rechte (DSGVO)</h3>
          <ul style={s.list}>
            <li>Recht auf Auskunft über deine gespeicherten Daten</li>
            <li>Recht auf Löschung (du kannst dein Profil jederzeit löschen)</li>
            <li>Recht auf Datenübertragbarkeit</li>
            <li>Recht auf Widerspruch gegen die Verarbeitung</li>
          </ul>

          <h3 style={s.h3}>Technische Infrastruktur</h3>
          <p style={s.text}>Wir nutzen Supabase (EU-Server) für Datenspeicherung und Authentifizierung sowie Vercel für das Hosting.</p>

          <div style={s.box}>
            <p style={s.text}><strong>Datenschutzbeauftragte:r / Kontakt:</strong> [BITTE AUSFÜLLEN]</p>
          </div>
        </section>

        <section style={s.section}>
          <h2 style={s.h2}>Newsletter</h2>
          <p style={s.text}>Bleib auf dem Laufenden über neue Features, inklusive Arbeitgeber und Community-Updates.</p>
          <a
            href="https://2dc38334.sibforms.com/serve/MUIFAPKpOnstY_-htfpGf8fSuN_3L6kSak_nq5bhpByLgceCY8Y4ELFy6yuneqI_G573gDtR1KAmb5Fkk7WHrhGXc3Ymc91KV9F95wvezX667FuUj-Q0XPJKutk5kc11IMYiH8umCTSuum50v4T5evlteY7oFAwPo05t1ZzxiUOtcTggYVSF4FtdLP1TZBYHjqLXC8vnMXFOX0hNlA=="
            target="_blank"
            rel="noreferrer"
            style={s.newsletterBtn}
          >
            Newsletter abonnieren →
          </a>
        </section>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0A0A0A", fontFamily: "'Space Grotesk', sans-serif", color: "white", padding: "40px 24px" },
  inner: { maxWidth: 720, margin: "0 auto" },
  back: { color: "#A855F7", fontSize: 14, display: "inline-block", marginBottom: 32, textDecoration: "none" },
  h1: { fontSize: 32, fontWeight: 700, marginBottom: 40, letterSpacing: "-1px" },
  h2: { fontSize: 20, fontWeight: 700, color: "#A855F7", marginBottom: 16 },
  h3: { fontSize: 15, fontWeight: 600, color: "#aaa", marginTop: 20, marginBottom: 8 },
  section: { marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid #222" },
  text: { fontSize: 15, color: "#aaa", lineHeight: 1.7, marginBottom: 8 },
  list: { paddingLeft: 20, color: "#aaa", fontSize: 15, lineHeight: 2 },
  box: { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "16px 20px", marginTop: 12 },
  newsletterBtn: { display: "inline-block", marginTop: 16, background: "#A855F7", color: "white", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" },
};
