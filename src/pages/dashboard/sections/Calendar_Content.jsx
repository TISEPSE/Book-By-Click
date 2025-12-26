import React, { useState, useEffect } from "react"
import Calendar from "../../../components/Calendar"
import { Loader2, Circle } from "lucide-react"

// Données de test
const CALENDAR_MOCK_DATA = [
  {
    id: 1,
    start: "2025-12-26T14:30:00",
    end: "2025-12-26T15:15:00",
    title: "Sophie Martin (Occupé)",
    extendedProps: { isTaken: true }
  },
  {
    id: 2,
    start: "2025-12-26T16:15:00",
    end: "2025-12-26T16:35:00",
    title: "Thomas Dubois (Occupé)",
    extendedProps: { isTaken: true }
  },
  {
    id: 10,
    start: "2025-12-26T09:00:00",
    end: "2025-12-26T10:00:00",
    title: "Disponible",
    extendedProps: { isTaken: false }
  },
  {
    id: 11,
    start: "2025-12-26T11:00:00",
    end: "2025-12-26T12:00:00",
    title: "Disponible",
    extendedProps: { isTaken: false }
  }
];

const CalendarContent = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const formatEvents = (data) => {
      if (!data) return []
      
      return data.map(event => {
        const isTaken = event.extendedProps?.isTaken;
        
        // Définition des couleurs
        const bgColor = isTaken ? '#FEE2E2' : '#DCFCE7'; // Rouge clair vs Vert clair
        const textColor = isTaken ? '#991B1B' : '#166534'; // Rouge foncé vs Vert foncé
        const borderColor = isTaken ? '#EF4444' : '#22C55E'; // Rouge vif vs Vert vif
        const tailwindClass = isTaken ? 'bg-red-100 text-red-800 border-red-500' : 'bg-green-100 text-green-800 border-green-500';

        return {
          ...event,
          // Transformation en objet Date impérative pour éviter le crash blanc
          start: new Date(event.start),
          end: new Date(event.end),
          
          // 1. Pour les composants qui utilisent l'attribut style direct
          style: {
            backgroundColor: bgColor,
            color: textColor,
            borderLeft: `4px solid ${borderColor}`,
          },
          
          // 2. Pour les composants qui utilisent des props nommées
          backgroundColor: bgColor,
          textColor: textColor,
          borderColor: borderColor,
          color: borderColor, // Parfois utilisé comme couleur principale

          // 3. Pour les composants qui utilisent Tailwind
          className: tailwindClass,
        }
      })
    }

    setEvents(formatEvents(CALENDAR_MOCK_DATA))
  }, [])

  return (
    <div className="space-y-6">
      {/* Section Légende Améliorée */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-4 rounded-md bg-green-500 border-2 border-green-600 shadow-sm"></div>
          <span className="text-sm font-bold text-gray-700">Créneaux Disponibles (Libre)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-4 rounded-md bg-red-500 border-2 border-red-600 shadow-sm"></div>
          <span className="text-sm font-bold text-gray-700">Réservations Clients (Occupé)</span>
        </div>
      </div>

      {/* Zone Calendrier */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8 w-full min-h-[700px]">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin size-10 text-indigo-600" />
          </div>
        ) : (
          <Calendar events={events} />
        )}
      </div>
    </div>
  )
}

export default CalendarContent