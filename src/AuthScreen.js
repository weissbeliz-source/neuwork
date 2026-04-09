import { useState } from "react";
import { supabase } from "./supabase";

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Fehler: " + error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Fehler: " + error.message);
      else setMessage("✓ Bestätigungs-E-Mail gesendet. Bitte prüfe dein Postfach.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 24, padding: 40, width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: "#2C2C2C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#F5F0E8", fontSize: 16 }}>∞</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22 }}>mole</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{mode === "login" ? "Willkommen zurück" : "Jetzt registrieren"}</h2>
        <p style={{ fontFamily: "Source Sans 3", color: "#888", fontSize: 14, marginBottom: 28 }}>Inklusiv. Für uns. Ab sofort.</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 }}>E-Mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.de" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F5F0E8", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "Source Sans 3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 }}>Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F5F0E8", outline: "none", boxSizing: "border-box" }} />
        </div>
        {message && <div style={{ padding: "12px 16px", borderRadius: 12, background: message.includes("Fehler") ? "#FEE2E2" : "#EEF7F1", color: message.includes("Fehler") ? "#DC2626" : "#2D7A4F", fontFamily: "Source Sans 3", fontSize: 13, marginBottom: 16 }}>{message}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "14px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
          {loading ? "..." : mode === "login" ? "Einloggen" : "Registrieren"}
        </button>
        <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", textAlign: "center" }}>
          {mode === "login" ? "Noch kein Account? " : "Schon dabei? "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: "#8B7EC8", cursor: "pointer", fontWeight: 500 }}>{mode === "login" ? "Registrieren" : "Einloggen"}</span>
        </p>
      </div>
    </div>
  );
}
export default AuthScreen;
