import {CalendarDaysIcon} from "@heroicons/react/24/outline"

export default function Home() {
  return (
    <div>
      <nav className="relative items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 md:flex md:space-x-6">
        <div className="flex justify-between items-center w-full">
          <a href="#" className="mr-6">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-8 h-8 text-indigo-600 " />
              <a href="/" className="text-xl font-bold text-gray-900">
                Book By Click
              </a>
            </div>
          </a>
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="https://tisepse.github.io/Documentation-BBC/"
                  className="text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  Tutoriels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  À propos
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="py-28">
        <div className="max-w-screen-xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
          <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
            <h1 className="text-sm text-indigo-600 font-medium">
              La confiance démarre en 1 clique
            </h1>
            <h2 className="text-4xl text-gray-800 font-extrabold md:text-5xl">
              Book By Click
            </h2>
            <p className="text-lg leading-relaxed">
              Simplifiez la gestion de vos réservations avec notre solution
              tout-en-un.
              <span className="block mt-2">
                Que vous soyez professionnel ou particulier, Book By Click vous
                offre une expérience de réservation fluide, intuitive et
                sécurisée.
              </span>
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">
                  Réservations en temps réel
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">
                  Interface intuitive et moderne
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">
                  Sécurité et fiabilité garanties
                </span>
              </div>
            </div>

            <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <a
                href="login_form"
                className="block py-3 px-6 text-center text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none transition-all"
              >
                Se connecter
              </a>
              <a
                href="register_choice"
                className="flex items-center justify-center gap-x-2 py-3 px-6 text-gray-700 hover:text-gray-500 font-medium duration-150 active:bg-gray-100 border rounded-lg md:inline-flex hover:border-indigo-300 transition-all"
              >
                Créer un compte
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
          <div className="flex-none mt-10 md:mt-0 md:max-w-xl">
            <img
              src="https://images.unsplash.com/photo-1573164713619-24c711fe7878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80"
              className="md:rounded-tl-[108px] shadow-2xl"
              alt="Interface de réservation Book By Click"
            />
          </div>
        </div>
      </section>

      {/* Footer réduit */}
      <footer className="bg-gray-900 text-white py-8 md:py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Colonne 1 - Logo et description */}
            <div className="col-span-1 md:col-span-2">
              <img
                src="/public/bbc-seeklogo.png"
                width="100"
                height="42"
                alt="Book By Click logo"
                className="mb-3"
              />
              <p className="text-gray-400 mb-3 max-w-md text-sm">
                Book By Click révolutionne la gestion des réservations avec une
                solution simple, efficace et sécurisée pour tous vos besoins de
                planning.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Colonne 2 - Liens rapides */}
            <div>
              <h3 className="text-base font-semibold mb-3">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li></li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    À propos
                  </a>
                </li>
              </ul>
            </div>

            {/* Colonne 3 - Support */}
            <div>
              <h3 className="text-base font-semibold mb-3">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                  >
                    Conditions d'utilisation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Bas du footer */}
          <div className="border-t border-gray-800 mt-3 pt-3 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Book By Click. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
