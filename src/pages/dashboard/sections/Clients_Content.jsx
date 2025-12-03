const ClientsContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">👥 Clients</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Gestion de votre clientèle.</p>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Ajouter un client
          </button>
        </div>
      </div>
    </div>
  )
}
export default ClientsContent