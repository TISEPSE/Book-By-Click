import { useState } from "react"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { Search, MapPin, Calendar, Clock, CheckCircle, Users, TrendingUp } from "lucide-react"

export default function Home() {
  // State for search inputs - ready for future implementation
  const [serviceInput, setServiceInput] = useState("")
  const [locationInput, setLocationInput] = useState("")

  // Handle search submission (placeholder for future implementation)
  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", serviceInput, "in", locationInput)
    // Future: Implement actual search logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar - Clean and minimal */}
      <nav className="relative bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 group">
              <CalendarDaysIcon className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-gray-900">
                Book By Click
              </span>
            </a>

            {/* Navigation Links - Desktop */}
            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <a
                  href="https://tisepse.github.io/Documentation-BBC/"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Comment ça marche
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="login_form"
                className="hidden sm:block px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
              >
                Se connecter
              </a>
              <a
                href="register_choice"
                className="px-5 py-2.5 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Créer un compte
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Planity-inspired with centered search bar */}
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-8">
          {/* Hero Content - Centered */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>La solution de réservation n°1 en France</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Réservez tous vos
              <span className="text-indigo-600"> rendez-vous</span>
              <br />
              en un seul clic
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Coiffeur, restaurant, médecin, esthéticienne... Trouvez et réservez instantanément auprès de milliers de professionnels près de chez vous.
            </p>

            {/* Search Bar - Main CTA - Planity-inspired design */}
            <div className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch}>
                {/* Search Card Container */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 transition-shadow duration-300 hover:shadow-2xl">
                  {/* Search Inputs Container - Responsive layout */}
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                    {/* Service/Business Type Input */}
                    <div className="flex-1 relative group">
                      <label
                        htmlFor="service"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Que recherchez-vous ?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
                        <input
                          id="service"
                          type="text"
                          placeholder="Coiffeur, restaurant, médecin..."
                          value={serviceInput}
                          onChange={(e) => setServiceInput(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 text-base"
                        />
                      </div>
                    </div>

                    {/* Location Input */}
                    <div className="flex-1 relative group">
                      <label
                        htmlFor="location"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Où ?
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
                        <input
                          id="location"
                          type="text"
                          placeholder="Paris, Lyon, Marseille..."
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 text-base"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="lg:self-end">
                      <button
                        type="submit"
                        className="w-full lg:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Rechercher</span>
                      </button>
                    </div>
                  </div>

                  {/* Popular Searches - Quick suggestions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Recherches populaires :</p>
                    <div className="flex flex-wrap gap-2">
                      {["Coiffeur", "Restaurant", "Médecin", "Esthéticienne", "Massage"].map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setServiceInput(tag)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-300"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Réservation instantanée</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>10,000+ professionnels</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>Gratuit & sans engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Simple 3-step process */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Réservez votre rendez-vous en 3 étapes simples et rapides
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 group-hover:bg-indigo-600 rounded-2xl mb-6 transition-all duration-300">
                <Search className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="relative mb-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  Recherchez
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trouvez le professionnel qui correspond à vos besoins parmi des milliers d'établissements près de chez vous.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 group-hover:bg-purple-600 rounded-2xl mb-6 transition-all duration-300">
                <Calendar className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="relative mb-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  Réservez
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Choisissez le créneau horaire qui vous convient et réservez instantanément en quelques clics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 group-hover:bg-green-600 rounded-2xl mb-6 transition-all duration-300">
                <CheckCircle className="w-10 h-10 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="relative mb-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  Confirmé !
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Recevez une confirmation instantanée par email et SMS. Gérez facilement vos rendez-vous.
              </p>
            </div>
          </div>

          {/* CTA after steps */}
          <div className="text-center mt-12">
            <a
              href="register_choice"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Commencer gratuitement</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Catégories populaires
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des milliers de professionnels à votre service
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Coiffure", emoji: "💇", color: "bg-pink-100 hover:bg-pink-200 border-pink-200" },
              { name: "Restaurant", emoji: "🍽️", color: "bg-orange-100 hover:bg-orange-200 border-orange-200" },
              { name: "Médecin", emoji: "🏥", color: "bg-blue-100 hover:bg-blue-200 border-blue-200" },
              { name: "Beauté", emoji: "💅", color: "bg-purple-100 hover:bg-purple-200 border-purple-200" },
              { name: "Sport", emoji: "💪", color: "bg-green-100 hover:bg-green-200 border-green-200" },
              { name: "Bien-être", emoji: "🧘", color: "bg-indigo-100 hover:bg-indigo-200 border-indigo-200" },
            ].map((category) => (
              <button
                key={category.name}
                className={`${category.color} border-2 p-6 rounded-xl transition-all duration-300 text-center group hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <p className="text-sm font-semibold text-gray-900">{category.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image/Visual */}
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Interface Book By Click"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            {/* Right - Benefits */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi choisir Book By Click ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                La plateforme de réservation la plus complète et intuitive du marché
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Clock,
                    title: "Gain de temps",
                    description: "Réservez en 30 secondes, 24h/24 et 7j/7, sans appel téléphonique",
                  },
                  {
                    icon: CheckCircle,
                    title: "Confirmation instantanée",
                    description: "Recevez immédiatement la confirmation de votre réservation",
                  },
                  {
                    icon: Calendar,
                    title: "Gestion simplifiée",
                    description: "Gérez tous vos rendez-vous depuis un seul espace personnel",
                  },
                  {
                    icon: Users,
                    title: "Réseau de confiance",
                    description: "Des milliers de professionnels vérifiés et notés par les utilisateurs",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <benefit.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Sign up now */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}></div>
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à simplifier vos réservations ?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà adopté Book By Click pour gérer leurs rendez-vous
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="register_choice"
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Créer mon compte gratuitement
            </a>
            <a
              href="login_form"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Se connecter
            </a>
          </div>

          <p className="text-indigo-100 text-sm mt-6">
            Sans carte bancaire • Sans engagement • Annulation gratuite
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
            {/* Column 1 - Logo and description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarDaysIcon className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold">Book By Click</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Book By Click révolutionne la gestion des réservations avec une solution simple, efficace et sécurisée pour tous vos besoins de planning.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a
                    href="https://tisepse.github.io/Documentation-BBC/"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    À propos
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Conditions d'utilisation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Book By Click. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
