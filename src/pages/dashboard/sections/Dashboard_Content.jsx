import React, { useState, useEffect } from 'react';
import { Eye, Mail, Phone, X, CheckCircle, Clock, Calendar as CalIcon } from 'lucide-react';

const MOCK_RESERVATIONS = [
    {
        db_id: 1,
        clientName: "Sophie Martin",
        clientEmail: "sophie.m@email.com",
        clientPhone: "06 12 34 56 78",
        clientSince: "12/05/2023",
        service: "Coupe & Brushing",
        duration: "45 min",
        price: 55,
        date: "2025-12-26",
        time: "14:30",
        status: "confirmed",
        notes: "Cheveux fragiles, éviter les produits trop agressifs.",
        mailStatus: true
    },
    {
        db_id: 2,
        clientName: "Thomas Dubois",
        clientEmail: "t.dubois@test.fr",
        clientPhone: "07 88 99 00 11",
        clientSince: "01/11/2024",
        service: "Taille de Barbe",
        duration: "20 min",
        price: 25,
        date: "2025-12-26",
        time: "16:15",
        status: "pending",
        notes: "",
        mailStatus: false
    }
];

const DashboardContent = () => {
    // On initialise avec les Mock Data pour ne pas avoir un tableau vide au début
    const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
    const [selectedRes, setSelectedRes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/entreprise/reservations")
            .then(res => {
                if (!res.ok) throw new Error("Serveur non disponible");
                return res.json();
            })
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(err => {
                console.warn("Utilisation des Mock Data (Le serveur Flask est probablement éteint)");
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Client</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Heure</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reservations.map((res) => (
                            <tr key={res.db_id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{res.clientName}</div>
                                    <div className="text-xs text-gray-500">{res.clientEmail}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{res.service}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{res.date} à {res.time}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {res.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setSelectedRes(res)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALE DE DÉTAILS (L'OEIL) */}
            {selectedRes && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        
                        <div className={`p-6 ${selectedRes.status === 'confirmed' ? 'bg-indigo-600' : 'bg-amber-500'} text-white flex justify-between items-start`}>
                            <div>
                                <h2 className="text-2xl font-bold">Détails du RDV</h2>
                                <p className="opacity-90 text-sm">ID Réservation : #{selectedRes.db_id}</p>
                            </div>
                            <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-white/20 rounded-full">
                                <X className="size-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-700 border border-gray-200">
                                    {selectedRes.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedRes.clientName}</h3>
                                    <p className="text-gray-500 text-sm italic font-medium">Membre depuis : {selectedRes.clientSince}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <a href={`tel:${selectedRes.clientPhone}`} className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-bold transition-colors border border-gray-200 text-sm">
                                    <Phone className="size-4 text-indigo-600" /> Appeler
                                </a>
                                <a href={`mailto:${selectedRes.clientEmail}`} className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-bold transition-colors border border-gray-200 text-sm">
                                    <Mail className="size-4 text-indigo-600" /> Email
                                </a>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Prestation</span>
                                    <span className="font-bold text-gray-800">{selectedRes.service} ({selectedRes.duration})</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Tarif</span>
                                    <span className="font-bold text-green-600 text-lg">{selectedRes.price} €</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Statut Confirmation Email</span>
                                    <span className={`flex items-center gap-1 font-bold ${selectedRes.mailStatus ? 'text-blue-600' : 'text-red-500'}`}>
                                        {selectedRes.mailStatus ? <CheckCircle className="size-4" /> : <Clock className="size-4" />}
                                        {selectedRes.mailStatus ? "Envoyé" : "En attente"}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <p className="text-amber-800 text-[10px] font-black uppercase tracking-wider mb-1">Note du client</p>
                                <p className="text-gray-700 text-sm leading-relaxed italic">
                                    "{selectedRes.notes || "Aucun commentaire particulier pour ce rendez-vous."}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardContent;