import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ChevronDown, ChevronUp } from "lucide-react"

const FAQ = [
  {
    category: "Réservation",
    items: [
      {
        q: "Comment réserver un rendez-vous ?",
        a: "Utilisez la barre de recherche sur la page d'accueil pour trouver un professionnel par service et ville. Cliquez sur son profil, sélectionnez une prestation puis un créneau disponible. Vous devrez être connecté pour confirmer la réservation.",
      },
      {
        q: "Puis-je réserver sans créer de compte ?",
        a: "Non. Un compte client est nécessaire pour effectuer une réservation. L'inscription est gratuite et ne prend que quelques secondes.",
      },
      {
        q: "Comment annuler un rendez-vous ?",
        a: "Rendez-vous dans votre tableau de bord (section Réservations) et cliquez sur le bouton d'annulation à côté du rendez-vous concerné. Un email de confirmation d'annulation vous sera envoyé.",
      },
      {
        q: "Ma réservation est 'En attente', qu'est-ce que cela signifie ?",
        a: "Le professionnel doit confirmer votre demande. Vous recevrez une notification dès qu'il l'aura fait. Si vous n'avez pas de nouvelles dans les 24h, n'hésitez pas à contacter le professionnel.",
      },
    ],
  },
  {
    category: "Compte",
    items: [
      {
        q: "Comment modifier mes informations personnelles ?",
        a: "Allez dans Mon compte → Profil puis cliquez sur Modifier. Vous pouvez mettre à jour votre nom, email et numéro de téléphone.",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "Sur la page de connexion, cliquez sur « Mot de passe oublié ? ». Entrez votre email et vous recevrez un lien de réinitialisation valable 1 heure.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Dans Mon compte → Paramètres → Zone de danger, vous trouverez l'option de suppression. Attention, cette action est irréversible et supprime toutes vos données.",
      },
    ],
  },
  {
    category: "Pour les professionnels",
    items: [
      {
        q: "Comment inscrire mon entreprise ?",
        a: "Lors de l'inscription, choisissez « Je suis un professionnel ». Renseignez vos informations personnelles ainsi que les données de votre établissement (nom, secteur, adresse, slug public).",
      },
      {
        q: "Comment configurer mes créneaux ?",
        a: "Dans votre tableau de bord, utilisez l'onglet Semaine type pour définir vos jours et horaires habituels, puis cliquez sur Générer pour créer automatiquement vos créneaux sur la période souhaitée. Vous pouvez aussi les créer manuellement via l'onglet Créneaux.",
      },
      {
        q: "Comment gérer une période de fermeture ?",
        a: "Dans l'onglet Événements, créez un événement de type Fermeture ou Congés. Tous les créneaux disponibles dans cette plage seront automatiquement bloqués. Si des réservations existent sur cette période, vous pouvez choisir de les annuler (les clients seront notifiés par email).",
      },
    ],
  },
]

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function Aide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Centre d'aide</h1>
          <p className="text-gray-500 mt-2">Trouvez les réponses aux questions les plus fréquentes.</p>
        </div>

        <div className="space-y-8">
          {FAQ.map((section) => (
            <section key={section.category}>
              <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-3">
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-700 mb-3">Vous n'avez pas trouvé la réponse à votre question ?</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Contacter l'équipe
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
