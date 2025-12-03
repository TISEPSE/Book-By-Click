import {useState} from "react"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts"
import {
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, Star, 
  Activity, Target, ArrowUpRight, ArrowDownRight
} from "lucide-react"

export default function DashboardEntrepreneur() {
  // Filtres
  const [dateRange, setDateRange] = useState("30jours")
  const [selectedService, setSelectedService] = useState("all")

  // Données CA sur 12 mois
  const revenueData = [
    {month: "Jan", ca: 4200, objectif: 5000},
    {month: "Fév", ca: 4800, objectif: 5000},
    {month: "Mar", ca: 5200, objectif: 5500},
    {month: "Avr", ca: 5800, objectif: 5500},
    {month: "Mai", ca: 6100, objectif: 6000},
    {month: "Jun", ca: 5900, objectif: 6000},
    {month: "Jul", ca: 6500, objectif: 6500},
    {month: "Aoû", ca: 6800, objectif: 6500},
    {month: "Sep", ca: 7200, objectif: 7000},
    {month: "Oct", ca: 7800, objectif: 7500},
    {month: "Nov", ca: 8200, objectif: 8000},
    {month: "Déc", ca: 8500, objectif: 8500},
  ]

  // Répartition des revenus par service
  const revenueByService = [
    {name: "Coworking", value: 35, color: "#6366f1"},
    {name: "Salles de réunion", value: 25, color: "#10b981"},
    {name: "Bureaux privés", value: 20, color: "#f59e0b"},
    {name: "Formations", value: 12, color: "#ef4444"},
    {name: "Événements", value: 8, color: "#8b5cf6"},
  ]

  // Réservations par service
  const bookingsData = [
    {service: "Coworking", bookings: 156, hours: 1248},
    {service: "Réunion 4p", bookings: 89, hours: 356},
    {service: "Réunion 8p", bookings: 45, hours: 270},
    {service: "Bureau 2p", bookings: 32, hours: 512},
    {service: "Bureau 4p", bookings: 18, hours: 288},
  ]

  // Taux de remplissage par jour
  const occupancyData = [
    {day: "Lun", rate: 85},
    {day: "Mar", rate: 92},
    {day: "Mer", rate: 88},
    {day: "Jeu", rate: 95},
    {day: "Ven", rate: 98},
    {day: "Sam", rate: 45},
    {day: "Dim", rate: 30},
  ]

  // Satisfaction clients
  const satisfactionData = [
    {category: "Accueil", score: 4.8},
    {category: "WiFi", score: 4.6},
    {category: "Équipement", score: 4.7},
    {category: "Propreté", score: 4.9},
    {category: "Prix", score: 4.2},
    {category: "Localisation", score: 4.5},
  ]

  // Tableau des réservations récentes
  const recentBookings = [
    {id: "BK001", client: "Marie Dupont", service: "Salle 4p", date: "2024-01-15", amount: 85, status: "confirmé"},
    {id: "BK002", client: "Tech Startup", service: "Coworking", date: "2024-01-15", amount: 450, status: "confirmé"},
    {id: "BK003", client: "Paul Martin", service: "Bureau 2p", date: "2024-01-14", amount: 320, status: "en attente"},
    {id: "BK004", client: "Sophie Bernard", service: "Formation", date: "2024-01-14", amount: 1200, status: "confirmé"},
  ]

  // KPIs avec évolution
  const kpis = [
    {
      title: "CA Mensuel",
      value: "8 500€",
      evolution: {type: "up", value: 12.5},
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Réservations",
      value: "340",
      evolution: {type: "up", value: 8.2},
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Nouveaux clients",
      value: "28",
      evolution: {type: "down", value: 3.1},
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Taux conversion",
      value: "24%",
      evolution: {type: "up", value: 5.4},
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Satisfaction",
      value: "4.6/5",
      evolution: {type: "up", value: 2.8},
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Remplissage moyen",
      value: "82%",
      evolution: {type: "up", value: 6.7},
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord Entrepreneur</h1>
          <p className="text-gray-600">Analysez votre performance et prenez des décisions éclairées</p>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button onClick={() => setDateRange("7jours")} className={`px-4 py-2 rounded-lg ${dateRange === "7jours" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>7 jours</button>
            <button onClick={() => setDateRange("30jours")} className={`px-4 py-2 rounded-lg ${dateRange === "30jours" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>30 jours</button>
            <button onClick={() => setDateRange("90jours")} className={`px-4 py-2 rounded-lg ${dateRange === "90jours" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>90 jours</button>
            <button onClick={() => setDateRange("1an")} className={`px-4 py-2 rounded-lg ${dateRange === "1an" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>1 an</button>
          </div>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="all">Tous les services</option>
            <option value="coworking">Coworking</option>
            <option value="reunion">Salles de réunion</option>
            <option value="bureau">Bureaux privés</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`size-6 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${kpi.evolution.type === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.evolution.type === "up" ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                    {kpi.evolution.value}%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            )
          })}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* CA sur 12 mois */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Évolution du chiffre d'affaires</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ca" stroke="#6366f1" name="CA réel" strokeWidth={2} />
                <Line type="monotone" dataKey="objectif" stroke="#94a3b8" name="Objectif" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par service */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Répartition CA par service</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueByService} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {revenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Réservations par service */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Réservations par service</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366f1" name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Taux de remplissage */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Taux de remplissage par jour</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction et objectifs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Satisfaction clients</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={satisfactionData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar name="Score" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Objectifs vs Réalisation */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Objectifs vs Réalisation</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CA Annuel</span>
                  <span>85 200€ / 100 000€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{width: "85.2%"}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nouveaux clients</span>
                  <span>156 / 200</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{width: "78%"}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de remplissage</span>
                  <span>82% / 90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full" style={{width: "91%"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Réservations récentes */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Réservations récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.id}</td>
                    <td className="p-3">{booking.client}</td>
                    <td className="p-3">{booking.service}</td>
                    <td className="p-3">{booking.date}</td>
                    <td className="p-3 font-medium">{booking.amount}€</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${booking.status === "confirmé" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}