import { useState, useEffect } from "react"
import { Save, Zap, CheckCircle } from "lucide-react"

const JOURS = [
  { key: 0, label: "Lundi",     short: "Lun" },
  { key: 1, label: "Mardi",     short: "Mar" },
  { key: 2, label: "Mercredi",  short: "Mer" },
  { key: 3, label: "Jeudi",     short: "Jeu" },
  { key: 4, label: "Vendredi",  short: "Ven" },
  { key: 5, label: "Samedi",    short: "Sam" },
  { key: 6, label: "Dimanche",  short: "Dim" },
]

const todayISO = () => new Date().toISOString().slice(0, 10)
const in4weeks = () => {
  const d = new Date()
  d.setDate(d.getDate() + 28)
  return d.toISOString().slice(0, 10)
}

export default function SemaineTypeContent() {
  const [st, setSt]               = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState(null)

  // Génération
  const [genForm, setGenForm]     = useState({ dateDebut: todayISO(), dateFin: in4weeks(), nbMax: 1 })
  const [generating, setGenerating] = useState(false)
  const [genResult, setGenResult] = useState(null)

  useEffect(() => {
    fetch("/api/entreprise/semainetype", { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject("Erreur"))
      .then(data => setSt(data))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const toggleJour = (idx) => {
    const arr = st.joursPattern.split("")
    arr[idx] = arr[idx] === "1" ? "0" : "1"
    setSt({ ...st, joursPattern: arr.join("") })
  }

  const saveSt = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/entreprise/semainetype", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(st),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Erreur")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const generate = async () => {
    setGenerating(true)
    setGenResult(null)
    try {
      const res = await fetch("/api/entreprise/semainetype/generer", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateDebut: genForm.dateDebut,
          dateFin:   genForm.dateFin,
          nbMaxReservations: genForm.nbMax,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setGenResult(data)
    } catch (e) {
      alert(e.message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (error || !st) {
    return <p className="text-red-600 text-sm">{error || "Impossible de charger la semaine type"}</p>
  }

  const joursActifs = st.joursPattern.split("").filter(c => c === "1").length

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Semaine type</h1>
        <p className="text-sm text-gray-500 mt-1">
          Définissez vos jours et horaires habituels, puis générez vos créneaux automatiquement.
        </p>
      </div>

      {/* ── Configuration ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Configuration</h2>
        </div>
        <div className="p-5 space-y-5">

          {/* Libellé */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={st.libelle}
              onChange={e => setSt({ ...st, libelle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Jours */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jours ouverts <span className="font-normal text-gray-400">({joursActifs}/7)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {JOURS.map(j => {
                const isOpen = st.joursPattern[j.key] === "1"
                return (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => toggleJour(j.key)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isOpen
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {j.short}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Heure d'ouverture</label>
              <input
                type="time"
                value={st.heureDebut}
                onChange={e => setSt({ ...st, heureDebut: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Heure de fermeture</label>
              <input
                type="time"
                value={st.heureFin}
                onChange={e => setSt({ ...st, heureFin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Aperçu horaires */}
          <div className="bg-indigo-50 rounded-lg px-4 py-3 text-sm text-indigo-700">
            <span className="font-semibold">{joursActifs} jours/sem</span>
            {" · "}
            {st.heureDebut} → {st.heureFin}
            {" · "}
            <span className="font-semibold">
              {Math.max(0, parseInt(st.heureFin) - parseInt(st.heureDebut))} créneaux/jour
            </span>
          </div>

          {/* Sauvegarde */}
          <button
            onClick={saveSt}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saved
              ? <><CheckCircle className="w-4 h-4" /> Enregistré</>
              : <><Save className="w-4 h-4" /> {saving ? "Enregistrement…" : "Enregistrer"}</>
            }
          </button>
        </div>
      </div>

      {/* ── Génération ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Générer des créneaux</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Applique la semaine type sur une période. Les créneaux existants sont conservés.
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Du</label>
              <input
                type="date"
                value={genForm.dateDebut}
                onChange={e => setGenForm({ ...genForm, dateDebut: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Au</label>
              <input
                type="date"
                value={genForm.dateFin}
                onChange={e => setGenForm({ ...genForm, dateFin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Réservations max par créneau
            </label>
            <input
              type="number"
              min={1}
              value={genForm.nbMax}
              onChange={e => setGenForm({ ...genForm, nbMax: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {genResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
              <CheckCircle className="w-4 h-4 inline mr-1.5" />
              <span className="font-semibold">{genResult.created} créneaux créés</span>
              {genResult.skipped > 0 && (
                <span className="text-emerald-600"> · {genResult.skipped} ignorés (déjà existants)</span>
              )}
            </div>
          )}

          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            {generating ? "Génération…" : "Générer les créneaux"}
          </button>
        </div>
      </div>
    </div>
  )
}
