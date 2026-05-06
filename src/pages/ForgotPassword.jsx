import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("")
  const [status,  setStatus]  = useState("idle") // idle | loading | success | error
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("http://localhost:5000/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setStatus("success")
    } catch (err) {
      setMessage(err.message)
      setStatus("error")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-800 text-2xl font-bold">Mot de passe oublié ?</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              Entrez votre email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-lg">
            {status === "success" ? (
              <div className="text-center space-y-3">
                <p className="text-sm text-emerald-600 font-medium">
                  Si ce compte existe, un email a été envoyé.
                </p>
                <Link to="/login" className="text-indigo-600 hover:underline text-sm">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {message}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-3 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg transition duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50"
                >
                  {status === "loading" ? "Envoi…" : "Envoyer le lien"}
                </button>
                <div className="text-center pt-2">
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                    ← Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
