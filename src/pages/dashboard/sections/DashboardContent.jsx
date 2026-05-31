import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  Euro, ArrowRight, Search,
} from "lucide-react"
import { format, isToday, isTomorrow, isFuture, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

const STATUS_LABELS = {
  confirmed: { label: "Confirmé",   classes: "bg-emerald-100 text-emerald-700", Icon: CheckCircle },
  pending:   { label: "En attente", classes: "bg-amber-100 text-amber-700",     Icon: AlertCircle },
  cancelled: { label: "Annulé",     classes: "bg-red-100 text-red-500",         Icon: XCircle },
}

function formatRdvDate(dateStr, timeStr) {
  const d = parseISO(dateStr)
  if (isToday(d))    return `Aujourd'hui à ${timeStr}`
  if (isTomorrow(d)) return `Demain à ${timeStr}`
  return format(d, "EEE d MMM", { locale: fr }) + ` à ${timeStr}`
}

/* ───────── VUE CLIENT ───────── */
function ClientDashboard({ reservations, loading, navigate }) {
  const active = reservations.filter(
    (r) => r.status !== "cancelled" && isFuture(parseISO(r.date))
  )
  const pending   = reservations.filter((r) => r.status === "pending").length
  const confirmed = reservations.filter((r) => r.status === "confirmed").length
  const cancelled = reservations.filter((r) => r.status === "cancelled").length
  const next3 = active
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3)

  const kpis = [
    { label: "Total réservations", value: reservations.length, icon: Calendar, color: "bg-indigo-50 text-indigo-600" },
    { label: "Confirmés",          value: confirmed,            icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "En attente",         value: pending,              icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
    { label: "Annulés",            value: cancelled,            icon: XCircle,     color: "bg-red-50 text-red-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue, voici un résumé de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prochains RDV + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Prochains rendez-vous */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Prochains rendez-vous</h2>
            <button
              onClick={() => navigate("?section=reservations")}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : next3.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aucun rendez-vous à venir</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {next3.map((r) => {
                const st = STATUS_LABELS[r.status]
                return (
                  <div key={r.db_id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${st.color} shrink-0`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.entrepriseName}</p>
                      <p className="text-xs text-gray-500">{r.service}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-gray-700">{formatRdvDate(r.date, r.time)}</p>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${st.classes}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA recherche */}
        <div className="bg-indigo-600 rounded-xl p-5 flex flex-col justify-between text-white">
          <div>
            <Search className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-base font-semibold">Trouver un professionnel</p>
            <p className="text-sm opacity-75 mt-1">Recherchez par service ou localisation</p>
          </div>
          <button
            onClick={() => navigate("/result")}
            className="mt-4 w-full px-4 py-2.5 bg-white text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── VUE PRO ───────── */
function ProDashboard({ reservations, loading, navigate }) {
  const today = new Date().toISOString().slice(0, 10)

  const todayRdv    = reservations.filter((r) => r.status !== "cancelled" && r.date === today)
  const upcomingRdv = reservations.filter((r) => r.status !== "cancelled" && r.date > today)
  const pending     = reservations.filter((r) => r.status === "pending")
  const revenue     = reservations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + (r.price || 0), 0)

  const next5 = [...reservations]
    .filter((r) => r.status !== "cancelled" && r.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5)

  const kpis = [
    { label: "Aujourd'hui",    value: todayRdv.length,    icon: Calendar,    color: "bg-indigo-50 text-indigo-600" },
    { label: "À venir",        value: upcomingRdv.length, icon: Clock,       color: "bg-blue-50 text-blue-600" },
    { label: "En attente",     value: pending.length,     icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
    { label: "CA confirmé",    value: `${revenue.toFixed(0)} €`, icon: Euro, color: "bg-emerald-50 text-emerald-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prochains rendez-vous — pleine largeur */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Prochains rendez-vous</h2>
          <button
            onClick={() => navigate("/dashboard_entreprise?section=reservations")}
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : next5.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun rendez-vous à venir</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {next5.map((r) => {
              const st = STATUS_LABELS[r.status]
              return (
                <div key={r.db_id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.clientName}</p>
                    <p className="text-xs text-gray-500">{r.service}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-700">{formatRdvDate(r.date, r.time)}</p>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${st.classes}`}>
                      {st.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0 w-14">
                    <p className="text-sm font-semibold text-gray-900">{r.price.toFixed(0)} €</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────── COMPOSANT PRINCIPAL ───────── */
export default function DashboardContent({ isPro = false }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const endpoint = isPro
      ? "http://localhost:5000/api/entreprise/reservations"
      : "http://localhost:5000/api/client/reservations"
    // Les réservations d'entreprises bloquées sont filtrées côté API

    fetch(endpoint, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setReservations(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isPro])

  return isPro
    ? <ProDashboard reservations={reservations} loading={loading} navigate={navigate} />
    : <ClientDashboard reservations={reservations} loading={loading} navigate={navigate} />
}
