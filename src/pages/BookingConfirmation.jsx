import { useLocation, useNavigate, Link } from "react-router-dom"
import { CheckCircle, Calendar, Home } from "lucide-react"
import Navbar from "../components/Navbar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useEffect } from "react"

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  useEffect(() => {
    if (!booking) navigate("/")
  }, [booking, navigate])

  if (!booking) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        {/* Icône succès */}
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
            Votre réservation a bien été enregistrée.
          </p>
        </div>

        {/* Récapitulatif */}
        <section className="bg-white border border-gray-200 rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Récapitulatif
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Entreprise
              </p>
              <p className="text-sm text-gray-900 mt-0.5">
                {booking.entreprise.name}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Prestation
              </p>
              <p className="text-sm text-gray-900 mt-0.5">
                {booking.prestation.name}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Date
              </p>
              <p className="text-sm text-gray-900 mt-0.5">
                {format(new Date(booking.date), "EEEE d MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Heure
              </p>
              <p className="text-sm text-gray-900 mt-0.5">{booking.time}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Durée
              </p>
              <p className="text-sm text-gray-900 mt-0.5">
                {booking.prestation.duration} min
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Prix
              </p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {booking.prestation.price} €
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/dashboard_client"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Calendar className="w-4 h-4" />
            Voir mes réservations
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </main>
    </div>
  )
}
