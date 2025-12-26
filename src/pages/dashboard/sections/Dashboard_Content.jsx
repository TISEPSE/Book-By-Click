import React, { useState, useEffect } from "react"
import { 
  Search, Calendar, Clock, User, Eye, 
  Edit2, X, Check, Loader2, Mail, MessageSquare, Info
} from "lucide-react"

// --- DONNÉES DE TEST (MOCK DATA) ---
// Ces données imitent ce que ton fichier reservation.py renverra
const TEST_DATA = [
  {
    "id": "RDV-001",
    "db_id": 1,
    "clientName": "Sophie Martin",
    "clientEmail": "sophie.martin@email.com",
    "service": "Coupe Femme & Brushing",
    "duration": "45 min",
    "price": 55.0,
    "date": "2025-12-26",
    "time": "14:30",
    "status": "confirmed",
    "notes": "Première visite, veut un dégradé."
  },
  {
    "id": "RDV-002",
    "db_id": 2,
    "clientName": "Thomas Dubois",
    "clientEmail": "t.dubois@gmail.com",
    "service": "Taille de Barbe",
    "duration": "20 min",
    "price": 25.0,
    "date": "2025-12-26",
    "time": "16:15",
    "status": "pending",
    "notes": ""
  },
  {
    "id": "RDV-003",
    "db_id": 3,
    "clientName": "Marie Lefebvre",
    "clientEmail": "m.lefebvre@outlook.fr",
    "service": "Soin Visage Hydratant",
    "duration": "60 min",
    "price": 75.0,
    "date": "2025-12-27",
    "time": "10:00",
    "status": "pending",
    "notes": "Allergie aux produits à base de noix."
  }
];

const STATUS_CONFIG = {
  confirmed: { 
    label: "Confirmée", 
    color: "bg-green-100 text-green-700 border-green-200", 
    icon: Check 
  },
  pending: { 
    label: "En attente", 
    color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
    icon: Clock 
  },
}

const ReservationsContent = () => {
  // REMARQUE : Pour le test, on initialise avec TEST_DATA. 
  // En production, utilise useState([]) et setLoading(true)
  const [reservations, setReservations] = useState(TEST_DATA)
  const [loading, setLoading] = useState(false) 
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // --- APPELS API ---
  
  // Fonction pour charger les données réelles (à activer plus tard)
  const fetchReservations = async () => {
    try {
      // const response = await fetch("http://127.0.0.1:5000/api/entreprise/reservations")
      // const data = await response.json()
      // setReservations(data)
    } catch (error) {
      console.error("Erreur API:", error)
    }
  }

  // Fonction pour mettre à jour le statut
  const handleStatusUpdate = async (db_id, currentStatus) => {
    const nextStatus = currentStatus === "confirmed" ? "pending" : "confirmed"
    
    // Simulation mise à jour locale (Optimistic UI)
    setReservations(prev => 
      prev.map(res => res.db_id === db_id ? { ...res, status: nextStatus } : res)
    )

    // Code API réel :
    /*
    try {
      await fetch(`http://127.0.0.1:5000/api/reservations/${db_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      })
    } catch (err) { console.error(err) }
    */
  }

  // --- FILTRAGE ---
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = 
      res.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase())

    const today = "2025-12-26" // Fixé pour le test, sinon utiliser new Date()...
    let matchesTab = true
    if (activeFilter === "today") matchesTab = res.date === today
    if (activeFilter === "pending") matchesTab = res.status === "pending"

    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Réservations</h1>
          <p className="text-gray-500">Gérez les rendez-vous et les clients de votre entreprise</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
            <span className="flex size-3 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Live Backend Connecté</span>
        </div>
      </div>

      {/* Barre d'outils (Recherche & Filtres) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client (ex: Martin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          {["all", "today", "pending"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeFilter === filter 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter === "all" ? "Toutes" : filter === "today" ? "Aujourd'hui" : "En attente"}
            </button>
          ))}
        </div>
      </div>

      {/* Table des données */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Prestation</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <tr key={res.db_id} className="hover:bg-indigo-50/30 transition-colors group">
                    {/* Colonne Client */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-indigo-200 shadow-lg">
                          {res.clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{res.clientName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="size-3" /> {res.clientEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Colonne Prestation */}
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{res.service}</div>
                      <div className="text-xs text-indigo-600 font-bold">{res.price}€ <span className="text-gray-300 font-normal">|</span> {res.duration}</div>
                      {res.notes && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-orange-600 italic">
                          <MessageSquare className="size-3" /> {res.notes}
                        </div>
                      )}
                    </td>

                    {/* Colonne Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar className="size-4 text-gray-400" /> {res.date}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                        <Clock className="size-4" /> {res.time}
                      </div>
                    </td>

                    {/* Colonne Statut */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[res.status].color}`}>
                        <span className={`size-1.5 rounded-full ${res.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                        {STATUS_CONFIG[res.status].label}
                      </span>
                    </td>

                    {/* Colonne Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleStatusUpdate(res.db_id, res.status)}
                          className={`p-2 rounded-xl transition-all shadow-sm border ${
                            res.status === "pending" 
                            ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                            : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50"
                          }`}
                        >
                          {res.status === "pending" ? <Check className="size-5" /> : <X className="size-5" />}
                        </button>
                        <button className="p-2 bg-white text-gray-400 border border-gray-200 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                          <Eye className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Info className="size-10" />
                      <p className="text-lg font-medium">Aucun résultat trouvé pour votre recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReservationsContent