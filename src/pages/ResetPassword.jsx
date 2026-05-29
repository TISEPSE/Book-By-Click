import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ResetPassword() {
  const [searchParams]     = useSearchParams()
  const navigate           = useNavigate()
  const token              = searchParams.get("token") || ""

  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [status,    setStatus]    = useState("idle") // idle | loading | success | error
  const [message,   setMessage]   = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.")
      setStatus("error")
      return
    }
    if (password.length < 8) {
      setMessage("Le mot de passe doit faire au moins 8 caractères.")
      setStatus("error")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("http://localhost:5000/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setStatus("success")
    } catch (err) {
      setMessage(err.message)
      setStatus("error")
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex items-center justify-center py-20">
          <p className="text-red-600 text-sm">Lien de réinitialisation invalide.</p>
        </main>
      <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
            <p className="text-sm text-gray-500 mt-1">Choisissez un mot de passe sécurisé (8 caractères min.)</p>
          </div>

          {status === "success" ? (
            <div className="bg-white shadow rounded-lg p-6 text-center space-y-4">
              <p className="text-emerald-600 font-medium">Mot de passe réinitialisé !</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
              {status === "error" && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {message}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {status === "loading" ? "Enregistrement…" : "Réinitialiser le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
