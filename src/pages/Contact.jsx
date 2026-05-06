import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CheckCircle, AlertCircle } from 'lucide-react'

const SUJETS = [
  "Question générale",
  "Problème technique",
  "Signaler un abus",
  "Devenir partenaire",
  "Demande de suppression de données",
  "Autre",
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [status,  setStatus]  = useState(null) // null | 'success' | 'error'
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full space-y-6 text-gray-600 sm:max-w-lg px-4">

          <div className="text-center">
            <h1 className="text-gray-800 text-2xl font-bold sm:text-3xl">Contactez-nous</h1>
            <p className="text-gray-500 text-sm mt-2">
              Une question, un problème ou une suggestion ? On vous répond rapidement.
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-lg space-y-5">

            {/* Feedback succès / erreur */}
            {status === 'success' && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Une erreur s'est produite lors de l'envoi. Veuillez réessayer.
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Nom / Prénom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom / Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  id="name" name="name" type="text" required
                  placeholder="Marie Dupont"
                  className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email" name="email" type="email" required
                  placeholder="marie.dupont@gmail.com"
                  className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg outline-none transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
                </label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg outline-none transition"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject" name="subject" required
                  className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg outline-none transition bg-white"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="" disabled>Choisissez un sujet…</option>
                  {SUJETS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message" name="message" required rows="5"
                  placeholder="Décrivez votre demande en quelques lignes…"
                  className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg outline-none transition resize-none"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours…' : 'Envoyer le message'}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-200 text-center">
              <Link to="/" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
