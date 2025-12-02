import { BuildingOffice2Icon } from "@heroicons/react/24/outline"

export default function ProfessionalRegisterForm() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-4">
            {/* Logo et titre avec icône */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <BuildingOffice2Icon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                  Créer un compte Pro
                </h3>
              </div>
            </div>
            
            <p>
              Déjà un compte ?{" "}
              <a
                href="/login_pro"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form
            className="space-y-5"
          >
            {/* Nom de l'entreprise */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Nom de l'entreprise *</label>
              <input
                type="text"
                name="companyName"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                placeholder="Votre entreprise"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Email professionnel *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                placeholder="contact@entreprise.com"
              />
            </div>

            {/* Secteur d'activité */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Secteur d'activité *</label>
              <select
                name="sector"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
              >
                <option value="">Sélectionnez un secteur</option>
                <option value="restauration">Restauration</option>
                <option value="sante">Santé & Bien-être</option>
                <option value="beaute">Beauté & Coiffure</option>
                <option value="sport">Sport & Fitness</option>
                <option value="consulting">Consulting</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Adresse */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Adresse *</label>
              <input
                type="text"
                name="address"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                placeholder="123 Rue de l'Exemple"
              />
            </div>

            {/* Code postal et Ville */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Code postal *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                  placeholder="75000"
                />
              </div>
              
              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Ville *</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                  placeholder="Paris"
                />
              </div>
            </div>

            {/* Pays */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Pays *</label>
              <select
                name="country"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
              >
                <option value="">Sélectionnez un pays</option>
                <option value="france">France</option>
                <option value="belgique">Belgique</option>
                <option value="suisse">Suisse</option>
                <option value="luxembourg">Luxembourg</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Mot de passe *</label>
              <input
                type="password"
                name="password"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec lettres et chiffres
              </p>
            </div>

            {/* Confirmation mot de passe */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-blue-600 shadow-sm rounded-lg"
                placeholder="••••••••"
              />
            </div>

            {/* Checkbox conditions */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className="checkbox-item peer hidden"
                  required
                />
                <label
                  htmlFor="terms-checkbox"
                  className="relative flex w-5 h-5 bg-white peer-checked:bg-blue-600 rounded-md border ring-offset-2 ring-blue-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                ></label>
                <span>
                  J'accepte les{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500 hover:underline">
                    conditions d'utilisation
                  </a>
                </span>
              </div>
            </div>

            <button
              className="w-full px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-600 rounded-lg duration-150"
              type="submit"
            >
              Créer mon compte Pro
            </button>
          </form>

          <div className="mt-5">
            <button className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                    fill="#34A853"
                  />
                  <path
                    d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              S'inscrire avec Google
            </button>

            {/* Section liens supplémentaires */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="text-center">
                <a 
                  href="/register_choice" 
                  className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour en arrière
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}