import { useState } from "react";
import { FOERDERUNGEN } from "./constants";

export default function FoerderInfo({ profile }) {
  const [showEmployerDoc, setShowEmployerDoc] = useState(false);

  const hasDisabilityId = profile?.has_disability_id;
  const degree = profile?.disability_degree || "";
  const needs = profile?.needs?.tags || [];
  const assistiveTech = profile?.assistive_tech?.tags || [];

  // Ermittle relevante Förderungen basierend auf Profil
  const getRelevantFoerderungen = () => {
    return FOERDERUNGEN.filter(f => {
      if (f.relevant_for.includes("alle")) return true;
      if (!hasDisabilityId && f.id === "arbeitsassistenz") return false;
      if (!hasDisabilityId && f.id === "beschaeftigungssicherungszuschuss") return false;
      if (!hasDisabilityId && f.id === "budget_fuer_arbeit") return false;

      const hasNeurodivergenzNeed = needs.some(n =>
        ["Masking-freie Kultur", "Reizarme Umgebung", "Keine Kamera-Pflicht",
          "Ununterbrochene Fokuszeit", "Wenig Kontextwechsel", "Feste Routinen",
          "Visuelle Planungs-Tools", "Psychologische Sicherheit"].includes(n)
      );
      const hasMobilityNeed = needs.some(n =>
        ["Barrierefreier Eingang", "Rollstuhlgerechter Arbeitsplatz", "Aufzug", "Rampe"].includes(n)
      );
      const hasSensoryNeed = needs.some(n =>
        ["Gebärdensprachdolmetschung", "Untertitel / Captions", "Screenreader-kompatible Tools",
          "Große Schrift", "Blendfreies Licht"].includes(n)
      ) || assistiveTech.some(t =>
        ["Screenreader (z.B. NVDA, JAWS)", "Hörhilfe / Cochlea-Implantat",
          "Gebärdensprachdolmetscher:in"].includes(t)
      );
      const hasPsychNeed = needs.some(n =>
        ["Flexible Pausen", "Pacing / Energiemanagement", "Flexible Zeiten",
          "Späterer Arbeitsbeginn", "Arbeiten von zuhause bei Schub / Erschöpfung"].includes(n)
      );

      if (f.relevant_for.includes("neurodivergenz") && hasNeurodivergenzNeed) return true;
      if (f.relevant_for.includes("koerper") && hasMobilityNeed) return true;
      if (f.relevant_for.includes("sinnes") && hasSensoryNeed) return true;
      if (f.relevant_for.includes("psychisch") && hasPsychNeed) return true;
      return false;
    });
  };

  const relevant = getRelevantFoerderungen();

  const labelStyle = { fontFamily: "Source Sans 3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#888", display: "block", marginBottom: 6 };
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2DBD0", fontFamily: "Source Sans 3", fontSize: 14, background: "#F8F4ED", outline: "none", boxSizing: "border-box" };

  if (showEmployerDoc) {
    return <EmployerDoc profile={profile} foerderungen={relevant} onBack={() => setShowEmployerDoc(false)} />;
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        Fördercheck
      </h2>
      <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>
        Hier siehst du welche Förderungen für dich und deinen zukünftigen Arbeitgeber relevant sein könnten.
        Diese Infos sind nur für dich sichtbar — nicht im öffentlichen Profil.
      </p>

      {/* Disability ID */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          Schwerbehindertenausweis
        </h3>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Source Sans 3", fontSize: 14, color: "#444", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={hasDisabilityId}
              readOnly
            />
            Ich habe einen Schwerbehindertenausweis oder habe einen beantragt
          </label>
          {hasDisabilityId && degree && (
            <div>
              <label style={labelStyle}>Grad der Behinderung (GdB)</label>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#444" }}>{degree}</p>
            </div>
          )}
          {!hasDisabilityId && (
            <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 10, padding: "12px 16px" }}>
              <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#795548", lineHeight: 1.6 }}>
                <strong>Tipp:</strong> Auch ohne Schwerbehindertenausweis können Nachteilsausgleiche beantragt werden — z.B. bei ADHS, Autismus oder chronischen Erkrankungen. Ab GdB 30 besteht ein Rechtsanspruch.
                <br />
                <a href="https://www.eutb.de" target="_blank" rel="noreferrer" style={{ color: "#5C6BC0", marginTop: 4, display: "inline-block" }}>
                  → Kostenlose Beratung bei der EUTB
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Relevante Förderungen */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
          Mögliche Förderungen für dich
        </h3>
        <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#888", marginBottom: 16 }}>
          Basierend auf deinen eingetragenen Bedürfnissen und Hilfsmitteln
        </p>

        {relevant.map(f => (
          <div key={f.id} style={{ borderBottom: "1px solid #F0EBE0", paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <h4 style={{ fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 600, color: "#2C2C2C" }}>{f.name}</h4>
              <span style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", background: "#F5F0E8", padding: "2px 8px", borderRadius: 12, flexShrink: 0, marginLeft: 8 }}>
                {f.wer_beantragt}
              </span>
            </div>
            <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#444", marginBottom: 4, lineHeight: 1.5 }}>{f.beschreibung}</p>
            <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#7C9E87", fontWeight: 600 }}>💰 {f.hoehe}</p>
            {f.hinweis && (
              <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#D4956A", marginTop: 4, fontWeight: 500 }}>
                ⚠️ {f.hinweis}
              </p>
            )}
            <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginTop: 4 }}>
              Behörde: {f.behoerde}
            </p>
          </div>
        ))}

        <div style={{ background: "#EEF7F1", borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2D7A4F", lineHeight: 1.6 }}>
            <strong>Empfehlung:</strong> Lass dich zuerst kostenlos bei der EUTB beraten — die helfen dir herauszufinden welche Förderungen für dich zutreffen und bei welcher Behörde du anfragen solltest.
            <br />
            <a href="https://www.eutb.de" target="_blank" rel="noreferrer" style={{ color: "#2D7A4F", fontWeight: 600 }}>
              → eutb.de
            </a>
          </p>
        </div>
      </div>

      {/* Dokument generieren */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          Förderinfo für Arbeitgeber generieren
        </h3>
        <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>
          Du kannst optional ein separates Dokument erstellen, das deinem zukünftigen Arbeitgeber zeigt,
          welche Förderungen er für deine Einstellung beantragen kann. Du entscheidest selbst ob du es mitschickst.
        </p>
        <button
          onClick={() => setShowEmployerDoc(true)}
          style={{ background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "12px 24px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 500 }}
        >
          Förderinfo-Dokument ansehen →
        </button>
      </div>
    </div>
  );
}

// Arbeitgeber-Dokument
function EmployerDoc({ profile, foerderungen, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{ background: "transparent", border: "1.5px solid #ddd", borderRadius: 20, padding: "8px 16px", cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 13, color: "#666", marginBottom: 24 }}>
        ← Zurück
      </button>

      <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ borderBottom: "2px solid #2C2C2C", paddingBottom: 16, marginBottom: 24 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 4 }}>Förderinformation</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>
            Mögliche Förderungen bei Einstellung von {profile?.full_name || "dieser Person"}
          </h2>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#666", marginTop: 8, lineHeight: 1.6 }}>
            Dieses Dokument gibt einen Überblick über finanzielle Förderungen und Unterstützungsleistungen,
            die bei einer Einstellung beantragt werden können. Alle Angaben sind unverbindlich —
            die konkrete Förderhöhe hängt vom Einzelfall ab.
          </p>
        </div>

        {foerderungen.filter(f => f.wer_beantragt === "Arbeitgeber" || f.wer_beantragt === "Arbeitgeber oder Person").map(f => (
          <div key={f.id} style={{ borderBottom: "1px solid #F0EBE0", paddingBottom: 20, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{f.name}</h3>
            <p style={{ fontFamily: "Source Sans 3", fontSize: 14, color: "#444", marginBottom: 8, lineHeight: 1.6 }}>{f.beschreibung}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 2 }}>Förderung</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{f.hoehe}</p>
              </div>
              <div>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 2 }}>Dauer</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{f.dauer}</p>
              </div>
              <div>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 2 }}>Zuständige Behörde</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2C2C2C" }}>{f.behoerde}</p>
              </div>
              <div>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#888", marginBottom: 2 }}>Antrag durch</p>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2C2C2C" }}>{f.wer_beantragt}</p>
              </div>
            </div>
            {f.hinweis && (
              <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 8, padding: "8px 12px", marginTop: 10 }}>
                <p style={{ fontFamily: "Source Sans 3", fontSize: 12, color: "#795548" }}>⚠️ {f.hinweis}</p>
              </div>
            )}
          </div>
        ))}

        <div style={{ background: "#F5F0E8", borderRadius: 12, padding: 16, marginTop: 8 }}>
          <p style={{ fontFamily: "Source Sans 3", fontSize: 13, color: "#2C2C2C", lineHeight: 1.6 }}>
            <strong>Beratung & weitere Infos:</strong><br />
            Integrationsamt: <a href="https://www.integrationsaemter.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>integrationsaemter.de</a><br />
            Agentur für Arbeit: <a href="https://www.arbeitsagentur.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>arbeitsagentur.de</a><br />
            EUTB (kostenlose Beratung): <a href="https://www.eutb.de" target="_blank" rel="noreferrer" style={{ color: "#8B7EC8" }}>eutb.de</a>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => window.print()} style={{ background: "#2C2C2C", color: "#F5F0E8", border: "none", padding: "12px 28px", borderRadius: 24, cursor: "pointer", fontFamily: "Source Sans 3", fontSize: 14, fontWeight: 500 }}>
            Als PDF drucken / speichern
          </button>
        </div>
      </div>
    </div>
  );
}
