import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import {
  Search,
  MapPin,
  Star,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Clock,
} from "lucide-react"
import { useState } from "react"

// ============= DONNÉES STATIQUES =============
const businesses = [
  {
    id: 1,
    name: "Salon Le Parisien",
    category: "Coiffeur",
    distance: 2.3,
    rating: 4.8,
    reviewCount: 234,
    priceRange: "€€",
    address: "15 Rue de Rivoli, 75001 Paris",
    nextSlot: "Aujourd'hui à 14h30",
    verified: true,
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200",
  },
  {
    id: 2,
    name: "Coiffure Moderne",
    category: "Coiffeur",
    distance: 1.8,
    rating: 4.9,
    reviewCount: 189,
    priceRange: "€€€",
    address: "28 Avenue des Champs-Élysées, 75008 Paris",
    nextSlot: "Demain à 10h00",
    verified: true,
    discount: null,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200",
  },
  {
    id: 3,
    name: "Barbier Vintage",
    category: "Barbier",
    distance: 3.1,
    rating: 4.7,
    reviewCount: 156,
    priceRange: "€€",
    address: "42 Rue du Temple, 75003 Paris",
    nextSlot: "Aujourd'hui à 16h00",
    verified: false,
    discount: null,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200",
  },
  {
    id: 4,
    name: "Beauty Lounge Paris",
    category: "Institut de beauté",
    distance: 4.2,
    rating: 4.6,
    reviewCount: 312,
    priceRange: "€€€€",
    address: "8 Boulevard Haussmann, 75009 Paris",
    nextSlot: "Demain à 15h30",
    verified: true,
    discount: "-15%",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
  },
  {
    id: 5,
    name: "Spa & Wellness Center",
    category: "Spa",
    distance: 2.7,
    rating: 4.9,
    reviewCount: 421,
    priceRange: "€€€€",
    address: "12 Rue de la Paix, 75002 Paris",
    nextSlot: "Aujourd'hui à 18h00",
    verified: true,
    discount: null,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200",
  },
]

// ============= COMPOSANT ACCORDION FILTRE =============
function FilterAccordion({ title, icon: Icon, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-2 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

// ============= COMPOSANT CHECKBOX =============
function FilterCheckbox({ label, count }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group hover:bg-indigo-50 rounded-lg px-2 py-2 transition-colors duration-150">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      {count && (
        <span className="text-xs text-gray-400 font-medium">({count})</span>
      )}
    </label>
  )
}

// ============= COMPOSANT BUSINESS CARD =============
function BusinessCard({ business }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex gap-5">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 relative ring-2 ring-gray-100 group-hover:ring-indigo-200 transition-all duration-300">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {business.discount && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow-sm">
                  {business.discount}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + Verified */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {business.name}
              </h3>
              {business.verified && (
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              )}
            </div>

            {/* Rating + Category */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900">
                  {business.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({business.reviewCount})
                </span>
              </div>
              <span className="text-sm bg-gray-50 px-2.5 py-1 rounded-lg text-gray-700 font-medium">
                {business.category}
              </span>
            </div>

            {/* Price + Distance + Availability */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-gray-900">
                {business.priceRange}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {business.distance} km
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm bg-green-50 px-2.5 py-1 rounded-lg text-green-700 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {business.nextSlot}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Voir les disponibilités</span>
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Réserver</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= COMPOSANT PRINCIPAL =============
export default function PageResultatRecherche() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4">
            <a href="/" className="flex items-center space-x-2 group">
              <CalendarDaysIcon className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-gray-900">
                Book By Click
              </span>
            </a>

            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <a
                  href="https://tisepse.github.io/Documentation-BBC/"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Comment ça marche
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="/login_form"
                className="hidden sm:block px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300 hover:underline"
              >
                Se connecter
              </a>
              <a
                href="/register_choice"
                className="px-5 py-2.5 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Créer un compte
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
                    <p className="text-xs text-gray-500">Affiner votre recherche</p>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div className="p-4">
                {/* Catégories */}
                <FilterAccordion title="Catégories" icon={SlidersHorizontal} defaultOpen={true}>
                  <FilterCheckbox label="Coiffeur" count={42} />
                  <FilterCheckbox label="Barbier" count={18} />
                  <FilterCheckbox label="Institut de beauté" count={35} />
                  <FilterCheckbox label="Spa" count={12} />
                  <FilterCheckbox label="Massage" count={24} />
                  <FilterCheckbox label="Onglerie" count={16} />
                </FilterAccordion>

                {/* Prix */}
                <FilterAccordion title="Prix" icon={SlidersHorizontal} defaultOpen={true}>
                  <FilterCheckbox label="€ - Économique (- de 30€)" count={28} />
                  <FilterCheckbox label="€€ - Abordable (30-60€)" count={45} />
                  <FilterCheckbox label="€€€ - Moyen (60-100€)" count={32} />
                  <FilterCheckbox label="€€€€ - Premium (100€+)" count={15} />
                </FilterAccordion>

                {/* Note */}
                <FilterAccordion title="Note minimum" icon={Star} defaultOpen={false}>
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>5 étoiles</span>
                      </div>
                    }
                    count={12}
                  />
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4+ étoiles</span>
                      </div>
                    }
                    count={38}
                  />
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>3+ étoiles</span>
                      </div>
                    }
                    count={70}
                  />
                </FilterAccordion>

                {/* Distance */}
                <FilterAccordion title="Distance" icon={MapPin} defaultOpen={true}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rayon de recherche</span>
                      <span className="font-semibold text-indigo-600">5 km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      defaultValue="5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1 km</span>
                      <span>20 km</span>
                    </div>
                  </div>
                </FilterAccordion>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Vous recherchez</p>
                    <p className="text-xl font-bold text-gray-900">
                      Coiffeur à Paris
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-lg transition-all duration-200"
                >
                  Modifier la recherche
                </button>
              </div>
            </div>

            {/* Nombre de résultats */}
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {businesses.length} résultats
                </span>{" "}
                trouvés
              </p>
            </div>

            {/* Liste des résultats */}
            <div className="space-y-5">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all duration-200">
                Voir plus de résultats
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
