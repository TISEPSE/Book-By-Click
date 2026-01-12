export default function useSubmitForm(url) {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      birthDate: formData.get("dateNaissance"),
      email: formData.get("email"),
      phone: formData.get("telephone"),
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
    console.log('Réponse du serveur:', result)
  }

  return { handleSubmit }
}
