import useFormSubmit from "../Hook/useForm";

export default function Login() {
  const { handleSubmit } = useFormSubmit(
    "http://localhost:5000/login_form",
    "/recap"
  );

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl space-y-6 text-gray-600 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
            Formulaire de Contact
          </h3>
        </div>
        <div className="bg-white shadow p-6 sm:rounded-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Nom / Prénom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex: Jean Dupont"
              className="w-full h-12 px-4 border rounded-lg text-base sm:text-lg"
            />

            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Ex: jean.dupont@email.com"
              className="w-full h-12 px-4 border rounded-lg text-base sm:text-lg"
            />

            <label htmlFor="telephone" className="block text-gray-700 font-medium mb-1">
              Téléphone
            </label>
            <input
              id="telephone"
              name="Telephone"
              type="tel"
              required
              placeholder="Ex: 0612345678"
              className="w-full h-12 px-4 border rounded-lg text-base sm:text-lg"
              inputMode="numeric"
              onInput={e => (e.target.value = e.target.value.replace(/\D/g, ""))}
            />

            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="Message"
              required
              placeholder="Ex: Bonjour, je souhaite avoir plus d'informations sur vos services."
              rows="5"
              className="w-full min-h-[120px] px-4 py-3 border rounded-lg text-base sm:text-lg"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
