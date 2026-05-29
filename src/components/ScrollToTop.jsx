import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Remonte automatiquement en haut de la page à chaque changement de route.
 * À placer directement à l'intérieur de <BrowserRouter> dans App.jsx.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return null
}
