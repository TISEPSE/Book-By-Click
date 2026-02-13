import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  MapPin,
  Clock,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Building2,
  Loader2,
} from "lucide-react"
import Navbar from "../components/Navbar"

export default function EntrepriseDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [entreprise, setEntreprise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("prestations")

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/entreprise/slug/${slug}`)
        if (!response.ok) {
          throw new Error("Entreprise non trouvée")
        }
        const data = await response.json()
        setEntreprise(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEntreprise()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement...</span>
        </div>
      </div>
    )
  }

  if (error || !entreprise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Entreprise non trouvée</p>
          <button
            onClick={() => navigate("/result")}
            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            Retour aux résultats
          </button>
        </main>
      </div>
    )
  }

  const address = `${entreprise.adresse}, ${entreprise.codePostal} ${entreprise.ville}, ${entreprise.pays}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header entreprise */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => navigate("/result")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux résultats
          </button>

          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-indigo-50 flex-shrink-0 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">
                  {entreprise.nomEntreprise}
                </h1>
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">
                  {entreprise.nomSecteur}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-6 -mb-px">
            <button
              onClick={() => setActiveTab("prestations")}
              className={`pb-3 text-sm font-medium border-b-2 ${
                activeTab === "prestations"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Prestations
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Tab: Prestations */}
        {activeTab === "prestations" && (
          <section className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Nos prestations
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {entreprise.prestations && entreprise.prestations.length > 0 ? (
                entreprise.prestations.map((prestation) => (
                  <div
                    key={prestation.idPrestation}
                    className="px-5 py-5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900">
                        {prestation.libelle}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {prestation.dureeMinutes} min
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="font-semibold text-gray-900">
                          {prestation.tarif} €
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/reservation/${slug}`, {
                          state: {
                            prestation: {
                              id: prestation.idPrestation,
                              name: prestation.libelle,
                              duration: prestation.dureeMinutes,
                              price: prestation.tarif,
                            },
                            entreprise: {
                              name: entreprise.nomEntreprise,
                              slug: entreprise.slugPublic,
                              address: address,
                            },
                          },
                        })
                      }
                      className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Choisir un créneau
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm text-gray-500">Aucune prestation disponible</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
