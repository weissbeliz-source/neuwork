import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import { NAV_ITEMS, JOBS } from "./constants";
import { renderTagFieldPreview } from "./profileUtils";

import AuthScreen from "./AuthScreen";
import useProfile from "./useProfile";

export default function MainApp() {
  // =========================
  // AUTH / SESSION
  // =========================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => subscription.unsubscribe();
  }, []);

  // =========================
  // NAVIGATION
  // =========================
  const [activeNav, setActiveNav] = useState("Entdecken");

  // =========================
  // PROFIL – HOOK
  // =========================
  const {
    profile,
    setProfile,
    profileLoading,
    saveMessage,
    avatarUploading,
    copyMessage,
    fileInputRef,
    saveProfile,
    uploadAvatar,
    deleteProfile,
    copyProfileLink
  } = useProfile(user);

  // =========================
  // JOBS
  // =========================
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSave = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id)
        ? prev.filter((j) => j !== id)
        : [...prev, id]
    );
  };

  // =========================
  // RENDER – STATES
  // =========================
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        mole lädt…
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  // =========================
  // RENDER – APP UI
  // =========================
  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Source Sans 3" }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid #E2DBD0", background: "#F5F0E8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontFamily: "Playfair Display", fontSize: 22 }}>mole</strong>
          <nav style={{ display: "flex", gap: 8 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  setSelectedJob(null);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  background: activeNav === item ? "#2C2C2C" : "transparent",
                  color: activeNav === item ? "#F5F0E8" : "#2C2C2C"
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* PROFIL */}
        {activeNav === "Profil" && (
          <div style={{ maxWidth: 760, margin: "0 auto", background: "white", padding: 32, borderRadius: 20 }}>
            <h2 style={{ fontFamily: "Playfair Display", fontSize: 24 }}>
              {profile.full_name || user.email}
            </h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              {profile.headline}
            </p>

            <button onClick={copyProfileLink}>
