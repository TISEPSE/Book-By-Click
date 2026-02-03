import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('http://127.0.0.1:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        alert('Votre message a été envoyé avec succès !');
      } else {
        setStatus('error');
        alert('Erreur : ' + data.error);
      }
    } catch (error) {
      setStatus('error');
      alert('Erreur lors de l\'envoi du message');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-12 pt-24">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md px-4">
        <div className="text-center">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
            Formulaire de Contact
          </h3>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
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
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              value={formData.name}
              onChange={handleChange}
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
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="telephone" className="block text-gray-700 font-medium mb-1">
              Téléphone
            </label>
            <input
              id="telephone"
              name="phone"
              type="tel"
              required
              placeholder="Ex: 0612345678"
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              inputMode="numeric"
              value={formData.phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, phone: numericValue });
              }}
            />

            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="Ex: Bonjour, je souhaite avoir plus d'informations sur vos services."
              rows="4"
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 focus:border-indigo-600 shadow-sm rounded-lg"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>

          <div className="mt-5">
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <a
                  href="/"
                  className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
