export default function useSubmitForm_pro(url) {
  const handleSubmit = async e => {
    //Fonction qu'on va réutilisé
    e.preventDefault() //Empêche le rechargement de la page

    const formData = new FormData(e.target) //FormData extrait les donnée du formulaire => (e.target)

    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      dateNaissance: formData.get("dateNaissance"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      password: formData.get("password"),
      companyName: formData.get("companyName"),
      sector: formData.get("sector"),
      slug: formData.get("slug"),
      address: formData.get("address"),
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country"),
    }

    const response = await fetch(url, {
      //On envoie les données au backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), //Tranforme l'objet javascript en Json
    })

    const result = await response.json() //On récup la réponse du backend sous forme de Json et on la log direct
    console.log("Réponse du serveur:", result)
  }

  return {handleSubmit}
}
