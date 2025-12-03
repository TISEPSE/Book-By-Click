const StatisticsContent = () => {
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Vos statistiques et analyses.</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded">Taux de remplissage: 85%</div>
          <div className="p-4 bg-green-50 rounded">CA mensuel: 5 200€</div>
        </div>
      </div>
    </div>
  )
}
export default StatisticsContent