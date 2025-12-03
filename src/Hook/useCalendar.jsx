import {useState} from "react"
import {addMonths, subMonths, addWeeks, subWeeks} from "date-fns"

export function useCalendar() {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState("month")

  const events = []

  const handlePrevious = () => {
    if (view === "month") {
      setDate(subMonths(date, 1))
    } else {
      setDate(subWeeks(date, 1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setDate(addMonths(date, 1))
    } else {
      setDate(addWeeks(date, 1))
    }
  }

  const handleToday = () => {
    setDate(new Date())
  }

  return {
    date,
    view,
    events,
    setDate,
    setView,
    handlePrevious,
    handleNext,
    handleToday,
  }
}
