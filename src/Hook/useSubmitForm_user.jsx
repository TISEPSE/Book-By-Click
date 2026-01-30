import { useState } from "react"

export default function useSubmitForm_user(url, successMessage, errorMessage) {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      dateNaissance: formData.get("dateNaissance"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      password: formData.get("password"),
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        sessionStorage.setItem("toast", JSON.stringify({ message: successMessage, type: "success" }))
        window.location.href = "/login"
      } else {
        setToast({ show: true, message: errorMessage, type: "error" })
      }
    } catch (error) {
      setToast({ show: true, message: errorMessage, type: "error" })
    }
  }

  const closeToast = () => setToast({ ...toast, show: false })

  return { handleSubmit, toast, closeToast }
}
