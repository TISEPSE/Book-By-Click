import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import DashboardContent from './sections/Dashboard_Content'
import CalendarContent from './sections/Calendar_Content'
import ClientsContent from './sections/Clients_Content'
import StatisticsContent from './sections/Statistics_Content'
import ReservationsContent from './sections/Reservations_Content'

const Dashboard_entreprises = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });
        if (!response.ok) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard': return <DashboardContent />
      case 'calendar': return <CalendarContent />
      case 'reservations': return <ReservationsContent />
      case 'clients': return <ClientsContent />
      case 'statistics': return <StatisticsContent />
      default: return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Onglets du Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveSection('calendar')}
              className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === 'calendar'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendrier
            </button>
            <button
              onClick={() => setActiveSection('reservations')}
              className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === 'reservations'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Réservations
            </button>
            <button
              onClick={() => setActiveSection('clients')}
              className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === 'clients'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveSection('statistics')}
              className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === 'statistics'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistiques
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu */}
      <main className="w-full mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default Dashboard_entreprises
