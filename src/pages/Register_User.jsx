import { UserIcon } from "@heroicons/react/24/outline"
import useSubmitForm from "../Hook/useSubmitForm"

export default function Register_User() {
  const { handleSubmit } = useSubmitForm("/api/register/user")

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Créer un compte client
              </h3>
            </div>
            <p>
              Déjà un compte ?{" "}
              <a
                href="/login_form"
                className="font-medium text-indigo-600 hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-medium">Adresse email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="votre@email.com"
                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  placeholder="Jean"
                  className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Dupont"
                  className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Date de naissance</label>
              <input
                type="date"
                name="dateNaissance"
                required
                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-medium">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                required
                placeholder="0601020304"
                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-medium">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec lettres et chiffres
              </p>
            </div>

            <div>
              <label className="font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-3 text-sm">
              <input type="checkbox" required />
              <span>
                J’accepte les{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  conditions
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500"
            >
              Créer mon compte
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
