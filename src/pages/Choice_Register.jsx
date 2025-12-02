import { 
  CalendarDaysIcon, 
  UserIcon, 
  BuildingOffice2Icon,
  ArrowRightIcon,
  CheckIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header professionnel */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-8 h-8 text-indigo-600 " />
              <a href="/" className="text-xl font-bold text-gray-900">
                Book By Click
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full">
          {/* En-tête principal */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Choisissez votre solution
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Rejoignez la plateforme qui simplifie la prise de rendez-vous. 
              Pour les clients comme pour les professionnels, gérez vos réservations en toute simplicité.
            </p>
          </div>

          {/* Grille de sélection desktop-first */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card Client */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur" />
              <a
                href="/register_form_user"
                className="relative block bg-white p-8 rounded-2xl border border-gray-200 shadow-lg 
                           group-hover:border-indigo-300 group-hover:shadow-2xl transition-all duration-500 
                           ease-out group-hover:-translate-y-1.5 active:scale-95"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 
                                flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <UserIcon className="w-8 h-8 text-indigo-600" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Créer un compte Client
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Réservez en ligne avec les meilleurs professionnels de votre secteur. Simple, rapide et gratuit.
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {['Recherche de prestataires', 'Réservation 24/7', 'Notifications automatiques', 'Historique de vos RDV', 'Annulation facile'].map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 text-sm">
                      <CheckIcon className="w-4 h-4 text-indigo-600 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 group-hover:border-indigo-100 transition-colors">
                  <span className="text-base font-semibold text-indigo-600 group-hover:text-indigo-700">
                    Créer mon compte
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </a>
            </div>

            {/* Card Professionnel */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur" />
              <a
                href="/register_form_pro"
                className="relative block bg-white p-8 rounded-2xl border border-gray-200 shadow-lg 
                           group-hover:border-blue-300 group-hover:shadow-2xl transition-all duration-500 
                           ease-out group-hover:-translate-y-1.5 active:scale-95"
              >
                {/* Badge */}
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1 text-sm font-semibold bg-blue-50 text-blue-600 rounded-full">
                    Business
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 
                                flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <BuildingOffice2Icon className="w-8 h-8 text-blue-600" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Créer un compte Entreprise
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Optimisez votre planning, gagnez du temps et fidélisez vos clients avec un système complet.
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {['Planning en temps réel', 'Gestion des disponibilités', 'Rappels automatiques', 'Paiement en ligne', 'Statistiques & reporting'].map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 text-sm">
                      <CheckIcon className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 group-hover:border-blue-100 transition-colors">
                  <span className="text-base font-semibold text-blue-600 group-hover:text-blue-700">
                    Crée mon compte pro
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </a>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium group hover:underline"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l'accueil</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}