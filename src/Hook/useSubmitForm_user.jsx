export default function useSubmitForm_user(url) {
  const handleSubmit = async (e) => { //Fonction qu'on va réutilisé
    e.preventDefault() //Empêche le rechargement de la page

    const formData = new FormData(e.target) //FormData extrait les donnée du formulaire => (e.target)

    const data = { //Objet qui récupère les données du formulaire
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      birthDate: formData.get("dateNaissance"),
      email: formData.get("email"),
      phone: formData.get("telephone"),
      password: formData.get("password"),
    }

    const response = await fetch(url, { //On envoie les données au backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), //Tranforme l'objet javascript en Json
    })

    const result = await response.json() //On récup la réponse du backend sous forme de Json et on la log direct
    console.log('Réponse du serveur:', result)
  }

  return { handleSubmit }
}
