import {useState} from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Clock,
  Building2,
  Briefcase,
} from "lucide-react"

export default function BusinessAnalytics() {
  const [dateRange, setDateRange] = useState("30jours")
  const [selectedService, setSelectedService] = useState("all")

  const revenueData = [
    {month: "Jan", ca: 4200, objectif: 5000, prev: 3800},
    {month: "Fév", ca: 4800, objectif: 5000, prev: 4200},
    {month: "Mar", ca: 5200, objectif: 5500, prev: 4800},
    {month: "Avr", ca: 5800, objectif: 5500, prev: 5200},
    {month: "Mai", ca: 6100, objectif: 6000, prev: 5800},
    {month: "Jun", ca: 5900, objectif: 6000, prev: 6100},
    {month: "Jul", ca: 6500, objectif: 6500, prev: 5900},
    {month: "Aoû", ca: 6800, objectif: 6500, prev: 6500},
    {month: "Sep", ca: 7200, objectif: 7000, prev: 6800},
    {month: "Oct", ca: 7800, objectif: 7500, prev: 7200},
    {month: "Nov", ca: 8200, objectif: 8000, prev: 7800},
    {month: "Déc", ca: 8500, objectif: 8500, prev: 8200},
  ]

  const revenueByService = [
    {name: "Coworking", value: 35, color: "#2563eb", growth: 12},
    {name: "Salles de réunion", value: 25, color: "#059669", growth: 8},
    {name: "Bureaux privés", value: 20, color: "#d97706", growth: -3},
    {name: "Formations", value: 12, color: "#dc2626", growth: 15},
    {name: "Événements", value: 8, color: "#7c3aed", growth: 5},
  ]

  const bookingsData = [
    {service: "Coworking", bookings: 156, hours: 1248, trend: "up"},
    {service: "Réunion 4p", bookings: 89, hours: 356, trend: "up"},
    {service: "Réunion 8p", bookings: 45, hours: 270, trend: "down"},
    {service: "Bureau 2p", bookings: 32, hours: 512, trend: "stable"},
    {service: "Bureau 4p", bookings: 18, hours: 288, trend: "up"},
  ]

  const occupancyData = [
    {day: "Lun", rate: 85, lastWeek: 78},
    {day: "Mar", rate: 92, lastWeek: 85},
    {day: "Mer", rate: 88, lastWeek: 82},
    {day: "Jeu", rate: 95, lastWeek: 88},
    {day: "Ven", rate: 98, lastWeek: 92},
    {day: "Sam", rate: 45, lastWeek: 40},
    {day: "Dim", rate: 30, lastWeek: 25},
  ]

  const satisfactionData = [
    {category: "Accueil", score: 4.8, prev: 4.6},
    {category: "WiFi", score: 4.6, prev: 4.5},
    {category: "Équipement", score: 4.7, prev: 4.8},
    {category: "Propreté", score: 4.9, prev: 4.7},
    {category: "Prix", score: 4.2, prev: 4.0},
    {category: "Localisation", score: 4.5, prev: 4.4},
  ]

  const kpis = [
    {
      title: "CA Mensuel",
      value: "8 500€",
      evolution: {type: "up", value: 12.5},
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
      detail: "vs. 7 560€ prévu",
    },
    {
      title: "Réservations",
      value: "340",
      evolution: {type: "up", value: 8.2},
      icon: Calendar,
      color: "bg-blue-100 text-blue-700",
      detail: "32 en attente",
    },
    {
      title: "Nouveaux clients",
      value: "28",
      evolution: {type: "down", value: 3.1},
      icon: Users,
      color: "bg-violet-100 text-violet-700",
      detail: "dont 12 abonnés",
    },
    {
      title: "Taux conversion",
      value: "24%",
      evolution: {type: "up", value: 5.4},
      icon: Target,
      color: "bg-amber-100 text-amber-700",
      detail: "vs. 18% moy. secteur",
    },
    {
      title: "Satisfaction",
      value: "4.6/5",
      evolution: {type: "up", value: 2.8},
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
      detail: "sur 127 avis",
    },
    {
      title: "Remplissage moyen",
      value: "82%",
      evolution: {type: "up", value: 6.7},
      icon: Activity,
      color: "bg-indigo-100 text-indigo-700",
      detail: "+12pts vs. dern. mois",
    },
  ]

  const CustomTooltip = ({active, payload, label, unit = ""}) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 rounded border border-gray-600 text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((pld, idx) => (
            <p key={idx} className="text-xs" style={{color: pld.color}}>
              {pld.name}: {pld.value}
              {unit}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filtres - Style identique à la page réservations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Période d'analyse
              </span>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
              {[
                {id: "7jours", label: "7j"},
                {id: "30jours", label: "30j"},
                {id: "90jours", label: "90j"},
                {id: "1an", label: "1an"},
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setDateRange(option.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    dateRange === option.id
                      ? "bg-white text-gray-900 shadow-sm border border-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="all">Tous services</option>
              <option value="coworking">Coworking</option>
              <option value="reunion">Salles de réunion</option>
              <option value="bureau">Bureaux privés</option>
              <option value="formation">Formations</option>
              <option value="evenement">Événements</option>
            </select>
          </div>
        </div>

        {/* KPIs - Cards plus structurées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            const EvolutionIcon =
              kpi.evolution.type === "up" ? ArrowUpRight : ArrowDownRight
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 ${kpi.color} rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      kpi.evolution.type === "up"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <EvolutionIcon className="w-3 h-3" />
                    {kpi.evolution.value}%
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1 uppercase tracking-wider">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.detail}</p>
              </div>
            )
          })}
        </div>

        {/* Section CA - Header avec bordure */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Évolution du chiffre d'affaires
            </h2>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>Réel
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Objectif
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>An
                dernier
              </span>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} className="cursor-pointer">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip content={<CustomTooltip unit="€" />} />
                <Line
                  type="monotone"
                  dataKey="ca"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{r: 3}}
                />
                <Line
                  type="monotone"
                  dataKey="objectif"
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="prev"
                  stroke="#d1d5db"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deux colonnes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Répartition par service */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Répartition CA par service
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 mb-4">
                {revenueByService.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{backgroundColor: item.color}}
                      ></span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {item.value}%
                      </span>
                      <span
                        className={`text-xs ml-1 ${
                          item.growth > 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        ({item.growth > 0 ? "+" : ""}
                        {item.growth}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={revenueByService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={1}
                  >
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={value => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Réservations par service */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Réservations par service
              </h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={bookingsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={11} />
                  <YAxis
                    dataKey="service"
                    type="category"
                    width={90}
                    stroke="#6b7280"
                    fontSize={11}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="bookings"
                    fill="#2563eb"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">340</p>
                </div>
                <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500">Heures</p>
                  <p className="text-lg font-bold text-gray-900">2 674h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupation et Satisfaction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupation par jour */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Taux de remplissage par jour
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {occupancyData.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {day.day}
                    </p>
                    <div
                      className={`rounded-lg text-white font-bold p-2 text-xs ${
                        day.rate > 90
                          ? "bg-emerald-600"
                          : day.rate > 70
                          ? "bg-blue-600"
                          : day.rate > 50
                          ? "bg-amber-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {day.rate}%
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip content={<CustomTooltip unit="%" />} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.1}
                    strokeWidth={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Satisfaction */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Satisfaction clients
              </h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={satisfactionData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{fontSize: 11, fill: "#6b7280"}}
                  />
                  <PolarRadiusAxis
                    domain={[0, 5]}
                    tickCount={6}
                    tick={{fontSize: 10, fill: "#9ca3af"}}
                  />
                  <Radar
                    name="Actuel"
                    dataKey="score"
                    stroke="#d97706"
                    fill="#d97706"
                    fillOpacity={0.1}
                    strokeWidth={1}
                  />
                  <Radar
                    name="Précédent"
                    dataKey="prev"
                    stroke="#e5e7eb"
                    fill="#e5e7eb"
                    fillOpacity={0.05}
                    strokeWidth={1}
                  />
                  <Tooltip formatter={value => `${value}/5`} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Note globale</span>
                  <span className="text-xl font-bold text-gray-900">
                    4.6/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-amber-600 h-1.5 rounded-full"
                    style={{width: "92%"}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectifs vs Réalisation
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "CA Annuel",
                  current: 85200,
                  target: 100000,
                  color: "bg-blue-600",
                  icon: DollarSign,
                },
                {
                  label: "Nouveaux clients",
                  current: 156,
                  target: 200,
                  color: "bg-emerald-600",
                  icon: Users,
                },
                {
                  label: "Remplissage moyen",
                  current: 82,
                  target: 90,
                  color: "bg-violet-600",
                  icon: Activity,
                },
              ].map((goal, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <goal.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {goal.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full ${goal.color} rounded-full transition-all duration-700`}
                      style={{
                        width: `${Math.min(
                          100,
                          (goal.current / goal.target) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{goal.current.toLocaleString()}</span>
                    <span>{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
