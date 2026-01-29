import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserAvatarSimple() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // fetch la session après login/logout
  useEffect(() => {
    fetchSession();
  }, []);

  // fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "UT";

  const menuItems = [
    { label: "Mon profil", icon: User },
    { label: "Paramètres", icon: Settings },
    { label: "Aide", icon: HelpCircle },
  ];

  const fetchSession = () => {
    fetch("/api/session", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUser({ name: data.name, email: data.email });
        } else {
          setUser({ name: "", email: "" });
        }
      })
      .catch((err) => {
        console.error("Erreur fetch session:", err);
        setUser({ name: "", email: "" });
      });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        // Réinitialiser immédiatement l'état utilisateur
        setUser({ name: "", email: "" });
        setIsOpen(false);
        navigate("/login_form");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center rounded-full bg-indigo-600 size-11 hover:bg-indigo-700 hover:shadow-md transition-all"
      >
        <span className="text-white text-sm font-semibold">{initials}</span>
        <span className="absolute right-0 bottom-0 rounded-full ring-2 ring-white bg-green-500 size-3"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">
              {user.name || "Utilisateur"}
            </p>
            <p className="text-xs text-gray-500">
              {user.email || "user@bookbyclick.com"}
            </p>
          </div>

          <div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  <span>Déconnexion</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
