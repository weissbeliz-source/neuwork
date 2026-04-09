import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import MainApp from "./MainApp";
import PublicProfile from "./PublicProfile";
import AuthScreen from "./AuthScreen";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prüft ob die URL ein öffentliches Profil ist: /profil/USER-ID
  const path = window.location.pathname;
  const profileMatch = path.match(/^\/profil\/([a-f0-9-]+)$/i);
  const publicUserId = profileMatch ? profileMatch[1] : null;

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

  // Öffentliches Profil — kein Login nötig
  if (publicUserId) {
    return <PublicProfile userId={publicUserId} />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        lädt…
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <MainApp />;
}

export default App;