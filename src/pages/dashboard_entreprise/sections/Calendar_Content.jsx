import Calendar from "../../../components/Calendar"

const CalendarContent = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendrier des rendez-vous</h1>
      <p className="text-gray-600 mb-6">Gérez vos événements et réservations</p>
      <Calendar />
    </div>
  )
}

export default CalendarContent