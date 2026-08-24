import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Accueil from "./pages/Accueil.jsx";
import Ecouter from "./pages/Ecouter.jsx";
import Decla from "./pages/Decla.jsx";
import Participer from "./pages/Participer/index.jsx";
import APropos from "./pages/APropos.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      <main className={`page ${isHome ? "page--hero" : ""}`} key={location.pathname}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/ecouter" element={<Ecouter />} />
          <Route path="/decla" element={<Decla />} />
          <Route path="/participer" element={<Participer />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/declas" element={<Admin />} />
        </Routes>
        {!isHome && <Footer />}
      </main>
      {!isHome && <BottomNav />}
    </div>
  );
}
