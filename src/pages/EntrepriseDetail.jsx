import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  MapPin,
  Star,
  Clock,
  Phone,
  CheckCircle,
  Calendar,
  ArrowLeft,
  ImageIcon,
} from "lucide-react"
import Navbar from "../components/Navbar"
import { getEntrepriseBySlug } from "../data/mockEntreprises"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function EntrepriseDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const entreprise = getEntrepriseBySlug(slug)
  const [activeTab, setActiveTab] = useState("prestations")

  if (!entreprise) {
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
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={entreprise.image}
                alt={entreprise.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">
                  {entreprise.name}
                </h1>
                {entreprise.verified && (
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">
                  {entreprise.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {entreprise.rating}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({entreprise.reviewCount} avis)
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {entreprise.address}
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {entreprise.phone}
                </span>
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
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 text-sm font-medium border-b-2 ${
                activeTab === "about"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              À propos
            </button>
            <button
              onClick={() => setActiveTab("avis")}
              className={`pb-3 text-sm font-medium border-b-2 ${
                activeTab === "avis"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Avis
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`pb-3 text-sm font-medium border-b-2 ${
                activeTab === "photos"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Photos
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Tab: Prestations */}
        {activeTab === "prestations" && (
          <>
            {/* Nos prestations */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Nos prestations
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {entreprise.prestations.map((prestation) => (
                  <div
                    key={prestation.id}
                    className="px-5 py-5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900">
                        {prestation.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {prestation.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {prestation.duration} min
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="font-semibold text-gray-900">
                          {prestation.price} €
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/reservation/${slug}`, {
                          state: {
                            prestation,
                            entreprise: {
                              name: entreprise.name,
                              slug: entreprise.slug,
                              address: entreprise.address,
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
                ))}
              </div>
            </section>

            {/* Horaires d'ouverture */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Horaires d'ouverture
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {Object.entries(entreprise.horaires).map(([jour, horaire]) => (
                  <div
                    key={jour}
                    className="px-5 py-4 flex items-center justify-between"
                  >
                    <span className="text-[15px] font-medium text-gray-700">{jour}</span>
                    <span
                      className={`text-[15px] ${horaire === "Fermé" ? "text-red-500 font-semibold" : "font-medium text-gray-900"}`}
                    >
                      {horaire}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Tab: À propos */}
        {activeTab === "about" && (
          <section className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                À propos
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {entreprise.description}
              </p>
            </div>
          </section>
        )}

        {/* Tab: Avis */}
        {activeTab === "avis" && (
          <section className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Avis clients
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {entreprise.avis.map((avis) => (
                <div key={avis.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {avis.auteur}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < avis.note
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {format(new Date(avis.date), "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{avis.commentaire}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab: Photos */}
        {activeTab === "photos" && (
          <section className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Photos
              </h2>
            </div>
            <div className="px-5 py-12 text-center">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aucune photo pour le moment</p>
              <p className="text-xs text-gray-400 mt-1">Les photos seront bientôt disponibles</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
