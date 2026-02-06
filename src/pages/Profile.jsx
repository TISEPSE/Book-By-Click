import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, LogOut, Mail, Bell, Lock, Eye, Globe, Smartphone, Clock, ChevronRight, Shield } from "lucide-react";
import Navbar from "../components/Navbar";

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fonction pour se logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      sessionStorage.setItem("toast", JSON.stringify({ message: "Déconnexion réussie", type: "success" }));
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour supprimer le compte
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues."
    );

    if (!confirmed) return;

    try {
      const response = await fetch('http://localhost:5000/api/user/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        sessionStorage.setItem("toast", JSON.stringify({ message: "Compte supprimé avec succès", type: "success" }));
        navigate('/login');
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression du compte");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert("Erreur de connexion au serveur");
    }
  };

  // Récupère les informations du user dans l'api
  useEffect(() => {
    fetch("http://localhost:5000/api/user", {
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Non connecté")
      }
      return res.json()
    })
    .then(data => setUser(data))
    .catch(() => navigate("/login"))
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{user?.prenom} {user?.nom}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Membre depuis {user?.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : ''}
              </p>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-6 -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 text-sm font-medium border-b-2 ${
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

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
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Prénom</p>
                  <p className="text-sm text-gray-900 mt-0.5">{user?.prenom}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nom</p>
                  <p className="text-sm text-gray-900 mt-0.5">{user?.nom}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date de naissance</p>
                  <p className="text-sm text-gray-900 mt-0.5">{user?.dateNaissance ? new Date(user.dateNaissance).toLocaleDateString('fr-FR') : ''}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Type de compte</p>
                  <p className="text-sm text-gray-900 mt-0.5">Client</p>
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
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900 mt-0.5">{user?.email}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</p>
                  <p className="text-sm text-gray-900 mt-0.5">{user?.telephone}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Adresse</p>
                  <p className="text-sm text-gray-900 mt-0.5">-</p>
                </div>
              </div>
            </section>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>

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
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notifications SMS</p>
                      <p className="text-xs text-gray-500 mt-0.5">Rappels par SMS avant vos rendez-vous</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notifications push</p>
                      <p className="text-xs text-gray-500 mt-0.5">Alertes en temps réel sur votre navigateur</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Délai de rappel</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quand recevoir le rappel</p>
                    </div>
                  </div>
                  <select className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5">
                    <option>1 heure avant</option>
                    <option>3 heures avant</option>
                    <option>24 heures avant</option>
                    <option>48 heures avant</option>
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
                  <select className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">Visibilité du profil</p>
                  </div>
                  <select className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5">
                    <option>Public</option>
                    <option>Privé</option>
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
                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Modifier le mot de passe</p>
                      <p className="text-xs text-gray-500 mt-0.5">Dernière modification il y a 3 mois</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50">
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
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Supprimer mon compte</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cette action est irréversible</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </section>

          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;
