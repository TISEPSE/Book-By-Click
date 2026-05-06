import { useState, useEffect } from "react"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { TrendingUp, Users, Calendar, Euro, Activity, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

const COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"]

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 text-white p-2 rounded border border-gray-600 text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}{unit}</p>
      ))}
    </div>
  )
}

export default function StatisticsContent() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/api/entreprise/statistiques", { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject("Erreur"))
      .then(d => setData(d))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-sm">Chargement des statistiques…</span>
    </div>
  )

  if (error || !data) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error || "Erreur"}</div>
  )

  const { kpis, revenueByMonth, topServices } = data

  const kpiCards = [
    { label: "Total réservations", value: kpis.total,                     icon: Calendar,    color: "bg-indigo-50 text-indigo-600" },
    { label: "Confirmées",         value: kpis.confirmed,                  icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "En attente",         value: kpis.pending,                    icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
    { label: "Annulées",           value: kpis.cancelled,                  icon: XCircle,     color: "bg-red-50 text-red-500" },
    { label: "CA total",           value: `${kpis.revenue.toFixed(0)} €`,  icon: Euro,        color: "bg-purple-50 text-purple-600" },
    { label: "Clients uniques",    value: kpis.clientCount,                icon: Users,       color: "bg-blue-50 text-blue-600" },
    { label: "Créneaux générés",   value: kpis.creneauxTotal,              icon: Activity,    color: "bg-gray-50 text-gray-600" },
    { label: "Taux d'occupation",  value: `${kpis.occupancyRate} %`,       icon: TrendingUp,  color: "bg-teal-50 text-teal-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Statistiques</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* CA par mois */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">Chiffre d'affaires (6 derniers mois)</h2>
          </div>
          <div className="p-4">
            {revenueByMonth.every(m => m.revenue === 0) ? (
              <p className="text-sm text-gray-400 text-center py-8">Aucun revenu confirmé sur cette période.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip content={<CustomTooltip unit=" €" />} />
                  <Line type="monotone" dataKey="revenue" name="CA" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top services */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">Top prestations</h2>
          </div>
          <div className="p-4">
            {topServices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Aucune réservation enregistrée.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topServices} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={11} />
                    <YAxis dataKey="name" type="category" width={110} stroke="#6b7280" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Réservations" radius={[0, 4, 4, 0]}>
                      {topServices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1">
                  {topServices.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {s.name}
                      </span>
                      <span className="font-medium">{s.count} RDV · {s.revenue.toFixed(0)} €</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Répartition statuts */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Répartition des réservations</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "Confirmées",  value: kpis.confirmed, color: "#059669" },
            { label: "En attente",  value: kpis.pending,   color: "#d97706" },
            { label: "Annulées",    value: kpis.cancelled, color: "#dc2626" },
          ].map(({ label, value, color }) => (
            <div key={label} className="space-y-1">
              <p className="text-3xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{
                  backgroundColor: color,
                  width: kpis.total > 0 ? `${Math.round(value / kpis.total * 100)}%` : "0%"
                }} />
              </div>
              <p className="text-xs text-gray-400">
                {kpis.total > 0 ? Math.round(value / kpis.total * 100) : 0} %
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
