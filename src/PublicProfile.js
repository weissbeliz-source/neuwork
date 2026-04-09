import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { parseStoredField } from "./profileUtils";

export default function PublicProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function loadPublicProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          ...data,
          strengths: parseStoredField(data.strengths),
          work_style: parseStoredField(data.work_style),
          needs: parseStoredField(data.needs),
          skills: parseStoredField(data.skills),
        });
      }

      setLoading(false);
    }

    loadPublicProfile();
  }, [userId]);

  // =========================
  // STATES
  // =========================
  if (loading) {
    return (
      <Centered>
        <p>Profil lädt …</p>
      </Centered>
    );
  }

  if (!profile) {
    return (
      <Centered>
        <p>Profil nicht gefunden.</p>
      </Centered>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <Page>
      <Card>
        <header style={{ marginBottom: 32 }}>
          <h1 style={styles.name}>
            {profile.full_name || "Ohne Namen"}
          </h1>
          <p style={styles.headline}>
            {profile.headline}
          </p>
        </header>

        <Section title="Stärken" field={profile.strengths} />
        <Section title="Arbeitsweise" field={profile.work_style} />
        <Section title="Bedürfnisse" field={profile.needs} />
        <Section title="Skills" field={profile.skills} />

        <Section title="Arbeitsmodell" text={profile.work_model} />
        <Section
          title="Status"
          text={
            profile.looking_for_work
              ? "Sucht aktuell aktiv"
              : "Sucht aktuell nicht aktiv"
          }
        />
      </Card>
    </Page>
  );
}

//
// UI‑HILFEN (reines UX, keine Logik)
//
function Page({ children }) {
  return (
    <div style={styles.page}>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={styles.card}>
      {children}
    </div>
  );
}

function Centered({ children }) {
  return (
    <div style={styles.centered}>
      {children}
    </div>
  );
}

function Section({ title, field, text }) {
  if (!field && !text) return null;

  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      {field && (
        <div style={styles.tagWrap}>
          {(field.tags || []).map((tag) => (
            <span key={tag} style={styles.tag}>
              {tag}
            </span>
          ))}
          {field.custom && (
            <p style={styles.customText}>{field.custom}</p>
          )}
        </div>
      )}

      {text && (
        <p style={styles.text}>{text}</p>
      )}
    </section>
  );
}

//
// STYLES
//
const styles = {
  page: {
    minHeight: "100vh",
    background: "#F5F0E8",
    padding: "60px 16px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 760,
    background: "white",
    borderRadius: 24,
    padding: 40,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F5F0E8",
  },
  name: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  },
  headline: {
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#888",
    marginBottom: 10,
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    padding: "6px 12px",
    borderRadius: 16,
    background: "#F5F0E8",
    fontSize: 13,
  },
  customText: {
    marginTop: 8,
    color: "#444",
  },
  text: {
    color: "#444",
  },
};