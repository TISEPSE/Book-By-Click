const CalendarContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📅 Calendrier</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Voici votre calendrier des rendez-vous.</p>
        <div className="mt-4 h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
          <p className="text-gray-500">Calendrier ici</p>
        </div>
      </div>
    </div>
  )
}
export default CalendarContent