import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Menu, X, Search, Home, Mail, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // État qui stocke si l'utilisateur est connecté (true/false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Au chargement, on appelle l'API /api/session pour vérifier la connexion
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/session", {
          credentials: "include", // Envoie les cookies de session
        });
        setIsLoggedIn(response.ok); // 200 = connecté, 401 = pas connecté
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [location.pathname]); // Re-vérifie quand la page change

  // Quand on clique sur "Mon compte"
  const handleAccountClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isLoggedIn) {
      navigate("/profile"); // Connecté → page profil
    } else {
      navigate("/login"); // Pas connecté → page login
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <CalendarDaysIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Book By Click
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Home className="w-4 h-4" />
              Accueil
            </Link>
            <Link to="/result" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Search className="w-4 h-4" />
              Recherche
            </Link>
            <Link to="/contact" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Mail className="w-4 h-4" />
              Contact
            </Link>
            <Link to="/dashboard_entreprise" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* Bouton Mon compte Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <User className="w-4 h-4" />
              <span className="hidden lg:inline">Mon compte</span>
            </button>
          </div>

          {/* Menu Hamburger Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Home className="w-5 h-5" />
              Accueil
            </Link>
            <Link to="/result" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Search className="w-5 h-5" />
              Recherche
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Mail className="w-5 h-5" />
              Contact
            </Link>
            <Link to="/dashboard_entreprise" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleAccountClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-indigo-600 text-white"
            >
              <User className="w-5 h-5" />
              Mon compte
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
