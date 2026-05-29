import { useState } from "react"

/**
 * Hook personnalisé pour la soumission du formulaire d'inscription client.
 *
 * Gère la sérialisation des données, l'appel API et le retour utilisateur
 * via un composant Toast. En cas de succès, redirige vers /login.
 *
 * @param {string} url            - Endpoint API cible (POST).
 * @param {string} successMessage - Message affiché en cas de succès.
 * @param {string} errorMessage   - Message affiché en cas d'erreur générique.
 * @returns {{ handleSubmit, toast, closeToast }}
 */
export default function useSubmitForm_user(url, successMessage, errorMessage) {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = {
      nom:           formData.get("nom"),
      prenom:        formData.get("prenom"),
      dateNaissance: formData.get("dateNaissance"),
      email:         formData.get("email"),
      telephone:     formData.get("telephone"),
      password:      formData.get("password"),
    }

    try {
      const response = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        sessionStorage.setItem("toast", JSON.stringify({ message: successMessage, type: "success" }))
        window.location.href = "/login"
      } else {
        setToast({ show: true, message: result.error || errorMessage, type: "error" })
      }
    } catch {
      setToast({ show: true, message: errorMessage, type: "error" })
    }
  }

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }))

  return { handleSubmit, toast, closeToast }
}
