import { useState } from 'react';

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
        alert('❌ Erreur : ' + data.error);
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
              className="w-full h-12 px-4 border rounded-lg text-base sm:text-lg"
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
              className="w-full h-12 px-4 border rounded-lg text-base sm:text-lg"
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
              rows="5"
              className="w-full min-h-[120px] px-4 py-3 border rounded-lg text-base sm:text-lg"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
