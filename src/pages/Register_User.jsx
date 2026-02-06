import { UserIcon } from "@heroicons/react/24/outline"
import PasswordChecklist from "react-password-checklist"
import { useState } from "react"
import useSubmitForm_user from "../Hook/useSubmitForm_user"
import Toast from "../components/Toast"
import Navbar from "../components/Navbar"

export default function Register_User() {
  const { handleSubmit, toast, closeToast } = useSubmitForm_user(
    "/api/register/user",
    "Compte créé avec succès !",
    "Erreur lors de la création du compte"
  )

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isValid, setIsValid] = useState(false)

  return (
    <>
      <Navbar />
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={closeToast} />
      {/* Conteneur principal : centre le formulaire verticalement et horizontalement */}
      <main className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        {/* En-tête du formulaire */}
        <div className="text-center">
          <div className="mt-5 space-y-4">
            {/* Icône et titre */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Créer un compte client
              </h3>
            </div>

            {/* Lien vers la page de connexion */}
            <p>
              Déjà un compte ?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              if (!isValid) {
                e.preventDefault()
                return
              }
              handleSubmit(e)
            }}
          >
            {/* Champ email */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="votre@email.com"
                className="
                  w-full mt-2 px-3 py-2
                  text-gray-500 bg-transparent
                  outline-none
                  border border-gray-300
                  focus:border-indigo-600
                  shadow-sm
                  rounded-lg
                "
              />
            </div>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  placeholder="Jean"
                  className="
                    w-full mt-2 px-3 py-2
                    text-gray-500 bg-transparent
                    outline-none
                    border border-gray-300
                    focus:border-indigo-600
                    shadow-sm
                    rounded-lg
                  "
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="font-medium block text-left">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Dupont"
                  className="
                    w-full mt-2 px-3 py-2
                    text-gray-500 bg-transparent
                    outline-none
                    border border-gray-300
                    focus:border-indigo-600
                    shadow-sm
                    rounded-lg
                  "
                />
              </div>
            </div>

            {/* Date de naissance */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">
                Date de naissance
              </label>
              <input
                type="date"
                name="dateNaissance"
                required
                className="
                  w-full mt-2 px-3 py-2
                  text-gray-500 bg-transparent
                  outline-none
                  border border-gray-300
                  focus:border-indigo-600
                  shadow-sm
                  rounded-lg
                "
              />
            </div>

            {/* Téléphone */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                required
                placeholder="06 01 02 03 04"
                className="
                  w-full mt-2 px-3 py-2
                  text-gray-500 bg-transparent
                  outline-none
                  border border-gray-300
                  focus:border-indigo-600
                  shadow-sm
                  rounded-lg
                "
              />
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full mt-2 px-3 py-2
                  text-gray-500 bg-transparent
                  outline-none
                  border border-gray-300
                  focus:border-indigo-600
                  shadow-sm
                  rounded-lg
                "
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec lettres et chiffres
              </p>
            </div>

            {/* Confirmation mot de passe */}
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                  w-full mt-2 px-3 py-2
                  text-gray-500 bg-transparent
                  outline-none
                  border border-gray-300
                  focus:border-indigo-600
                  shadow-sm
                  rounded-lg
                "
              />
            </div>

            {/* Vérification mot de passe */}
            <PasswordChecklist
              rules={["match", "minLength", "capital"]}
              value={password}
              minLength={10}
              valueAgain={confirmPassword}
              messages={{ match: "Les mots de passe doivent être identiques", minLength: "Les mots de passe doivent contenir au moins 8 caractères", capital: "Les mots de passe doit contenir au moins une lettre majuscule" }}
              onChange={(valid) => setIsValid(valid)}
              className="text-xxl"
            />

            {/* Conditions d'utilisation*/}
            <div className="flex items-center gap-x-3 text-sm">
              <input type="checkbox" required />
              <span>
                J’accepte les{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  conditions d'utilisation
                </a>
              </span>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={!isValid}
              className={`
                w-full px-4 py-2
                text-white font-medium
                rounded-lg
                duration-150
                ${isValid ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-400 cursor-not-allowed"}
              `}
            >
              Créer mon compte
            </button>
          </form>
        </div>
      </div>
    </main>
    </>
  )
}
