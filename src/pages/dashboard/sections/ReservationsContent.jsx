import { useState, useEffect, useCallback } from "react"
import { CheckCircle, XCircle, Clock, Mail, MailX, ChevronDown, Building2, CalendarX, Plus, X } from "lucide-react"

const STATUS_LABELS = {
  confirmed: { label: "Confirmé",   classes: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "En attente", classes: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Annulé",     classes: "bg-red-100 text-red-600" },
}

const FILTERS = ["Tous", "En attente", "Confirmé", "Annulé"]

function ClientReservations({ reservations, loading, error, filter, setFilter, filtered, updateStatus, actionLoading }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes réservations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} réservation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <CalendarX className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aucune réservation pour ce filtre.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending
            const isActing = actionLoading === r.db_id
            const canCancel = r.status !== "cancelled"

            return (
              <div
                key={r.db_id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Icône */}
                  <div className="hidden sm:flex w-10 h-10 rounded-lg bg-indigo-50 items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{r.entrepriseName}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.classes}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.service} · {r.duration} · <span className="font-medium text-gray-700">{r.price.toFixed(2)} €</span>
                    </p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 shrink-0">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{r.date} à {r.time}</span>
                  </div>

                  {/* Référence + annulation */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:block text-xs font-mono text-gray-400">{r.id}</span>
                    {canCancel && (
                      <button
                        onClick={() => updateStatus(r.db_id, "cancelled")}
                        disabled={isActing}
                        title="Annuler ce rendez-vous"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date visible mobile */}
                <div className="md:hidden px-5 pb-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{r.date} à {r.time}</span>
                </div>

                {r.notes && (
                  <div className="border-t border-gray-100 px-5 py-2.5 bg-gray-50">
                    <p className="text-xs text-gray-500 italic">Note : {r.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ReservationsContent({ isPro = false }) {
  const [reservations,      setReservations]      = useState([])
  const [loading,           setLoading]           = useState(true)
  const [error,             setError]             = useState(null)
  const [filter,            setFilter]            = useState("Tous")
  const [actionLoading,     setActionLoading]     = useState(null)
  const [expandedId,        setExpandedId]        = useState(null)
  const [showManuel,        setShowManuel]        = useState(false)
  const [manuelClients,     setManuelClients]     = useState([])
  const [manuelCreneaux,    setManuelCreneaux]    = useState([])
  const [manuelPrestations, setManuelPrestations] = useState([])
  const [manuelForm,        setManuelForm]        = useState({ idClient: "", idCreneau: "", idPrestation: "", commentaire: "", sendEmail: true })
  const [manuelSaving,      setManuelSaving]      = useState(false)

  const fetchReservations = useCallback(async () => {
    try {
      const endpoint = isPro
        ? "http://localhost:5000/api/entreprise/reservations"
        : "http://localhost:5000/api/client/reservations"
      const res = await fetch(endpoint, { credentials: "include" })
      if (!res.ok) throw new Error("Impossible de charger les réservations")
      setReservations(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [isPro])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const openManuel = async () => {
    setManuelForm({ idClient: "", idCreneau: "", idPrestation: "", commentaire: "", sendEmail: true })
    const [clients, creneaux, prestations] = await Promise.all([
      fetch("/api/entreprise/clients",       { credentials: "include" }).then(r => r.ok ? r.json() : []),
      fetch("/api/entreprise/creneaux",      { credentials: "include" }).then(r => r.ok ? r.json() : []),
      fetch("/api/entreprise/mes-prestations", { credentials: "include" }).then(r => r.ok ? r.json() : []),
    ])
    setManuelClients(clients)
    setManuelCreneaux(creneaux.filter(c => c.statut))
    setManuelPrestations(prestations)
    setShowManuel(true)
  }

  const submitManuel = async () => {
    if (!manuelForm.idClient || !manuelForm.idCreneau || !manuelForm.idPrestation) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }
    setManuelSaving(true)
    try {
      const res = await fetch("/api/entreprise/reservations/manuel", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idClient:         parseInt(manuelForm.idClient),
          idCreneau:        parseInt(manuelForm.idCreneau),
          idPrestation:     parseInt(manuelForm.idPrestation),
          commentaireClient: manuelForm.commentaire,
          sendEmail:        manuelForm.sendEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur serveur")
      setShowManuel(false)
      await fetchReservations()
    } catch (e) { alert(e.message) }
    finally { setManuelSaving(false) }
  }

  const updateStatus = async (dbId, newStatus) => {
    const confirmMsg = isPro
      ? "Annuler cette réservation ? Le créneau sera libéré et un email sera envoyé au client."
      : "Annuler ce rendez-vous ? Cette action est irréversible."
    if (newStatus === "cancelled" && !window.confirm(confirmMsg)) return
    setActionLoading(dbId)
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${dbId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur serveur")
      }
      await fetchReservations()
    } catch (e) {
      alert(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = reservations.filter((r) => {
    if (filter === "Tous") return true
    if (filter === "En attente") return r.status === "pending"
    if (filter === "Confirmé") return r.status === "confirmed"
    if (filter === "Annulé") return r.status === "cancelled"
    return true
  })

  if (!isPro) {
    return <ClientReservations
      reservations={reservations}
      loading={loading}
      error={error}
      filter={filter}
      setFilter={setFilter}
      filtered={filtered}
      updateStatus={updateStatus}
      actionLoading={actionLoading}
    />
  }

  return (
    <div className="space-y-5">
      {/* Header + filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} réservation{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openManuel}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nouveau RDV
          </button>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Modal réservation manuelle */}
      {showManuel && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-5 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">Nouveau rendez-vous</h2>
              <button onClick={() => setShowManuel(false)} className="p-1.5 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client *</label>
                <select value={manuelForm.idClient} onChange={e => setManuelForm({ ...manuelForm, idClient: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                  <option value="">— Sélectionner un client —</option>
                  {manuelClients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom} · {c.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prestation *</label>
                <select value={manuelForm.idPrestation} onChange={e => setManuelForm({ ...manuelForm, idPrestation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                  <option value="">— Sélectionner une prestation —</option>
                  {manuelPrestations.map(p => <option key={p.id} value={p.id}>{p.libelle} · {p.dureeMinutes} min · {p.tarif} €</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Créneau disponible *</label>
                <select value={manuelForm.idCreneau} onChange={e => setManuelForm({ ...manuelForm, idCreneau: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                  <option value="">— Sélectionner un créneau —</option>
                  {manuelCreneaux.map(c => {
                    const d = new Date(c.dateHeureDebut)
                    const lbl = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                    return <option key={c.id} value={c.id}>{lbl}</option>
                  })}
                </select>
                {manuelCreneaux.length === 0 && <p className="text-xs text-amber-600 mt-1">Aucun créneau disponible — créez-en dans la section Créneaux.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Note (optionnel)</label>
                <input value={manuelForm.commentaire} onChange={e => setManuelForm({ ...manuelForm, commentaire: e.target.value })}
                  placeholder="Information pour le client…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={manuelForm.sendEmail}
                  onChange={e => setManuelForm({ ...manuelForm, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-sm text-gray-700">Envoyer un email de confirmation au client</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowManuel(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50">Annuler</button>
                <button onClick={submitManuel} disabled={manuelSaving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                  {manuelSaving ? "Création…" : "Créer le RDV"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">Aucune réservation pour ce filtre.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending
            const isExpanded = expandedId === r.db_id
            const isActing = actionLoading === r.db_id

            return (
              <div
                key={r.db_id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Ligne principale */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Référence */}
                  <div className="hidden sm:block w-20 shrink-0">
                    <p className="text-xs font-mono text-gray-400">{r.id}</p>
                  </div>

                  {/* Infos principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{r.clientName}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.classes}`}>
                        {st.label}
                      </span>
                      {r.mailStatus ? (
                        <Mail className="w-3.5 h-3.5 text-indigo-400" title="Email envoyé" />
                      ) : (
                        <MailX className="w-3.5 h-3.5 text-gray-300" title="Email non envoyé" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.service} · {r.duration} · <span className="font-medium text-gray-700">{r.price.toFixed(2)} €</span>
                    </p>
                  </div>

                  {/* Date du RDV */}
                  <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 shrink-0">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{r.date} à {r.time}</span>
                  </div>

                  {/* Actions Pro */}
                  <div className="flex items-center gap-2 shrink-0">
                    {r.status === "pending" && (
                      <button
                        onClick={() => updateStatus(r.db_id, "confirmed")}
                        disabled={isActing}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                        title="Confirmer"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(r.db_id, "cancelled")}
                        disabled={isActing}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Annuler"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : r.db_id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
                      title="Détails"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Détails expandables */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                      <p className="text-gray-700 truncate">{r.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Téléphone</p>
                      <p className="text-gray-700">{r.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Client depuis</p>
                      <p className="text-gray-700">{r.clientSince}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
                      <p className="text-gray-700 italic">{r.notes || "—"}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
