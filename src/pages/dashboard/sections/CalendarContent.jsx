import React, { useState, useEffect } from "react"
import Calendar from "../../../components/Calendar"
import { Loader2 } from "lucide-react"

/**
 * Section calendrier du tableau de bord professionnel.
 *
 * Affiche tous les créneaux de l'entreprise connectée en les colorant
 * selon leur statut (vert = disponible, rouge = réservé).
 * Les données sont récupérées depuis l'API à chaque montage du composant.
 */
const CalendarContent = ({ showLegend = true }) => {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetch("/api/entreprise/calendrier", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Impossible de charger le calendrier")
        return res.json()
      })
      .then(data => {
        setEvents(data.map(event => ({
          ...event,
          start: new Date(event.start),
          end:   new Date(event.end),
          style: {
            backgroundColor: event.extendedProps?.isTaken ? '#FEE2E2' : '#DCFCE7',
            color:            event.extendedProps?.isTaken ? '#991B1B' : '#166534',
            borderLeft:      `4px solid ${event.extendedProps?.isTaken ? '#EF4444' : '#22C55E'}`,
          },
        })))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      {showLegend && (
        <div className="flex gap-6 bg-white px-5 py-3 rounded-xl border border-gray-200 w-fit">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-700 font-medium">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-700 font-medium">Réservé</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 w-full min-h-[700px]">
        {loading ? (
          <div className="flex h-96 items-center justify-center gap-3 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 text-indigo-600" />
            <span className="text-sm">Chargement du calendrier…</span>
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <Calendar events={events} />
        )}
      </div>
    </div>
  )
}

export default CalendarContent
