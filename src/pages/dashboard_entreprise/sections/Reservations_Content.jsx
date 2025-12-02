const ReservationsContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📋 Réservations</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Liste de toutes vos réservations.</p>
        <ul className="mt-4 space-y-2">
          <li className="p-3 bg-gray-50 rounded">RDV #001 - 14:30</li>
          <li className="p-3 bg-gray-50 rounded">RDV #002 - 15:45</li>
          <li className="p-3 bg-gray-50 rounded">RDV #003 - 16:30</li>
        </ul>
      </div>
    </div>
  )
}
export default ReservationsContent