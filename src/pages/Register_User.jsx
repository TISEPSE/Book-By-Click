import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";
import useSubmitForm from "../Hook/useSubmitForm";

export default function Register_User() {
  const { handleSubmit } = useSubmitForm("/api/register/user");

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Créer un compte client
              </h3>
            </div>
            <p>
              Déjà un compte ?{" "}
              <a
                href="/login_form"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Adresse email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
                placeholder="votre@email.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
                  placeholder="Jean"
                />
              </div>
              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Date de naissance</label>
              <input
                type="date"
                name="birthDate"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec lettres et chiffres
              </p>
            </div>

            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-x-3 text-sm">
              <input type="checkbox" id="terms-checkbox" className="peer hidden" />
              <label
                htmlFor="terms-checkbox"
                className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
              ></label>
              <span>
                J'accepte les{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                  conditions
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg"
            >
              Créer mon compte
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
