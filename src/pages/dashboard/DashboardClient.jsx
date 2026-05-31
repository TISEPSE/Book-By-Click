import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar              from '../../components/Navbar'
import DashboardContent    from './sections/DashboardContent'
import ReservationsContent from './sections/ReservationsContent'

/**
 * Tableau de bord du client.
 *
 * Permet au client de consulter son récapitulatif d'activité,
 * son calendrier de rendez-vous et la liste de ses réservations.
 *
 * L'authentification est vérifiée au montage ; tout utilisateur
 * non connecté est redirigé vers /login.
 */
const DashboardClient = () => {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(
    new URLSearchParams(location.search).get('section') || 'dashboard'
  )
  const navigate = useNavigate()

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section')
    if (section) setActiveSection(section)
  }, [location.search])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/session", { credentials: "include" })
        if (!response.ok) navigate("/login")
      } catch {
        navigate("/login")
      }
    }
    checkAuth()
  }, [navigate])

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':    return <DashboardContent />
      case 'reservations': return <ReservationsContent />
      default:             return <DashboardContent />
    }
  }

  const tabClass = (section) =>
    `py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
      activeSection === section
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 overflow-x-auto">
            {[
              { key: 'dashboard',    label: 'Tableau de bord' },
              { key: 'reservations', label: 'Réservations'    },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveSection(key)} className={tabClass(key)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="w-full mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default DashboardClient
