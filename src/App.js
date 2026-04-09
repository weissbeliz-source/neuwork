import PublicProfile from "./PublicProfile";
import MainApp from "./MainApp";
import Impressum from "./Impressum";

export default function App() {
  const path = window.location.pathname;

  if (path === "/impressum") return <Impressum />;
  if (path.match(/^\/profil\/(.+)$/)) {
    const userId = path.match(/^\/profil\/(.+)$/)[1];
    return <PublicProfile userId={userId} isPublic={true} />;
  }

  return <MainApp />;
}
