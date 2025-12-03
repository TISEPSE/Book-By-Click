"use client"

import {Calendar as BigCalendar, dateFnsLocalizer} from "react-big-calendar"
import {format, parse, startOfWeek, getDay} from "date-fns"
import {fr} from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

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

const DayHeader = ({date}) => {
  const isToday = new Date().toDateString() === date.toDateString()
  const dayName = format(date, "EEE", {locale: fr})
  const dayNumber = format(date, "dd")

  return (
    <div className="flex items-center justify-center py-3 h-full">
      {isToday ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium text-gray-700">{dayName}</span>
          <span className="bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
            {dayNumber}
          </span>
        </div>
      ) : (
        <span className="text-sm font-medium text-gray-700">
          {dayName} {dayNumber}
        </span>
      )}
    </div>
  )
}

export default function WeekView({date, onNavigate, events = []}) {
  const eventStyleGetter = event => ({
    style: {
      backgroundColor: event.color || "#6366f1",
      color: "white",
      padding: "4px 8px",
      fontSize: "12px",
    },
  })

  const minTime = new Date()
  minTime.setHours(6, 0, 0, 0)

  const maxTime = new Date()
  maxTime.setHours(20, 0, 0, 0)

  return (
    <div className="w-full h-[1000px]">
      <BigCalendar
        localizer={localizer}
        culture="fr"
        messages={messages}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={onNavigate}
        view="week"
        views={["week"]}
        min={minTime}
        max={maxTime}
        step={30}
        timeslots={2}
        components={{
          week: {
            header: DayHeader,
          },
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
  )
}
