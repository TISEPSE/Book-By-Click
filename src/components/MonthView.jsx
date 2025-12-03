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

export default function MonthView({date, onNavigate, events = []}) {
  const eventStyleGetter = event => ({
    style: {
      backgroundColor: event.color,
      color: "white",
      padding: "4px 8px",
      fontSize: "12px",
    },
  })

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
        view="month"
        views={["month"]}
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
  )
}
