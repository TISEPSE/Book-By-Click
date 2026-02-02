import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Edit3,
  LogOut,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  Clock,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";

// Données mockées - à remplacer par l'appel API
const mockUserData = {
  idClient: 42,
  nom: "Dupont",
  prenom: "Jean-Baptiste",
  dateNaissance: "1995-06-15",
  email: "jean.baptiste.dupont@email.com",
  telephone: "06 12 34 56 78",
  dateInscription: "2024-03-15T14:30:00",
  estGerant: false,
  type: {
    role: "client",
    description: "Compte client"
  },
  avatar: null,
  adresse: "12 Rue de la Paix",
  ville: "Paris",
  codePostal: "75002"
};

// Masquer l'email
const maskEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) {
    return `${'*'.repeat(localPart.length)}@${domain}`;
  }
  const visiblePart = localPart.slice(0, 3);
  const maskedPart = '*'.repeat(Math.min(localPart.length - 3, 7));
  return `${visiblePart}${maskedPart}@${domain}`;
};

// Formater les dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Calculer l'âge
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Obtenir les initiales
const getInitials = (nom, prenom) => {
  const n = nom ? nom[0] : '';
  const p = prenom ? prenom[0] : '';
  return (p + n).toUpperCase() || 'U';
};

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showEmail, setShowEmail] = useState(false);
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // États des paramètres
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderTime: '24h',
    language: 'fr',
    profileVisibility: 'public'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        setUser(mockUserData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 p-6 max-w-sm w-full text-center">
          <p className="text-red-600 font-medium mb-4">Erreur : {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.nom, user.prenom);
  const age = calculateAge(user.dateNaissance);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{user.prenom} {user.nom}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Membre depuis {formatDate(user.dateInscription)}
              </p>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-6 -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Paramètres
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">

        {/* Tab: Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* Informations personnelles */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Informations personnelles
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Prénom</p>
                    <p className="text-sm text-gray-900 mt-0.5">{user.prenom}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Nom</p>
                    <p className="text-sm text-gray-900 mt-0.5">{user.nom}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date de naissance</p>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {formatDate(user.dateNaissance)}
                      {age && <span className="text-gray-500 ml-1">({age} ans)</span>}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Type de compte</p>
                    <p className="text-sm text-gray-900 mt-0.5 capitalize">{user.type?.role || 'Client'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Coordonnées */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Coordonnées
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm text-gray-900 mt-0.5 font-mono">
                      {showEmail ? user.email : maskEmail(user.email)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmail(!showEmail)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</p>
                    <p className="text-sm text-gray-900 mt-0.5">{user.telephone}</p>
                  </div>
                </div>
                {user.adresse && (
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Adresse</p>
                      <p className="text-sm text-gray-900 mt-0.5">
                        {user.adresse}, {user.codePostal} {user.ville}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ID */}
            <div className="px-5 py-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-between">
              <span className="text-xs text-gray-500">Identifiant</span>
              <span className="text-xs text-gray-600 font-mono">#{user.idClient}</span>
            </div>

            {/* Déconnexion */}
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>

          </div>
        )}

        {/* Tab: Paramètres */}
        {activeTab === 'settings' && (
          <div className="space-y-6">

            {/* Notifications */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Notifications
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notifications email</p>
                      <p className="text-xs text-gray-500 mt-0.5">Confirmations et rappels par email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.emailNotifications ? 'left-5.5 translate-x-0' : 'left-0.5'
                    }`} style={{ left: settings.emailNotifications ? '22px' : '2px' }} />
                  </button>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notifications SMS</p>
                      <p className="text-xs text-gray-500 mt-0.5">Rappels par SMS avant vos rendez-vous</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('smsNotifications')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      settings.smsNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform`}
                      style={{ left: settings.smsNotifications ? '22px' : '2px' }} />
                  </button>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notifications push</p>
                      <p className="text-xs text-gray-500 mt-0.5">Alertes en temps réel sur votre navigateur</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('pushNotifications')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      settings.pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform`}
                      style={{ left: settings.pushNotifications ? '22px' : '2px' }} />
                  </button>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Délai de rappel</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quand recevoir le rappel</p>
                    </div>
                  </div>
                  <select
                    value={settings.reminderTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="1h">1 heure avant</option>
                    <option value="3h">3 heures avant</option>
                    <option value="24h">24 heures avant</option>
                    <option value="48h">48 heures avant</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Préférences */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Préférences
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">Langue</p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">Visibilité du profil</p>
                  </div>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Sécurité */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Sécurité
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Modifier le mot de passe</p>
                      <p className="text-xs text-gray-500 mt-0.5">Dernière modification il y a 3 mois</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Authentification à deux facteurs</p>
                      <p className="text-xs text-gray-500 mt-0.5">Non activée</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </section>

            {/* Zone danger */}
            <section className="bg-white border border-red-200 rounded-lg">
              <div className="px-5 py-4 border-b border-red-200 bg-red-50">
                <h2 className="text-sm font-semibold text-red-800 uppercase tracking-wide">
                  Zone de danger
                </h2>
              </div>
              <div className="divide-y divide-red-100">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Supprimer mon compte</p>
                    <p className="text-xs text-gray-500 mt-0.5">Cette action est irréversible</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;
