"use client"

import {ChevronLeft, ChevronRight} from "lucide-react"

export default function NavigationButtons({onPrevious, onToday, onNext}) {
  return (
    <div className="flex">
      <button
        onClick={onPrevious}
        className="p-2 bg-white border border-gray-300 rounded-l-lg hover:bg-indigo-200 hover:border-indigo-400 transition-all duration-300 group"
        aria-label="Période précédente"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-indigo-800 transition-colors duration-300" />
      </button>
      <button
        onClick={onToday}
        className="px-4 py-2 bg-white border-t border-b border-gray-300 text-base font-semibold text-gray-900 hover:bg-indigo-200 hover:border-indigo-400 hover:text-indigo-800 transition-all duration-300"
      >
        Aujourd'hui
      </button>
      <button
        onClick={onNext}
        className="p-2 bg-white border border-gray-300 rounded-r-lg hover:bg-indigo-200 hover:border-indigo-400 transition-all duration-300 group"
        aria-label="Période suivante"
      >
        <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-indigo-800 transition-colors duration-300" />
      </button>
    </div>
  )
}
