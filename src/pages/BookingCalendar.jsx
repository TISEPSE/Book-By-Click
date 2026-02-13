import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Clock, ArrowLeft, ChevronLeft, ChevronRight, Euro, Calendar, Loader2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import { generateMockSlots } from "../data/mockEntreprises"
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

export default function BookingCalendar() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const prestation = location.state?.prestation
  const entreprise = location.state?.entreprise

  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [allSlots, setAllSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/entreprise/slug/${slug}`)
        if (!response.ok) throw new Error("Erreur")
        const data = await response.json()
        const dbSlots = (data.creneaux || []).filter((c) => c.statut)

        if (dbSlots.length > 0) {
          setAllSlots(dbSlots.map((c) => {
            const dateDebut = parseISO(c.dateHeureDebut)
            return {
              id: c.idCreneau,
              date: startOfDay(dateDebut),
              time: format(dateDebut, "HH'h'mm"),
              start: dateDebut,
            }
          }))
        } else if (prestation) {
          // Pas de créneaux en BDD → générer des créneaux par défaut
          setAllSlots(generateMockSlots(prestation.duration))
        }
      } catch {
        // En cas d'erreur API, fallback sur les créneaux générés
        if (prestation) {
          setAllSlots(generateMockSlots(prestation.duration))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCreneaux()
  }, [slug, prestation])

  if (!entreprise || !prestation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Données de réservation manquantes</p>
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

  const handlePreviousWeek = () => setWeekStart((prev) => addDays(prev, -7))
  const handleNextWeek = () => setWeekStart((prev) => addDays(prev, 7))

  const getSlotsForDay = (day) => {
    return allSlots.filter((slot) => isSameDay(slot.date, day))
  }

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot)
  }

  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/session", {
        credentials: "include",
      })

      if (!response.ok) {
        sessionStorage.setItem(
          "toast",
          JSON.stringify({
            message: "Veuillez vous connecter pour réserver",
            type: "error",
          })
        )
        navigate("/login")
        return
      }

      navigate("/reservation/confirmation", {
        state: {
          booking: {
            entreprise,
            prestation,
            date: selectedSlot.date,
            time: selectedSlot.time,
          },
        },
      })
    } catch {
      sessionStorage.setItem(
        "toast",
        JSON.stringify({
          message: "Veuillez vous connecter pour réserver",
          type: "error",
        })
      )
      navigate("/login")
    }
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = startOfDay(new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Barre résumé prestation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{entreprise.name}</p>
              <p className="text-lg font-semibold text-gray-900">
                {prestation.name}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {prestation.duration} min
              </span>
              <span className="font-medium text-gray-900">
                {prestation.price} €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation semaine */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousWeek}
            className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">
            Semaine du{" "}
            {format(weekStart, "d MMMM yyyy", { locale: fr })}
          </h2>
          <button
            onClick={handleNextWeek}
            className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-gray-500">Chargement des créneaux...</span>
          </div>
        ) : (
          <>
            {/* Grille créneaux */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {days.map((day, i) => {
                const isToday = isSameDay(day, today)
                const isPast = isBefore(day, today)
                const daySlots = getSlotsForDay(day)

                return (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Header jour */}
                    <div
                      className={`px-3 py-2.5 border-b border-gray-200 text-center ${
                        isToday ? "bg-indigo-50" : ""
                      }`}
                    >
                      <p className="text-xs text-gray-500 uppercase">
                        {format(day, "EEE", { locale: fr })}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isToday ? "text-indigo-600" : "text-gray-900"
                        }`}
                      >
                        {format(day, "d MMM", { locale: fr })}
                      </p>
                    </div>

                    {/* Créneaux */}
                    <div className="p-2.5 space-y-2 min-h-[280px]">
                      {isPast ? (
                        <p className="text-xs text-gray-400 text-center pt-8">
                          Passé
                        </p>
                      ) : daySlots.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center pt-8">
                          Aucun créneau
                        </p>
                      ) : (
                        daySlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotClick(slot)}
                            className="w-full px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                          >
                            {slot.time}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Légende */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 border border-indigo-200 rounded" />
              <span>Créneau disponible</span>
            </div>
          </>
        )}
      </main>

      {/* Modal confirmation */}
      <Modal
        isOpen={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        title="Confirmer la réservation"
      >
        {selectedSlot && (
          <div className="space-y-5">
            {/* En-tête entreprise + prestation */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-5 py-4">
              <p className="text-base font-semibold text-indigo-700">
                {entreprise.name}
              </p>
              <p className="text-[15px] text-indigo-600 mt-0.5">
                {prestation.name}
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              <div className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className="text-[15px] text-gray-600">Date</span>
                </div>
                <span className="text-[15px] font-semibold text-gray-900 capitalize">
                  {format(selectedSlot.date, "EEEE d MMMM", { locale: fr })}
                </span>
              </div>
              <div className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="text-[15px] text-gray-600">Heure</span>
                </div>
                <span className="text-[15px] font-semibold text-gray-900">
                  {selectedSlot.time}
                </span>
              </div>
              <div className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="text-[15px] text-gray-600">Durée</span>
                </div>
                <span className="text-[15px] font-medium text-gray-900">
                  {prestation.duration} min
                </span>
              </div>
              <div className="px-5 py-3.5 flex items-center justify-between bg-indigo-50/50">
                <div className="flex items-center gap-2.5">
                  <Euro className="w-4 h-4 text-indigo-600" />
                  <span className="text-[15px] font-medium text-indigo-700">Total</span>
                </div>
                <span className="text-base font-bold text-indigo-700">
                  {prestation.price} €
                </span>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 px-4 py-3 text-[15px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 text-[15px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
