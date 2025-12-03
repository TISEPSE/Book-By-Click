"use client"

import {useState, useMemo} from "react"
import {Calendar as BigCalendar, dateFnsLocalizer} from "react-big-calendar"
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns"
import {fr} from "date-fns/locale"
import {ChevronLeft, ChevronRight} from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const calendarStyles = `
  .rbc-month-view {
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  .rbc-month-row {
    min-height: 180px;
  }
  .rbc-date-cell {
    padding: 10px;
  }
  .rbc-header {
    padding: 12px 6px !important;
    color : #717680 !important;
  }
  .rbc-day-bg {
    background-color: white;
  }
  .rbc-now .rbc-button-link {
    background-color: #6366f1;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .rbc-off-range-bg {
    background-color: #f3f4f6 !important;
  }
`

const messages = {
  allDay: "Toute la journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun événement dans cette période",
  showMore: total => `+${total} plus`,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), {locale: fr}),
  getDay,
  locales: {fr},
})

export default function Calendar() {
  const [date, setDate] = useState(new Date())

  const events = useMemo(
    () => [
      {
        id: 1,
        title: "Marketing site kickoff",
        start: new Date(2025, 0, 15, 14, 30),
        end: new Date(2025, 0, 15, 16, 0),
        color: "#6366f1",
      },
      {
        id: 2,
        title: "One-on-one w/ Eva",
        start: new Date(2025, 0, 20, 10, 0),
        end: new Date(2025, 0, 20, 11, 0),
        color: "#8b5cf6",
      },
      {
        id: 3,
        title: "Lunch with Olivia",
        start: new Date(2025, 0, 22, 12, 0),
        end: new Date(2025, 0, 22, 13, 30),
        color: "#10b981",
      },
    ],
    []
  )

  const eventStyleGetter = event => ({
    style: {
      backgroundColor: event.color,
      borderRadius: "6px",
      border: "none",
      color: "white",
      padding: "4px 8px",
      fontSize: "12px",
    },
  })

  return (
    <>
      <style jsx global>
        {calendarStyles}
      </style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(date, "MMMM yyyy", {locale: fr})}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Semaine {format(date, "w", {locale: fr})}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(subMonths(date, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setDate(addMonths(date, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="w-full h-[1000px]">
        <BigCalendar
          localizer={localizer}
          culture="fr"
          messages={messages}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          onNavigate={setDate}
          view="month"
          views={["month", "week", "day"]}
          components={{
            event: ({event}) => (
              <div className="p-1">
                <span className="text-white text-xs">{event.title}</span>
              </div>
            ),
            toolbar: () => null,
          }}
          eventPropGetter={eventStyleGetter}
          style={{height: "100%"}}
        />
      </div>
    </>
  )
}
