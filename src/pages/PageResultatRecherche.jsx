import {
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  Building2,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"

// ============= COMPOSANT BUSINESS CARD =============
function BusinessCard({ name, business, onNavigate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="px-5 py-4">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-indigo-50 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            </div>

            {/* Secteur */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500">{business.secteur}</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>
                {business.adresse}, {business.code_postal} {business.ville}, {business.pays}
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
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("service") || "")
  const [searchLocation, setSearchLocation] = useState(searchParams.get("localisation") || "")
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchResults = async (service, localisation) => {
    if (!service && !localisation) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (service) params.append("service", service)
      if (localisation) params.append("localisation", localisation)
      const response = await fetch(`http://127.0.0.1:5000/api/entreprise/search?${params}`)

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Erreur serveur")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error("Erreur lors de la recherche:", err)
      setError(err.message)
      setResults({})
    } finally {
      setLoading(false)
    }
  }

  // Lancer la recherche au chargement si des params existent dans l'URL
  useEffect(() => {
    const service = searchParams.get("service") || ""
    const localisation = searchParams.get("localisation") || ""
    if (service || localisation) {
      fetchResults(service, localisation)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("service", searchQuery)
    if (searchLocation) params.set("localisation", searchLocation)
    setSearchParams(params)
    fetchResults(searchQuery, searchLocation)
  }

  const resultEntries = Object.entries(results)

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
        <main className="w-full">
          {/* Nombre de résultats */}
          {hasSearched && !loading && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{resultEntries.length} résultat{resultEntries.length !== 1 ? "s" : ""}</span> trouvé{resultEntries.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-gray-500">Recherche en cours...</span>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm">Erreur : {error}</p>
            </div>
          )}

          {/* Aucun résultat */}
          {hasSearched && !loading && !error && resultEntries.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Aucun résultat trouvé pour cette recherche.</p>
            </div>
          )}

          {/* Pas encore de recherche */}
          {!hasSearched && !loading && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Lancez une recherche pour voir les résultats.</p>
            </div>
          )}

          {/* Liste des résultats */}
          {!loading && resultEntries.length > 0 && (
            <div className="space-y-3">
              {resultEntries.map(([name, business]) => (
                <BusinessCard
                  key={business.slug}
                  name={name}
                  business={business}
                  onNavigate={() => navigate(`/entreprise/${business.slug}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
