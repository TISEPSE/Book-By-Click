"use client"

import { useCalendar } from "../Hook/useCalendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import NavigationButtons from "./NavigationButtons"
import ViewDropdown from "./ViewDropdown"
import MonthView from "./MonthView"
import WeekView from "./WeekView"

// On accepte la prop "events" envoyée par CalendarContent
export default function Calendar({ events: externalEvents = [] }) {
  const {
    date,
    view,
    events: localEvents,
    setDate,
    setView,
    handlePrevious,
    handleNext,
    handleToday,
  } = useCalendar()

  // Priorité aux événements venant de la DB (externalEvents)
  // S'il n'y en a pas (tableau vide), on prend les locaux
  const displayEvents = externalEvents.length > 0 ? externalEvents : localEvents

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {format(date, "MMMM yyyy", { locale: fr })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Semaine {format(date, "w", { locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NavigationButtons
            onPrevious={handlePrevious}
            onToday={handleToday}
            onNext={handleNext}
          />
          <ViewDropdown view={view} onViewChange={setView} />
        </div>
      </div>

      {/* On passe displayEvents aux vues */}
      <div className="relative">
        {view === "week" ? (
          <WeekView date={date} onNavigate={setDate} events={displayEvents} />
        ) : (
          <MonthView date={date} onNavigate={setDate} events={displayEvents} />
        )}
      </div>
    </>
  )
}