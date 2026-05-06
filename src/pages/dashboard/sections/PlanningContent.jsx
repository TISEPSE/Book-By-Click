import { useState, useEffect, useCallback } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, endOfWeek, getDay } from "date-fns"
import { fr } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { X, Trash2, XCircle, User, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Planning unifié du tableau de bord professionnel.
 *
 * Remplace les anciens onglets "Calendrier" et "Créneaux" par une seule
 * vue agenda interactive :
 *  - Clic sur plage vide     → créer un créneau
 *  - Clic sur créneau vert   → modifier ou supprimer
 *  - Clic sur créneau rouge  → voir les infos client + annuler
 */

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
  getDay,
  locales: { fr },
})

const MESSAGES = {
  allDay: "Journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  noEventsInRange: "Aucun créneau sur cette période",
  showMore: n => `+${n} autres`,
}

// ─── Composant d'événement dans le calendrier ────────────────────────────────

function EventBlock({ event }) {
  const taken = event.extendedProps?.isTaken
  return (
    <div className="h-full flex flex-col px-1 py-0.5 overflow-hidden">
      <span className="text-[11px] font-bold leading-tight truncate">
        {taken ? event.extendedProps.clientName || "Réservé" : "Disponible"}
      </span>
      {taken && event.extendedProps.serviceName && (
        <span className="text-[10px] opacity-80 truncate leading-tight">
          {event.extendedProps.serviceName}
        </span>
      )}
      <span className="text-[10px] opacity-70 mt-auto leading-tight">
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </span>
    </div>
  )
}

// ─── Modal générique ─────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Toolbar personnalisée ────────────────────────────────────────────────────

function CustomToolbar({ date, view, onNavigate, onView }) {
  const label = view === "week"
    ? `${format(startOfWeek(date, { weekStartsOn: 1 }), "d MMM", { locale: fr })} – ${format(endOfWeek(date, { weekStartsOn: 1 }), "d MMM yyyy", { locale: fr })}`
    : format(date, "EEEE d MMMM yyyy", { locale: fr })

  const todayLabel = view === "week" ? "Cette semaine" : "Aujourd'hui"

  const btnBase = "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
  const btnNav  = `${btnBase} border border-gray-300 text-gray-700 hover:bg-gray-50`
  const btnView = (v) => `${btnBase} ${view === v ? "bg-indigo-600 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      {/* Navigation */}
      <div className="flex items-center gap-1.5">
        <button onClick={() => onNavigate("TODAY")} className={btnNav}>{todayLabel}</button>
        <button onClick={() => onNavigate("PREV")} className={`${btnNav} !px-2`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onNavigate("NEXT")} className={`${btnNav} !px-2`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Label période */}
      <span className="text-sm font-semibold text-gray-800 capitalize">{label}</span>

      {/* Switcher vue */}
      <div className="flex gap-1">
        <button onClick={() => onView("week")} className={btnView("week")}>Semaine</button>
        <button onClick={() => onView("day")}  className={btnView("day")}>Jour</button>
      </div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function PlanningContent() {
  const [events,       setEvents]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [currentView,  setCurrentView]  = useState("week")
  const [currentDate,  setCurrentDate]  = useState(new Date())

  // Modal "créer créneau"
  const [createModal,  setCreateModal]  = useState(null)
  const [createForm,   setCreateForm]   = useState({ heureDebut: "", heureFin: "", nbMax: 1 })
  const [creating,     setCreating]     = useState(false)

  // Modal "créneau disponible"
  const [editModal,    setEditModal]    = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  // Modal "créneau réservé"
  const [detailModal,  setDetailModal]  = useState(null)
  const [cancelling,   setCancelling]   = useState(false)

  // ─── Chargement des créneaux ───────────────────────────────────────────────

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/entreprise/calendrier", { credentials: "include" })
      if (!res.ok) throw new Error("Impossible de charger le planning")
      const data = await res.json()
      setEvents(data.map(e => ({
        ...e,
        start: new Date(e.start),
        end:   new Date(e.end),
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // ─── Style des événements ──────────────────────────────────────────────────

  const eventStyleGetter = (event) => {
    const taken = event.extendedProps?.isTaken
    return {
      style: {
        backgroundColor: taken ? "#FEE2E2" : "#DCFCE7",
        color:           taken ? "#991B1B" : "#166534",
        borderLeft:      `4px solid ${taken ? "#EF4444" : "#22C55E"}`,
        borderRadius:    "6px",
        border:          `1px solid ${taken ? "#FECACA" : "#BBF7D0"}`,
        fontSize:        "12px",
        fontWeight:      "600",
        cursor:          "pointer",
      },
    }
  }

  // ─── Clic sur plage vide → ouvrir modal création ───────────────────────────

  const handleSelectSlot = ({ start, end }) => {
    const pad  = n => String(n).padStart(2, "0")
    const fmt  = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`
    setCreateForm({ heureDebut: fmt(start), heureFin: fmt(end), nbMax: 1 })
    setCreateModal({ date: start })
  }

  const submitCreate = async () => {
    setCreating(true)
    const d   = createModal.date
    const pad = n => String(n).padStart(2, "0")
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    try {
      const res = await fetch("/api/entreprise/creneaux", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateHeureDebut:    `${dateStr}T${createForm.heureDebut}:00`,
          dateHeureFin:      `${dateStr}T${createForm.heureFin}:00`,
          nbMaxReservations: createForm.nbMax,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Erreur")
      setCreateModal(null)
      setLoading(true)
      await fetchEvents()
    } catch (err) { alert(err.message) }
    finally { setCreating(false) }
  }

  // ─── Clic sur créneau disponible → modifier / supprimer ───────────────────

  const handleDeleteCreneau = async (id) => {
    if (!window.confirm("Supprimer ce créneau ?")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/entreprise/creneaux/${id}`, {
        method: "DELETE", credentials: "include",
      })
      if (!res.ok) throw new Error("Erreur serveur")
      setEditModal(null)
      await fetchEvents()
    } catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  // ─── Clic sur créneau réservé → annuler réservation ───────────────────────

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Annuler cette réservation ? Le créneau sera libéré et le client sera notifié par email.")) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/reservations/${reservationId}/status`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })
      if (!res.ok) throw new Error("Erreur serveur")
      setDetailModal(null)
      await fetchEvents()
    } catch (err) { alert(err.message) }
    finally { setCancelling(false) }
  }

  // ─── Clic sur un événement ─────────────────────────────────────────────────

  const handleSelectEvent = (event) => {
    if (event.extendedProps?.isTaken) {
      setDetailModal(event)
    } else {
      setEditModal(event)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const minTime    = new Date(); minTime.setHours(7, 0, 0, 0)
  const maxTime    = new Date(); maxTime.setHours(20, 0, 0, 0)
  const scrollTime = new Date(); scrollTime.setHours(8, 30, 0, 0)

  return (
    <div className="space-y-4">

      {/* Légende */}
      <div className="flex flex-wrap items-center gap-5 bg-white px-5 py-3 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-700 font-medium">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-sm text-gray-700 font-medium">Réservé</span>
        </div>
        <span className="text-xs text-gray-400 ml-auto hidden sm:block">
          Cliquez sur une plage vide pour créer un créneau
        </span>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:p-6">
        {loading ? (
          <div className="flex h-[600px] items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-sm">Chargement du planning…</span>
          </div>
        ) : error ? (
          <div className="flex h-[600px] items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div style={{ height: "700px" }}>
            <Calendar
              localizer={localizer}
              culture="fr"
              messages={MESSAGES}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              views={["week", "day"]}
              min={minTime}
              max={maxTime}
              step={30}
              timeslots={2}
              scrollToTime={scrollTime}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                event:   EventBlock,
                toolbar: CustomToolbar,
              }}
              style={{ height: "100%" }}
            />
          </div>
        )}
      </div>

      {/* ─── Modal : créer un créneau ─────────────────────────────────────── */}
      {createModal && (
        <Modal
          title={`Nouveau créneau — ${format(createModal.date, "EEEE d MMMM", { locale: fr })}`}
          onClose={() => setCreateModal(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Début</label>
                <input type="time" value={createForm.heureDebut}
                  onChange={e => setCreateForm({ ...createForm, heureDebut: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fin</label>
                <input type="time" value={createForm.heureFin}
                  onChange={e => setCreateForm({ ...createForm, heureFin: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Capacité max</label>
              <input type="number" min={1} value={createForm.nbMax}
                onChange={e => setCreateForm({ ...createForm, nbMax: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setCreateModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={submitCreate} disabled={creating}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                {creating ? "Création…" : "Créer le créneau"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Modal : créneau disponible ───────────────────────────────────── */}
      {editModal && (
        <Modal
          title="Créneau disponible"
          onClose={() => setEditModal(null)}
        >
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {format(editModal.start, "EEEE d MMMM", { locale: fr })}
                </span>
              </div>
              <p className="text-sm text-emerald-600 mt-0.5 ml-6">
                {format(editModal.start, "HH:mm")} – {format(editModal.end, "HH:mm")}
              </p>
              <p className="text-xs text-emerald-500 mt-0.5 ml-6">
                max {editModal.extendedProps?.nbMax || 1} réservation{editModal.extendedProps?.nbMax > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => handleDeleteCreneau(editModal.id)}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Suppression…" : "Supprimer ce créneau"}
            </button>
          </div>
        </Modal>
      )}

      {/* ─── Modal : créneau réservé ──────────────────────────────────────── */}
      {detailModal && (
        <Modal
          title="Rendez-vous réservé"
          onClose={() => setDetailModal(null)}
        >
          <div className="space-y-4">
            {/* Infos client */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {detailModal.extendedProps?.clientName || "—"}
                </span>
              </div>
              {detailModal.extendedProps?.serviceName && (
                <p className="text-xs text-gray-500 ml-6">
                  {detailModal.extendedProps.serviceName}
                </p>
              )}
              {detailModal.extendedProps?.clientEmail && (
                <p className="text-xs text-gray-500 ml-6">
                  {detailModal.extendedProps.clientEmail}
                </p>
              )}
              {detailModal.extendedProps?.clientPhone && (
                <p className="text-xs text-gray-500 ml-6">
                  {detailModal.extendedProps.clientPhone}
                </p>
              )}
            </div>

            {/* Horaire */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {format(detailModal.start, "EEEE d MMMM", { locale: fr })} · {format(detailModal.start, "HH:mm")} – {format(detailModal.end, "HH:mm")}
              </span>
            </div>

            {/* Action annulation */}
            {detailModal.extendedProps?.reservationId && (
              <button
                onClick={() => handleCancelReservation(detailModal.extendedProps.reservationId)}
                disabled={cancelling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {cancelling ? "Annulation…" : "Annuler ce rendez-vous"}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
