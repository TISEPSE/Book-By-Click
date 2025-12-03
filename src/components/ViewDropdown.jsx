"use client"

import {useState, useEffect, useRef} from "react"
import {ChevronDown, Check} from "lucide-react"

export default function ViewDropdown({view, onViewChange}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const viewOptions = [
    {value: "month", label: "Mois"},
    {value: "week", label: "Semaine"},
  ]

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleViewChange = newView => {
    onViewChange(newView)
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-base font-semibold text-gray-900 hover:bg-indigo-200 hover:border-indigo-400 hover:text-indigo-800 transition-all duration-300"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span>{viewOptions.find(option => option.value === view)?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-all duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-50 animate-dropdown">
          {viewOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleViewChange(option.value)}
              className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium transition-all duration-300 ${
                view === option.value
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-900 hover:bg-indigo-50"
              }`}
            >
              <span>{option.label}</span>
              {view === option.value && (
                <Check className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
