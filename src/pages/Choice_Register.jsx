import { CalendarDaysIcon, UserIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline"

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-10 h-10 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">
                Book By Click
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Choisissez votre type de compte</p>
        </div>

        {/* Cartes */}
        <div className="space-y-4">
          {/* Particulier - Lien vers inscription particulier */}
          <a
            href="/register_form_user" // Lien vers le formulaire d'inscription particulier
            className="w-full bg-white p-6 rounded-xl border border-gray-200 
                       shadow-sm hover:shadow-md hover:border-indigo-400 
                       transition-all duration-200 text-left group block"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center 
                            group-hover:bg-indigo-200 transition-colors"
              >
                <UserIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Particulier</h3>
                <p className="text-sm text-gray-600">
                  Pour gérer vos réservations personnelles
                </p>
              </div>
            </div>
          </a>

          {/* Professionnel - Lien vers inscription professionnel */}
          <a
            href="/register_form_pro" // Lien vers le formulaire d'inscription professionnel
            className="w-full bg-white p-6 rounded-xl border border-gray-200 
                       shadow-sm hover:shadow-md hover:border-blue-400 
                       transition-all duration-200 text-left group block"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center 
                            group-hover:bg-blue-200 transition-colors"
              >
                <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Professionnel</h3>
                <p className="text-sm text-gray-600">
                  Pour gérer les réservation de votre entreprise
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Lien de retour à l'accueil */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}