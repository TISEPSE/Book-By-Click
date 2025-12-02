// useFormSubmit.js
// Hook personnalisé : centralise l'envoi d'un formulaire
// vers une URL donnée, puis redirige vers une route succès
// --------------------------------------------------------

import { useNavigate } from "react-router-dom";

export default function useFormSubmit(actionUrl, successRoute) {
  // 1. Hook React-Router : permet de changer de page sans recharger le navigateur
  const navigate = useNavigate();

  // 2. Fonction unique qu'on va donner à l'attribut `onSubmit` de n'importe quel <form>
  const handleSubmit = async (e) => {
    e.preventDefault(); // ← empêche le rechargement de page classique

    // 3. Récupération automatique de tous les champs du formulaire
    // (ils doivent avoir un attribut `name` pour être visibles par FormData)
    const form = e.target;
    const formData = new FormData(form);

    // 4. Envoi des données en POST vers le backend (Flask)
    const res = await fetch(actionUrl, {
      method: "POST",
      body: formData,
    });

    // 5. Gestion simple d'erreur (on pourrait améliorer ici)
    if (!res.ok) throw new Error("Erreur réseau");

    // 6. Lecture de la réponse JSON (doit être du JSON valide côté serveur)
    const data = await res.json();

    // 7. Redirection côté client vers la page souhaitée + passage des données
    navigate(successRoute, { state: { data } });
  };

  // 8. On expose uniquement la fonction nécessaire au composant
  return { handleSubmit };
}