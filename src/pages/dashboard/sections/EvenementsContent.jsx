import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2, X, AlertTriangle, CalendarOff } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

const TYPES = ["Fermeture", "Conges", "Evenement", "Promotion", "Atelier", "Autre"]

const TYPE_COLORS = {
  Fermeture:  "bg-red-100 text-red-700",
  Conges:     "bg-orange-100 text-orange-700",
  Evenement:  "bg-indigo-100 text-indigo-700",
  Promotion:  "bg-emerald-100 text-emerald-700",
  Atelier:    "bg-purple-100 text-purple-700",
  Autre:      "bg-gray-100 text-gray-600",
}

const toLocalInput = (d) => {
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY_FORM = {
  titre: "", description: "", typeEvenement: "Fermeture",
  dateDebut: toLocalInput(new Date()), dateFin: toLocalInput(new Date()),
}

export default function EvenementsContent() {
  const [evenements, setEvenements]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [showModal, setShowModal]         = useState(false)
  const [form, setForm]                   = useState(EMPTY_FORM)
  const [submitting, setSubmitting]       = useState(false)
  const [conflict, setConflict]           = useState(null)   // { message, reservations }
  const [deletingId, setDeletingId]       = useState(null)

  const fetchEvenements = useCallback(async () => {
    try {
      const res = await fetch("/api/entreprise/evenements", { credentials: "include" })
      if (!res.ok) throw new Error("Impossible de charger les événements")
      setEvenements(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvenements() }, [fetchEvenements])

  const openModal = () => {
    setForm(EMPTY_FORM)
    setConflict(null)
    setShowModal(true)
  }

  const submit = async (force = false) => {
    if (!form.titre.trim()) return alert("Le titre est obligatoire")
    setSubmitting(true)
    try {
      const res = await fetch("/api/entreprise/evenements", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, force }),
      })
      const data = await res.json()

      if (res.status === 409 && data.conflict) {
        setConflict(data)
        return
      }
      if (!res.ok) throw new Error(data.error || "Erreur serveur")

      setShowModal(false)
      setConflict(null)
      await fetchEvenements()
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteEvt = async (id) => {
    if (!window.confirm("Supprimer cet événement ? Les créneaux sans réservation seront libérés.")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/entreprise/evenements/${id}`, {
        method: "DELETE", credentials: "include",
      })
      if (!res.ok) throw new Error("Erreur serveur")
      await fetchEvenements()
    } catch (e) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const future  = evenements.filter(e => new Date(e.dateFin)   >= new Date())
  const past    = evenements.filter(e => new Date(e.dateFin)    < new Date())

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Événements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos fermetures, congés et événements spéciaux
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel événement
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {/* Événements à venir */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          À venir ({future.length})
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse h-16" />
            ))}
          </div>
        ) : future.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
            <CalendarOff className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun événement à venir</p>
          </div>
        ) : (
          <div className="space-y-3">
            {future.map(e => <EventCard key={e.id} evt={e} onDelete={deleteEvt} deletingId={deletingId} />)}
          </div>
        )}
      </div>

      {/* Événements passés */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Passés ({past.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {past.map(e => <EventCard key={e.id} evt={e} onDelete={deleteEvt} deletingId={deletingId} past />)}
          </div>
        </div>
      )}

      {/* Modal création */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">Nouvel événement</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Conflit détecté */}
              {conflict && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">{conflict.message}</p>
                      <ul className="mt-1 space-y-0.5">
                        {conflict.reservations.map((r) => (
                          <li key={r.id} className="text-xs text-amber-700">
                            {r.id} — {r.client} · {r.service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => submit(true)}
                      disabled={submitting}
                      className="flex-1 px-3 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
                      Forcer et annuler les RDV
                    </button>
                    <button
                      onClick={() => setConflict(null)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Modifier les dates
                    </button>
                  </div>
                </div>
              )}

              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={e => setForm({ ...form, titre: e.target.value })}
                  placeholder="ex : Congés d'été"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm({ ...form, typeEvenement: t })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        form.typeEvenement === t
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date début *</label>
                  <input
                    type="datetime-local"
                    value={form.dateDebut}
                    onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin *</label>
                  <input
                    type="datetime-local"
                    value={form.dateFin}
                    onChange={e => setForm({ ...form, dateFin: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Détails optionnels..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Actions */}
              {!conflict && (
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => submit(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? "Création..." : "Créer l'événement"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ evt, onDelete, deletingId, past = false }) {
  const colorClass = TYPE_COLORS[evt.typeEvenement] ?? TYPE_COLORS.Autre
  const debut = parseISO(evt.dateDebut)
  const fin   = parseISO(evt.dateFin)

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className="hidden sm:flex w-2 self-stretch rounded-full shrink-0 bg-indigo-300" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">{evt.titre}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
            {evt.typeEvenement}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {format(debut, "d MMM yyyy HH:mm", { locale: fr })}
          {" → "}
          {format(fin,   "d MMM yyyy HH:mm", { locale: fr })}
        </p>
        {evt.description && (
          <p className="text-xs text-gray-400 mt-0.5 italic">{evt.description}</p>
        )}
      </div>

      {!past && (
        <button
          onClick={() => onDelete(evt.id)}
          disabled={deletingId === evt.id}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
