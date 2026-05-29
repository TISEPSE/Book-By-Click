import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { Users, Zap, Shield, Heart } from "lucide-react"

const VALEURS = [
  {
    icon: Zap,
    titre: "Simplicité",
    texte: "Un professionnel ne devrait pas avoir besoin d'un logiciel complexe pour gérer ses rendez-vous. Book By Click est conçu pour être opérationnel en quelques minutes.",
  },
  {
    icon: Shield,
    titre: "Fiabilité",
    texte: "Aucune double réservation, aucun oubli. Chaque créneau est verrouillé dès sa réservation et les deux parties reçoivent une confirmation par email.",
  },
  {
    icon: Users,
    titre: "Accessibilité",
    texte: "La plateforme est pensée pour des utilisateurs non techniques : artisans, coachs, esthéticiennes, coiffeurs. Pas de jargon, pas de configuration compliquée.",
  },
  {
    icon: Heart,
    titre: "Proximité",
    texte: "Book By Click s'adresse aux indépendants et petits professionnels qui méritent les mêmes outils que les grandes enseignes, sans les mêmes coûts.",
  },
]

export default function APropos() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="flex justify-center mb-4">
            <CalendarDaysIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">À propos de Book By Click</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Une solution de gestion de rendez-vous en ligne pensée pour les professionnels
            indépendants qui souhaitent moderniser leur planning sans complexité.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        {/* Notre mission */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notre mission</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600 leading-relaxed space-y-3">
            <p>
              Aujourd'hui, beaucoup de petits professionnels — coiffeurs, coachs, kinésithérapeutes,
              auto-entrepreneurs — gèrent encore leurs rendez-vous par téléphone, SMS ou messagerie
              instantanée. Cette approche génère des erreurs de planning, des doublons et une perte
              de temps considérable.
            </p>
            <p>
              Book By Click est né de ce constat. Notre objectif est simple : offrir à ces professionnels
              une plateforme numérique centralisée, accessible depuis n'importe quel appareil, qui
              automatise la prise de rendez-vous et libère du temps pour l'essentiel — leur métier.
            </p>
          </div>
        </section>

        {/* Valeurs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALEURS.map(({ icon: Icon, titre, texte }) => (
              <div key={titre} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg h-fit">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{titre}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{texte}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projet */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Le projet</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600 leading-relaxed space-y-3">
            <p>
              Book By Click est un projet développé dans le cadre du BTS Services Informatiques
              aux Organisations (option SLAM), session 2026, à l'ESNA de Bruz Ker Lann.
            </p>
            <p>
              L'application repose sur une architecture 3-tiers : une interface React 19 côté client,
              une API REST Flask côté serveur et une base de données PostgreSQL 15. L'ensemble est
              conteneurisé avec Docker pour garantir la portabilité et la reproductibilité des environnements.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-xl p-8 text-center text-white">
          <p className="text-lg font-semibold mb-2">Une question ? Une remarque ?</p>
          <p className="text-indigo-200 text-sm mb-4">Notre équipe est disponible pour vous répondre.</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50"
          >
            Nous contacter
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  )
}
