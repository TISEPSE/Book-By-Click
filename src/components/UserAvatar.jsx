import {useState, useRef, useEffect} from "react"
import {User, Settings, HelpCircle, LogOut} from "lucide-react"

export default function UserAvatar({user = {name: "Utilisateur", email: "user@bookbyclick.com"}}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getInitials = name => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Simple Round Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-600 size-11 cursor-pointer hover:bg-indigo-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Open user menu"
      >
        <span className="text-white text-sm font-semibold select-none">
          {getInitials(user.name)}
        </span>
        {/* Online Status Indicator */}
        <span className="absolute right-0 bottom-0 rounded-full ring-2 ring-white bg-green-500 size-3"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-600 size-10">
                <span className="text-white text-sm font-semibold">
                  {getInitials(user.name)}
                </span>
                <span className="absolute right-0 bottom-0 rounded-full ring-2 ring-white bg-green-500 size-2.5"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items - No gaps, full height hover */}
          <div>
            <button
              onClick={() => {
                console.log("Mon profil")
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <User className="size-4 shrink-0" />
              <span>Mon profil</span>
            </button>

            <button
              onClick={() => {
                console.log("Paramètres")
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <Settings className="size-4 shrink-0" />
              <span>Paramètres</span>
            </button>

            <button
              onClick={() => {
                console.log("Aide")
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <HelpCircle className="size-4 shrink-0" />
              <span>Aide</span>
            </button>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200"></div>

          {/* Logout Button */}
          <div>
            <button
              onClick={() => {
                console.log("Déconnexion")
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
