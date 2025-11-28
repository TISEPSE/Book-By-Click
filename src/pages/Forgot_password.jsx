export default function Forgot_password() {
  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Mot de passe oublié
            </h3>
          </div>
        </div>

        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg text-left">
          <form
            className="space-y-5"
            action="http://localhost:5000/login_form"
            method="POST"
          >
            <div className="flex flex-col items-start">
              <label className="font-medium block text-left">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <a
                href="/login_form"
                className="text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Se connecter
              </a>
            </div>

            <button
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              type="submit"
            >
              Envoyer un lien par mail
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
