import { useState, useEffect } from "react"
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid"

export default function Toast({ message, type = "success", show, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show && !visible) return null

  const isSuccess = type === "success"

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        min-w-[320px] px-5 py-4
        flex items-center gap-4
        rounded-xl shadow-2xl border
        transition-all duration-300 ease-out
        bg-white
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isSuccess ? "border-green-200" : "border-red-200"}
      `}
    >
      {isSuccess
        ? <CheckCircleIcon className="w-7 h-7 text-green-500" />
        : <XCircleIcon className="w-7 h-7 text-red-500" />
      }
      <span className={`flex-1 font-medium ${isSuccess ? "text-green-700" : "text-red-700"}`}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }}>
        <XMarkIcon className={`w-5 h-5 ${isSuccess ? "text-green-400 hover:text-green-600" : "text-red-400 hover:text-red-600"}`} />
      </button>
    </div>
  )
}
