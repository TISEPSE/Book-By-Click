import { useLocation, useNavigate, Link } from "react-router-dom"
import { CheckCircle, Calendar, Home, Loader2, XCircle } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useEffect, useState, useRef } from "react"

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  const [status, setStatus] = useState("loading") // loading | success | error
  const [errorMessage, setErrorMessage] = useState("")
  const [reservationId, setReservationId] = useState(null)
  const called = useRef(false)

  useEffect(() => {
    if (!booking) {
      navigate("/")
      return
    }

    // StrictMode monte le composant deux fois en dev — ce guard empêche le double appel
    if (called.current) return
    called.current = true

    const createReservation = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reservations", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idCreneau: booking.idCreneau,
            idPrestation: booking.prestation.id,
            commentaireClient: "",
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login")
            return
          }
          setErrorMessage(data.error || "Une erreur est survenue.")
          setStatus("error")
          return
        }

        setReservationId(data.idReservation)
        setStatus("success")
      } catch {
        setErrorMessage("Impossible de joindre le serveur. Vérifiez votre connexion.")
        setStatus("error")
      }
    }

    createReservation()
  }, [booking, navigate])

  if (!booking) return null

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Enregistrement de votre réservation...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Réservation impossible
            </h1>
            <p className="text-sm text-gray-500">{errorMessage}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              Choisir un autre créneau
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </main>
      <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Réservation confirmée !
          </h1>
          <p className="text-sm text-gray-500">
            Un email de confirmation vous a été envoyé.
          </p>
          {reservationId && (
            <p className="text-xs text-gray-400 mt-1">
              Référence : RDV-{String(reservationId).padStart(3, "0")}
            </p>
          )}
        </div>

        <section className="bg-white border border-gray-200 rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Récapitulatif
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Entreprise</p>
              <p className="text-sm text-gray-900 mt-0.5">{booking.entreprise.name}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Prestation</p>
              <p className="text-sm text-gray-900 mt-0.5">{booking.prestation.name}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Heure</p>
              <p className="text-sm text-gray-900 mt-0.5">{booking.time}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Durée</p>
              <p className="text-sm text-gray-900 mt-0.5">{booking.prestation.duration} min</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Prix</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {booking.prestation.price} €
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/dashboard_client"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            Voir mes réservations
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
