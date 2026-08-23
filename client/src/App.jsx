import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Accueil from "./pages/Accueil.jsx";
import Ecouter from "./pages/Ecouter.jsx";
import Decla from "./pages/Decla.jsx";
import Participer from "./pages/Participer/index.jsx";
import APropos from "./pages/APropos.jsx";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      <div className="app__blobs" aria-hidden="true">
        <span className="app__blob app__blob--corail" />
        <span className="app__blob app__blob--violet" />
        <span className="app__blob app__blob--rose" />
      </div>

      <main className={`page ${isHome ? "page--hero" : ""}`} key={location.pathname}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/ecouter" element={<Ecouter />} />
          <Route path="/decla" element={<Decla />} />
          <Route path="/participer" element={<Participer />} />
          <Route path="/a-propos" element={<APropos />} />
        </Routes>
        {!isHome && <Footer />}
      </main>
      {!isHome && <BottomNav />}
    </div>
  );
}
