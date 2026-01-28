import React, { useState, useEffect } from 'react';
import { Eye, Mail, Phone, X } from 'lucide-react';

const ClientsContent = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/entreprise/clients", {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Serveur non disponible");
                return res.json();
            })
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des clients :", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Clients</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                    <p>Erreur : {error}. Veuillez vérifier que le serveur backend est en cours d'exécution.</p>
                </div>
            )}

            {!error && clients.length === 0 && !loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 mb-6">
                    <p>Aucun client trouvé. Veuillez ajouter des clients ou vérifier les données.</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Client</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Téléphone</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Inscrit le</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Réservations</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {client.prenom[0]}{client.nom[0]}
                                        </div>
                                        <div className="font-medium text-gray-900">{client.prenom} {client.nom}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{client.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{client.telephone}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{client.dateInscription}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        {client.nbReservations} réservation(s)
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedClient(client)}
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
            {selectedClient && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200">

                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold">Détails du Client</h2>
                                <p className="opacity-90 text-sm">ID Client : #{selectedClient.id}</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-white/20 rounded-full">
                                <X className="size-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-700 border border-indigo-200">
                                    {selectedClient.prenom[0]}{selectedClient.nom[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedClient.prenom} {selectedClient.nom}</h3>
                                    <p className="text-gray-500 text-sm italic font-medium">Membre depuis : {selectedClient.dateInscription}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <a href={`tel:${selectedClient.telephone}`} className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-bold transition-colors border border-gray-200 text-sm">
                                    <Phone className="size-4 text-indigo-600" /> Appeler
                                </a>
                                <a href={`mailto:${selectedClient.email}`} className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-bold transition-colors border border-gray-200 text-sm">
                                    <Mail className="size-4 text-indigo-600" /> Email
                                </a>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-bold text-gray-800">{selectedClient.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Téléphone</span>
                                    <span className="font-bold text-gray-800">{selectedClient.telephone}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Réservations</span>
                                    <span className="font-bold text-green-600 text-lg">{selectedClient.nbReservations}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsContent;
