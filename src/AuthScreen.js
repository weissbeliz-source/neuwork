import { useState } from "react";
import { supabase } from "./supabase";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Fehler: " + error.message);
    } else if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Fehler: " + error.message);
      else setMessage("✓ Bestätigungsmail gesendet! Bitte E-Mail prüfen.");
    } else if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profil`,
      });
      if (error) setMessage("Fehler: " + error.message);
      else setMessage("✓ Link zum Zurücksetzen wurde gesendet!");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: 3px solid #A855F7; outline-offset: 2px; }
        .auth-btn { transition: all 0.15s; }
        .auth-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(0); }
        .link-btn { background: none; border: none; cursor: pointer; text-decoration: underline; }
        .link-btn:hover { opacity: 0.7; }
      `}</style>

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoMark}>
            <div style={s.logoCircle1} />
            <div style={s.logoCircle2} />
          </div>
          <div>
            <p style={s.logoName}>Diffusion</p>
            <p style={s.logoSub}>Different.Inclusion</p>
          </div>
        </div>

        <h1 style={s.title}>
          {mode === "login" && "Willkommen zurück"}
          {mode === "register" && "Konto erstellen"}
          {mode === "reset" && "Passwort zurücksetzen"}
        </h1>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div style={s.field}>
            <label htmlFor="email" style={s.label}>E-Mail</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              style={s.input}
            />
          </div>

          {mode !== "reset" && (
            <div style={s.field}>
              <label htmlFor="password" style={s.label}>Passwort</label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                required
                minLength={8}
                style={s.input}
              />
            </div>
          )}

          {message && (
            <div style={{ ...s.message, background: message.includes("✓") ? "#14532d22" : "#7f1d1d22", borderColor: message.includes("✓") ? "#4ade80" : "#f87171", color: message.includes("✓") ? "#4ade80" : "#f87171" }}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-btn" style={s.submitBtn}>
            {loading ? "..." : mode === "login" ? "Anmelden" : mode === "register" ? "Registrieren" : "Link senden"}
          </button>
        </form>

        <div style={s.links}>
          {mode === "login" && <>
            <button className="link-btn" onClick={() => setMode("register")} style={s.linkText}>Noch kein Konto? Registrieren</button>
            <button className="link-btn" onClick={() => setMode("reset")} style={{ ...s.linkText, fontSize: 12, color: "#888" }}>Passwort vergessen?</button>
          </>}
          {mode === "register" && <button className="link-btn" onClick={() => setMode("login")} style={s.linkText}>Bereits registriert? Anmelden</button>}
          {mode === "reset" && <button className="link-btn" onClick={() => setMode("login")} style={s.linkText}>← Zurück zum Login</button>}
        </div>
      </div>

      <p style={s.impressum}>
        <a href="/impressum" style={{ color: "#555", fontSize: 12 }}>Impressum & Datenschutz</a>
      </p>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#0A0A0A",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Grotesk', sans-serif",
    padding: "24px",
  },
  card: {
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
  },
  logo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 },
  logoMark: { position: "relative", width: 40, height: 40 },
  logoCircle1: { position: "absolute", top: 0, left: 0, width: 28, height: 28, borderRadius: "50%", background: "#A855F7" },
  logoCircle2: { position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#4ade80", opacity: 0.85 },
  logoName: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: "#555", letterSpacing: "0.05em" },
  title: { fontSize: 22, fontWeight: 700, color: "white", marginBottom: 28, letterSpacing: "-0.5px" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#aaa", marginBottom: 6 },
  input: {
    width: "100%", padding: "12px 14px", background: "#1e1e1e",
    border: "1.5px solid #333", borderRadius: 10, color: "white",
    fontSize: 15, fontFamily: "'Space Grotesk', sans-serif",
  },
  message: { padding: "10px 14px", borderRadius: 8, border: "1px solid", fontSize: 13, marginBottom: 16, lineHeight: 1.5 },
  submitBtn: {
    width: "100%", padding: "13px", background: "#A855F7",
    border: "none", borderRadius: 10, color: "white",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20,
  },
  links: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },
  linkText: { fontSize: 13, color: "#A855F7", fontFamily: "'Space Grotesk', sans-serif" },
  impressum: { marginTop: 24 },
};
