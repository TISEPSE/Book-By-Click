import { useState } from "react"
import {
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Edit2,
  X,
  Check,
} from "lucide-react"

// Mock data for demonstration - represents diverse reservation scenarios
const MOCK_RESERVATIONS = [
  {
    id: "RDV-001",
    clientName: "Sophie Martin",
    clientEmail: "sophie.martin@email.com",
    service: "Consultation Premium",
    date: "2025-12-03",
    time: "14:30",
    duration: "60 min",
    status: "confirmed",
    notes: "Première visite",
  },
  {
    id: "RDV-002",
    clientName: "Thomas Dubois",
    clientEmail: "thomas.dubois@email.com",
    service: "Service Standard",
    date: "2025-12-03",
    time: "15:45",
    duration: "45 min",
    status: "pending",
    notes: "",
  },
  {
    id: "RDV-003",
    clientName: "Marie Lefebvre",
    clientEmail: "marie.lefebvre@email.com",
    service: "Consultation Express",
    date: "2025-12-03",
    time: "16:30",
    duration: "30 min",
    status: "confirmed",
    notes: "Client régulier",
  },
  {
    id: "RDV-004",
    clientName: "Jean Moreau",
    clientEmail: "jean.moreau@email.com",
    service: "Service Premium",
    date: "2025-12-04",
    time: "10:00",
    duration: "90 min",
    status: "confirmed",
    notes: "",
  },
  {
    id: "RDV-005",
    clientName: "Claire Bernard",
    clientEmail: "claire.bernard@email.com",
    service: "Consultation Standard",
    date: "2025-12-04",
    time: "11:30",
    duration: "45 min",
    status: "pending",
    notes: "Demande spécifique",
  },
  {
    id: "RDV-006",
    clientName: "Pierre Rousseau",
    clientEmail: "pierre.rousseau@email.com",
    service: "Service Express",
    date: "2025-12-02",
    time: "14:00",
    duration: "30 min",
    status: "completed",
    notes: "",
  },
  {
    id: "RDV-007",
    clientName: "Isabelle Laurent",
    clientEmail: "isabelle.laurent@email.com",
    service: "Consultation Premium",
    date: "2025-12-02",
    time: "09:30",
    duration: "60 min",
    status: "completed",
    notes: "",
  },
  {
    id: "RDV-008",
    clientName: "Luc Bonnet",
    clientEmail: "luc.bonnet@email.com",
    service: "Service Standard",
    date: "2025-12-01",
    time: "16:00",
    duration: "45 min",
    status: "cancelled",
    notes: "Annulé par le client",
  },
]

// Status badge configuration with color coding
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmée",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: Check,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: X,
  },
  completed: {
    label: "Terminée",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Check,
  },
}

// Status badge component for reusability
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

const ReservationsContent = () => {
  // State management for filters and search
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter reservations based on active filter and search query
  const filteredReservations = MOCK_RESERVATIONS.filter((reservation) => {
    // Filter by status/date
    let matchesFilter = true
    if (activeFilter === "today") {
      matchesFilter = reservation.date === "2025-12-03"
    } else if (activeFilter === "upcoming") {
      matchesFilter = reservation.date >= "2025-12-03" && reservation.status !== "completed"
    } else if (activeFilter === "past") {
      matchesFilter = reservation.status === "completed" || reservation.status === "cancelled"
    }

    // Filter by search query (client name or reservation ID)
    const matchesSearch =
      reservation.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header with Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez toutes vos réservations et rendez-vous
        </p>
      </div>


      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou numéro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "all", label: "Toutes" },
              { id: "today", label: "Aujourd'hui" },
              { id: "upcoming", label: "À venir" },
              { id: "past", label: "Passées" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations List - Desktop Table View */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
          <div className="col-span-2">Numéro</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Service</div>
          <div className="col-span-2">Date & Heure</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Reservations List */}
        <div className="divide-y divide-gray-200">
          {filteredReservations.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Calendar className="size-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Aucune réservation trouvée
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {searchQuery
                  ? "Aucune réservation ne correspond à votre recherche."
                  : "Vous n'avez pas encore de réservations. Créez-en une pour commencer."}
              </p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                {/* Desktop View - Grid Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Reservation ID */}
                  <div className="col-span-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {reservation.id}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 size-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-700">
                          {reservation.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.clientName}
                        </p>
                        <p className="text-xs text-gray-500">{reservation.clientEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-900">{reservation.service}</p>
                    <p className="text-xs text-gray-500">{reservation.duration}</p>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="size-4 text-gray-400" />
                      <span>
                        {new Date(reservation.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock className="size-3 text-gray-400" />
                      <span>{reservation.time}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={reservation.status} />
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Voir les détails"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    {reservation.status === "pending" && (
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Confirmer"
                      >
                        <Check className="size-4" />
                      </button>
                    )}
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Annuler"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile View - Card Layout */}
                <div className="lg:hidden p-4 space-y-3">
                  {/* Card Header - Client & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 size-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-700">
                          {reservation.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {reservation.clientName}
                        </p>
                        <p className="text-xs text-gray-500">{reservation.id}</p>
                      </div>
                    </div>
                    <StatusBadge status={reservation.status} />
                  </div>

                  {/* Card Body - Service & Date/Time */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="size-4 text-gray-400 flex-shrink-0" />
                      <span>{reservation.service}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{reservation.duration}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="size-4 text-gray-400" />
                        <span>
                          {new Date(reservation.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="size-4 text-gray-400" />
                        <span>{reservation.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
                      <Eye className="size-4" />
                      <span>Voir</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
                      <Edit2 className="size-4" />
                      <span>Modifier</span>
                    </button>
                    {reservation.status === "pending" ? (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all">
                        <Check className="size-4" />
                        <span>Confirmer</span>
                      </button>
                    ) : (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                        <X className="size-4" />
                        <span>Annuler</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Pagination or Load More (Visual only) */}
        {filteredReservations.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-500">
                Affichage de {filteredReservations.length} sur {MOCK_RESERVATIONS.length}{" "}
                réservations
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Précédent
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationsContent
