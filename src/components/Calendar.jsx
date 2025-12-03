"use client"

import {useCalendar} from "../Hook/useCalendar"
import {format} from "date-fns"
import {fr} from "date-fns/locale"
import NavigationButtons from "./NavigationButtons"
import ViewDropdown from "./ViewDropdown"
import MonthView from "./MonthView"
import WeekView from "./WeekView"

export default function Calendar() {
  const {
    date,
    view,
    events,
    setDate,
    setView,
    handlePrevious,
    handleNext,
    handleToday,
  } = useCalendar()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {format(date, "MMMM yyyy", {locale: fr})}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Semaine {format(date, "w", {locale: fr})}
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

      {view === "week" ? (
        <WeekView date={date} onNavigate={setDate} events={events} />
      ) : (
        <MonthView date={date} onNavigate={setDate} events={events} />
      )}
    </>
  )
}
