export default function useSubmitForm_user(url) {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      dateNaissance: formData.get("dateNaissance"), // doit correspondre au backend
      email: formData.get("email"),
      telephone: formData.get("telephone"),         // pareil
      password: formData.get("password"),
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    console.log("Réponse du serveur:", result)

    if (response.ok) {
      window.location.href = "/login_form"
    }
  }

  return { handleSubmit }
}
