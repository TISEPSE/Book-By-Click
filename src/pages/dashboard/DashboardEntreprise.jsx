import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar            from '../../components/Navbar'
import DashboardContent   from './sections/DashboardContent'
import PlanningContent   from './sections/PlanningContent'
import ClientsContent    from './sections/ClientsContent'
import StatisticsContent from './sections/StatisticsContent'
import ReservationsContent from './sections/ReservationsContent'
import EvenementsContent from './sections/EvenementsContent'
import SemaineTypeContent from './sections/SemaineTypeContent'

/**
 * Tableau de bord du professionnel.
 *
 * Point d'entrée unique pour toutes les fonctionnalités de gestion :
 * créneaux, réservations, clients, semaine type, événements et statistiques.
 *
 * La section active est synchronisée avec le paramètre URL `?section=xxx`,
 * ce qui permet des liens directs vers une section spécifique
 * (ex: depuis les boutons d'accès rapide du tableau de bord).
 *
 * L'authentification est vérifiée au montage du composant ; tout utilisateur
 * non connecté est redirigé vers /login.
 */
const DashboardEntreprise = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const activeSection = new URLSearchParams(location.search).get('section') || 'dashboard'

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

  const goTo = (section) => navigate(`/dashboard_entreprise?section=${section}`)

  /** Retourne le composant de section correspondant à l'onglet actif. */
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':    return <DashboardContent   isPro={true} />
      case 'planning':     return <PlanningContent />
      case 'reservations': return <ReservationsContent isPro={true} />
      case 'clients':      return <ClientsContent />
      case 'evenements':   return <EvenementsContent />
      case 'semainetype':  return <SemaineTypeContent />
      case 'statistics':   return <StatisticsContent />
      default:             return <DashboardContent   isPro={true} />
    }
  }

  /** Classe CSS pour un onglet selon son état actif. */
  const tabClass = (section) =>
    `py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
      activeSection === section
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Barre de navigation entre les sections */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 overflow-x-auto">
            {[
              { key: 'dashboard',    label: 'Tableau de bord' },
              { key: 'planning',     label: 'Planning'        },
              { key: 'reservations', label: 'Réservations'    },
              { key: 'clients',      label: 'Clients'         },
              { key: 'semainetype',  label: 'Semaine type'    },
              { key: 'evenements',   label: 'Événements'      },
              { key: 'statistics',   label: 'Statistiques'    },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => goTo(key)} className={tabClass(key)}>
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

export default DashboardEntreprise
