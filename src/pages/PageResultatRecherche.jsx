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
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { entreprises } from "../data/mockEntreprises"

// Données enrichies pour la liste (distance et nextSlot sont spécifiques à la recherche)
const businesses = entreprises.map((e) => ({
  ...e,
  distance: [2.3, 1.8, 3.1, 4.2, 2.7][e.id - 1] || 1.0,
  nextSlot: ["Aujourd'hui à 19h30", "Demain à 10h00", "Aujourd'hui à 16h00", "Demain à 15h30", "Aujourd'hui à 14h30"][e.id - 1] || "Demain",
}))

// ============= COMPOSANT ACCORDION FILTRE =============
function FilterAccordion({ title, icon: IconComponent, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-1 text-left"
      >
        <div className="flex items-center gap-2">
          <IconComponent className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-3 px-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

// ============= COMPOSANT CHECKBOX =============
function FilterCheckbox({ label, count }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group px-2 py-1.5 rounded hover:bg-gray-50">
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <span className="text-sm text-gray-600 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      {count && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  )
}

// ============= COMPOSANT BUSINESS CARD =============
function BusinessCard({ business, onNavigate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="px-5 py-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              {business.discount && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs font-medium rounded">
                  {business.discount}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + Verified */}
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {business.name}
              </h3>
              {business.verified && (
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              )}
            </div>

            {/* Category + Rating */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500">{business.category}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-900">{business.rating}</span>
                <span className="text-xs text-gray-400">({business.reviewCount})</span>
              </div>
              <span className="text-xs font-medium text-gray-600">{business.priceRange}</span>
            </div>

            {/* Address + Distance + Availability */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {business.distance} km
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {business.nextSlot}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={onNavigate}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Prestations
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= COMPOSANT PRINCIPAL =============
export default function PageResultatRecherche() {
  const navigate = useNavigate()
  const [maxPrice, setMaxPrice] = useState(150)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Barre de recherche */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quel service recherchez-vous ?"
                className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 rounded-lg"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Ville ou adresse"
                className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* Sidebar Filtres */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Filtres
                </h2>
              </div>

              {/* Filtres */}
              <div className="px-4 py-2">
                {/* Catégories */}
                <FilterAccordion title="Catégories" icon={SlidersHorizontal} defaultOpen={true}>
                  <FilterCheckbox label="Restaurant" count={42} />
                  <FilterCheckbox label="Médecin" count={38} />
                  <FilterCheckbox label="Coiffeur" count={35} />
                  <FilterCheckbox label="Garage automobile" count={28} />
                  <FilterCheckbox label="Salle de sport" count={24} />
                  <FilterCheckbox label="Avocat" count={16} />
                  <FilterCheckbox label="Spa & Bien-être" count={19} />
                  <FilterCheckbox label="Vétérinaire" count={15} />
                </FilterAccordion>

                {/* Prix */}
                <FilterAccordion title="Budget maximum" icon={SlidersHorizontal} defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Par prestation</span>
                      <span className="font-medium text-indigo-600">{maxPrice}€</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={maxPrice}
                      step="10"
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0€</span>
                      <span>500€</span>
                    </div>
                  </div>
                </FilterAccordion>

                {/* Note */}
                <FilterAccordion title="Note minimum" icon={Star} defaultOpen={false}>
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>5 étoiles</span>
                      </div>
                    }
                    count={12}
                  />
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>4+ étoiles</span>
                      </div>
                    }
                    count={38}
                  />
                  <FilterCheckbox
                    label={
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>3+ étoiles</span>
                      </div>
                    }
                    count={70}
                  />
                </FilterAccordion>

                {/* Distance */}
                <FilterAccordion title="Distance" icon={MapPin} defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rayon</span>
                      <span className="font-medium text-indigo-600">5 km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      defaultValue="5"
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1 km</span>
                      <span>20 km</span>
                    </div>
                  </div>
                </FilterAccordion>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-5 py-3">
                <button className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <main className="flex-1 min-w-0">
            {/* Nombre de résultats */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{businesses.length} résultats</span> trouvés
              </p>
            </div>

            {/* Liste des résultats */}
            <div className="space-y-3">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onNavigate={() => navigate(`/entreprise/${business.slug}`)}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Voir plus de résultats
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
