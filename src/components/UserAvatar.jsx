import {useState, useRef, useEffect} from "react"
import {LogOut, User, Settings, HelpCircle} from "lucide-react"

export default function UserAvatarSimple({user = {name: "Utilisateur", email: "user@bookbyclick.com"}}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  const menuItems = [
    { label: "Mon profil", icon: User },
    { label: "Paramètres", icon: Settings },
    { label: "Aide", icon: HelpCircle }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center rounded-full bg-indigo-600 size-11 hover:bg-indigo-700 hover:shadow-md transition-all"
      >
        <span className="text-white text-sm font-semibold">{initials}</span>
        <span className="absolute right-0 bottom-0 rounded-full ring-2 ring-white bg-green-500 size-3"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div>
            {menuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
