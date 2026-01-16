import { useState, useEffect } from 'react';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// Données mockées pour le test - à remplacer par l'appel API
const mockUserData = {
  id: 1,
  nom: "Jean Dupont",
  email: "jean.dupont@email.com",
  telephone: "06 12 34 56 78",
  avatar: null, // URL de l'avatar ou null pour afficher l'icône par défaut
  role: "Utilisateur",
  date_inscription: "2024-03-15"
};

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulation d'un appel API
    const fetchUser = async () => {
      try {
        setLoading(true);

        // TODO: Remplacer par l'appel API réel
        // const response = await fetch('/api/user', {
        //   headers: {
        //     'Authorization': `Bearer ${token}` // Token à récupérer
        //   }
        // });
        // if (!response.ok) throw new Error('Erreur de récupération');
        // const data = await response.json();
        // setUser(data);

        // Simulation avec données mockées (délai pour simuler le réseau)
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(mockUserData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Formater la date d'inscription
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Carte profil utilisateur */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête avec avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.nom}
                className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md bg-white flex items-center justify-center">
                <UserCircleIcon className="w-20 h-20 text-gray-400" />
              </div>
            )}
            <h1 className="mt-4 text-2xl font-bold text-white">{user.nom}</h1>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm text-white">
              {user.role}
            </span>
          </div>

          {/* Informations utilisateur */}
          <div className="px-6 py-6 space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
            </div>

            {/* Téléphone */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <PhoneIcon className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</p>
                <p className="text-gray-800 font-medium">{user.telephone}</p>
              </div>
            </div>

            {/* Date d'inscription */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Membre depuis</p>
                <p className="text-gray-800 font-medium">{formatDate(user.date_inscription)}</p>
              </div>
            </div>

            {/* Rôle */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Rôle</p>
                <p className="text-gray-800 font-medium">{user.role}</p>
              </div>
            </div>
          </div>

          {/* ID utilisateur (pour debug) */}
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-400 text-center">ID: {user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
