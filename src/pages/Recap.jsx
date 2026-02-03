import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Recap() {
  const { state } = useLocation();
  const data = state?.data || {}; // objet par défaut

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

        {/* AFFICHE LES PROPRIÉTÉS, PAS L'OBJET ENTIER */}
        <h1>Objet : {JSON.stringify(data)}</h1>
        <p>Email : {data.email}</p>
        <p>Mot de passe : {data.password}</p>

        <Link to="/" className="text-indigo-600 underline block mt-4">
          Retour
        </Link>
      </div>
    </div>
    </>
  );
}