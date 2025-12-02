import { useState } from 'react'
import Header from '../../components/Header'
import DashboardContent from './sections/Dashboard_Content'
import CalendarContent from './sections/Calendar_Content'
import ReservationsContent from './sections/Reservations_Content'
import ClientsContent from './sections/Clients_Content'
import StatisticsContent from './sections/Statistics_Content'

const Dashboard_entreprises = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  
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
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection} 
      />
      
      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default Dashboard_entreprises