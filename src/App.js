import PublicProfile from "./PublicProfile";
import MainApp from "./MainApp";

export default function App() {
  const path = window.location.pathname;
  const publicMatch = path.match(/^\/profil\/(.+)$/);
  if (publicMatch) return <PublicProfile userId={publicMatch[1]} />;
  return <MainApp />;
}
