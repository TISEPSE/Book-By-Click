import Navbar from "../components/Navbar";

export default function Forgot_password() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Mot de passe oublié ?
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Pas d'inquiétude ! Un email vous sera envoyé avec un lien de réinitialisation sécurisé.
            </p>
          </div>
        </div>

        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form
            className="space-y-5"
            action="http://localhost:5000/forgot_password" // J'ai corrigé l'endpoint
            method="POST"
          >
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                required
                className="w-full px-3 py-3 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg transition duration-200"
              />
            </div>

            <button
              className="w-full px-4 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg duration-150 transition-all "
              type="submit"
            >
              Envoyer le lien de réinitialisation
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="text-center">
              <a 
                href="/login_form" 
                className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}