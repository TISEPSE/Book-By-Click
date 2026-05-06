import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

const ARTICLES = [
  {
    titre: "Article 1 – Objet",
    texte: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Book By Click, accessible à l'adresse localhost:5173 en environnement local.

En s'inscrivant ou en utilisant la plateforme, l'utilisateur accepte sans réserve les présentes conditions.`,
  },
  {
    titre: "Article 2 – Description du service",
    texte: `Book By Click est une plateforme de mise en relation permettant :
• Aux clients de rechercher des professionnels et de réserver des prestations en ligne
• Aux professionnels de gérer leur planning, leurs créneaux de disponibilité et leurs réservations

La plateforme agit en tant qu'intermédiaire technique et n'est pas partie prenante aux prestations réalisées entre clients et professionnels.`,
  },
  {
    titre: "Article 3 – Inscription et compte",
    texte: `L'inscription est gratuite et ouverte à toute personne physique majeure. L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte et à les maintenir à jour.

Chaque utilisateur est responsable de la confidentialité de ses identifiants. Toute utilisation du compte effectuée avec les identifiants de l'utilisateur est réputée effectuée par lui.

Book By Click se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation abusive, frauduleuse ou contraire aux présentes CGU.`,
  },
  {
    titre: "Article 4 – Réservations",
    texte: `Une réservation est confirmée lorsque le client a sélectionné un créneau disponible et que le professionnel l'a validée. Le créneau est bloqué immédiatement après la demande pour éviter les doubles réservations.

L'annulation d'une réservation est possible depuis le tableau de bord du client ou du professionnel. L'annulation libère le créneau et déclenche l'envoi d'un email de notification.

Book By Click ne gère pas les paiements. Les modalités financières sont arrêtées directement entre le client et le professionnel.`,
  },
  {
    titre: "Article 5 – Obligations des professionnels",
    texte: `Le professionnel s'engage à :
• Proposer des créneaux reflétant sa disponibilité réelle
• Confirmer ou annuler les demandes dans un délai raisonnable
• Informer les clients de tout changement susceptible d'impacter leur rendez-vous
• Exercer son activité dans le respect de la réglementation applicable à sa profession`,
  },
  {
    titre: "Article 6 – Responsabilité",
    texte: `Book By Click met tout en œuvre pour assurer la disponibilité et la sécurité de la plateforme mais ne peut garantir une disponibilité ininterrompue.

La plateforme ne saurait être tenue responsable des litiges survenant entre clients et professionnels, ni des préjudices résultant d'une utilisation incorrecte du service.`,
  },
  {
    titre: "Article 7 – Données personnelles",
    texte: `Le traitement des données personnelles est décrit dans la Politique de confidentialité, accessible depuis le pied de page de la plateforme.`,
  },
  {
    titre: "Article 8 – Modification des CGU",
    texte: `Book By Click se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications significatives. La poursuite de l'utilisation de la plateforme après notification vaut acceptation des nouvelles conditions.`,
  },
  {
    titre: "Article 9 – Droit applicable",
    texte: `Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.`,
  },
]

export default function Conditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conditions d'utilisation</h1>
          <p className="text-gray-500 mt-2 text-sm">Dernière mise à jour : mai 2026</p>
        </div>

        <div className="space-y-6">
          {ARTICLES.map((a) => (
            <section key={a.titre} className="bg-white border border-gray-200 rounded-xl px-5 py-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">{a.titre}</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{a.texte}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center text-sm">
          <Link to="/confidentialite" className="text-indigo-600 hover:underline">
            Politique de confidentialité →
          </Link>
          <span className="hidden sm:block text-gray-300">|</span>
          <Link to="/contact" className="text-indigo-600 hover:underline">
            Nous contacter →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
