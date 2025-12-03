import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import UserAvatar from "./UserAvatar"

const Header = ({ activeSection, setActiveSection }) => {
  return (
    <header className="text-base lg:text-sm bg-white border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-x-6 px-4 max-w-screen-xl mx-auto lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-5 lg:shrink-0">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="w-8 h-8 text-indigo-600" />
            <a href="/" className="text-xl font-bold text-gray-900">
              Book By Click
            </a>
          </div>

          <div className="lg:hidden">
            <button className="text-gray-500 hover:text-gray-800 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="nav-menu pb-28 mt-8 overflow-y-auto max-h-screen hidden lg:flex lg:flex-1 lg:items-center lg:gap-6 lg:overflow-visible lg:pb-0 lg:mt-0">
          <div className="flex-1 flex items-center">
            <div className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="w-full px-2 text-gray-700 bg-transparent rounded-md outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center">
            <UserAvatar />
          </div>
        </div>
      </div>

      <nav className="border-gray-100">
        <ul className="flex items-center gap-x-3 max-w-screen-xl mx-auto px-4 overflow-x-auto lg:px-8">

          <li className={`py-1 ${activeSection === 'dashboard' ? 'border-b-2 border-indigo-600' : ''}`}>
            <a
              onClick={() => setActiveSection && setActiveSection('dashboard')}
              className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
            >
              Tableau de bord
            </a>
          </li>

          <li className={`py-1 ${activeSection === 'calendar' ? 'border-b-2 border-indigo-600' : ''}`}>
            <a
              onClick={() => setActiveSection && setActiveSection('calendar')}
              className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
            >
              Calendrier
            </a>
          </li>

          <li className={`py-1 ${activeSection === 'reservations' ? 'border-b-2 border-indigo-600' : ''}`}>
            <a
              onClick={() => setActiveSection && setActiveSection('reservations')}
              className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
            >
              Réservations
            </a>
          </li>

          <li className={`py-1 ${activeSection === 'clients' ? 'border-b-2 border-indigo-600' : ''}`}>
            <a
              onClick={() => setActiveSection && setActiveSection('clients')}
              className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
            >
              Clients
            </a>
          </li>

          <li className={`py-1 ${activeSection === 'statistics' ? 'border-b-2 border-indigo-600' : ''}`}>
            <a
              onClick={() => setActiveSection && setActiveSection('statistics')}
              className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
            >
              Statistiques
            </a>
          </li>

        </ul>
      </nav>
    </header>
  )
}

export default Header
