import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

const SECTIONS = [
  {
    titre: "1. Responsable du traitement",
    texte: `Book By Click est une application développée dans le cadre d'un projet pédagogique BTS SIO SLAM.
Pour toute question relative à vos données personnelles, vous pouvez nous contacter via le formulaire de contact disponible sur la plateforme.`,
  },
  {
    titre: "2. Données collectées",
    texte: `Lors de votre inscription et utilisation de la plateforme, nous collectons les données suivantes :
• Informations d'identité : nom, prénom, date de naissance
• Coordonnées : adresse email, numéro de téléphone
• Données de connexion : date d'inscription, horodatage des sessions
• Données de réservation : prestations réservées, créneaux choisis, commentaires

Pour les professionnels, nous collectons également les informations relatives à leur établissement (nom, adresse, secteur d'activité, slug public).`,
  },
  {
    titre: "3. Finalités du traitement",
    texte: `Vos données sont utilisées pour :
• Gérer votre compte et votre authentification
• Traiter et confirmer vos réservations
• Vous envoyer des notifications transactionnelles (confirmation, annulation)
• Permettre aux professionnels de gérer leur planning
• Assurer la sécurité et le bon fonctionnement de la plateforme`,
  },
  {
    titre: "4. Base légale",
    texte: `Le traitement de vos données est fondé sur :
• L'exécution du contrat : traitement nécessaire à la fourniture du service de réservation
• Le consentement : pour les communications non essentielles
• L'intérêt légitime : pour la sécurité et la prévention des fraudes`,
  },
  {
    titre: "5. Durée de conservation",
    texte: `Vos données sont conservées :
• Tant que votre compte est actif
• 3 ans après la dernière connexion pour les comptes inactifs
• Les données de réservation sont conservées 5 ans à des fins de traçabilité

Vous pouvez supprimer votre compte à tout moment depuis votre profil, ce qui entraîne la suppression immédiate de toutes vos données personnelles.`,
  },
  {
    titre: "6. Vos droits",
    texte: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement (droit à l'oubli)
• Droit à la portabilité
• Droit d'opposition au traitement

Pour exercer ces droits, contactez-nous via le formulaire de contact.`,
  },
  {
    titre: "7. Cookies",
    texte: `Book By Click utilise uniquement un cookie de session technique, nécessaire au fonctionnement de l'authentification. Ce cookie n'est pas utilisé à des fins de tracking ou de publicité.`,
  },
  {
    titre: "8. Sécurité",
    texte: `Les mots de passe sont stockés sous forme de hash (bcrypt) et ne sont jamais accessibles en clair. Les communications entre le navigateur et le serveur sont sécurisées. Les sessions sont invalidées à la déconnexion.`,
  },
]

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
          <p className="text-gray-500 mt-2 text-sm">Dernière mise à jour : mai 2026</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 mb-8 text-sm text-indigo-800">
          Book By Click s'engage à protéger vos données personnelles conformément au RGPD
          (Règlement Général sur la Protection des Données — Règlement UE 2016/679).
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.titre}>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{s.titre}</h2>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {s.texte}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/contact" className="text-indigo-600 hover:underline text-sm">
            Une question ? Contactez-nous →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
