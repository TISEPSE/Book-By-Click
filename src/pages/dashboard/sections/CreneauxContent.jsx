import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

// 0=Dim, 1=Lun, ..., 6=Sam  (JS getDay())
const JOURS = [
    { key: 1, label: 'Lundi',    short: 'Lun' },
    { key: 2, label: 'Mardi',    short: 'Mar' },
    { key: 3, label: 'Mercredi', short: 'Mer' },
    { key: 4, label: 'Jeudi',    short: 'Jeu' },
    { key: 5, label: 'Vendredi', short: 'Ven' },
    { key: 6, label: 'Samedi',   short: 'Sam' },
    { key: 0, label: 'Dimanche', short: 'Dim' },
];

const CreneauxContent = () => {
    const [creneaux,       setCreneaux]       = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState(null);
    const [showModal,      setShowModal]      = useState(false);
    const [editingCreneau, setEditingCreneau] = useState(null);
    const [weekOffset,     setWeekOffset]     = useState(0);
    const [formData,       setFormData]       = useState({
        jour: 1, heureDebut: '09:00', heureFin: '10:00', nbMax: 1,
    });

    // Lundi de la semaine sélectionnée
    const weekStart = useMemo(() => {
        const base = startOfWeek(new Date(), { weekStartsOn: 1 });
        return addDays(base, weekOffset * 7);
    }, [weekOffset]);

    const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

    // Date réelle d'un jour dans la semaine affichée
    // JOURS.key : 1=Lun … 6=Sam, 0=Dim
    const getDateForDayKey = (dayKey) => {
        const offset = dayKey === 0 ? 6 : dayKey - 1; // Lun=0, Mar=1, ..., Dim=6
        return addDays(weekStart, offset);
    };

    const fetchCreneaux = () => {
        fetch("/api/entreprise/creneaux", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Serveur non disponible");
                return res.json();
            })
            .then(data => { setCreneaux(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    };

    useEffect(() => { fetchCreneaux(); }, []);

    // Grouper les créneaux de la semaine affichée par jour
    const creneauxParJour = useMemo(() => {
        const grouped = {};
        JOURS.forEach(j => { grouped[j.key] = []; });

        creneaux.forEach(c => {
            const d = new Date(c.dateHeureDebut);
            if (d >= weekStart && d < weekEnd) {
                const dayKey = d.getDay();
                if (grouped[dayKey] !== undefined) grouped[dayKey].push(c);
            }
        });

        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => new Date(a.dateHeureDebut) - new Date(b.dateHeureDebut));
        });
        return grouped;
    }, [creneaux, weekStart, weekEnd]);

    // Retourne la date ISO du jour demandé dans la semaine affichée
    const getReferenceDateForDay = (dayKey) => {
        const d = getDateForDayKey(dayKey);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const openCreateModal = (jour = 1) => {
        setEditingCreneau(null);
        setFormData({ jour, heureDebut: '09:00', heureFin: '10:00', nbMax: 1 });
        setShowModal(true);
    };

    const openEditModal = (creneau) => {
        setEditingCreneau(creneau);
        const debut = new Date(creneau.dateHeureDebut);
        const fin   = new Date(creneau.dateHeureFin);
        setFormData({
            jour: debut.getDay(),
            heureDebut: debut.toTimeString().slice(0, 5),
            heureFin:   fin.toTimeString().slice(0, 5),
            nbMax: creneau.nbMaxReservations || 1,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const refDate        = getReferenceDateForDay(formData.jour);
        const dateHeureDebut = `${refDate}T${formData.heureDebut}:00`;
        const dateHeureFin   = `${refDate}T${formData.heureFin}:00`;

        try {
            const url = editingCreneau
                ? `/api/entreprise/creneaux/${editingCreneau.id}`
                : '/api/entreprise/creneaux';

            const res = await fetch(url, {
                method: editingCreneau ? 'PUT' : 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dateHeureDebut, dateHeureFin, nbMaxReservations: formData.nbMax }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur serveur');
            }
            setShowModal(false);
            fetchCreneaux();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce créneau ?")) return;
        try {
            const res = await fetch(`/api/entreprise/creneaux/${id}`, {
                method: 'DELETE', credentials: 'include',
            });
            if (!res.ok) throw new Error('Erreur serveur');
            fetchCreneaux();
        } catch (err) {
            alert(err.message);
        }
    };

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const isCurrentWeek = weekOffset === 0;

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Planning hebdomadaire</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos créneaux de disponibilité</p>
                </div>
                <button
                    onClick={() => openCreateModal(1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                    <Plus className="size-4" />
                    Nouveau créneau
                </button>
            </div>

            {/* Navigation semaine */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                <button
                    onClick={() => setWeekOffset(w => w - 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">
                        Semaine du {format(weekStart, 'd MMMM yyyy', { locale: fr })}
                    </p>
                    {isCurrentWeek && (
                        <span className="text-xs text-indigo-600 font-medium">Semaine actuelle</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isCurrentWeek && (
                        <button
                            onClick={() => setWeekOffset(0)}
                            className="text-xs text-indigo-600 hover:underline px-2"
                        >
                            Aujourd'hui
                        </button>
                    )}
                    <button
                        onClick={() => setWeekOffset(w => w + 1)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    Erreur : {error}
                </div>
            )}

            {/* Grille hebdomadaire */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {JOURS.map((jour) => {
                    const slots    = creneauxParJour[jour.key] || [];
                    const hasSlots = slots.length > 0;
                    const dateCol  = getDateForDayKey(jour.key);
                    const isToday  = format(dateCol, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                    return (
                        <div
                            key={jour.key}
                            className={`rounded-xl border overflow-hidden flex flex-col ${
                                hasSlots
                                    ? 'bg-white border-gray-200 shadow-sm'
                                    : 'bg-gray-50/80 border-dashed border-gray-300'
                            }`}
                        >
                            {/* Header du jour */}
                            <div
                                className={`px-3 py-3 text-center border-b ${
                                    isToday
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : hasSlots
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-gray-100 border-gray-200'
                                }`}
                            >
                                <p className={`text-sm font-bold ${isToday || hasSlots ? 'text-white' : 'text-gray-400'}`}>
                                    {jour.label}
                                </p>
                                <p className={`text-xs mt-0.5 ${isToday || hasSlots ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {format(dateCol, 'd MMM', { locale: fr })}
                                </p>
                            </div>

                            {/* Liste des créneaux */}
                            <div className="flex-1 p-2.5 space-y-1.5 min-h-[220px]">
                                {slots.map((c) => (
                                    <div
                                        key={c.id}
                                        className="group relative flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-indigo-50/70 transition-colors"
                                    >
                                        <span className={`size-2 rounded-full shrink-0 ${c.statut ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-gray-800 leading-none">
                                                {formatTime(c.dateHeureDebut)}
                                            </p>
                                            <p className="text-[11px] text-gray-500 leading-none mt-0.5">
                                                {formatTime(c.dateHeureFin)}
                                            </p>
                                            {!c.statut && (
                                                <p className="text-[10px] text-red-500 leading-none mt-0.5 font-medium">
                                                    Réservé
                                                </p>
                                            )}
                                            {c.statut && (
                                                <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                                                    <Users className="size-2.5 inline -mt-px mr-0.5" />
                                                    max {c.nbMaxReservations || 1}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                            <button
                                                onClick={() => openEditModal(c)}
                                                className="p-1 text-indigo-500 hover:text-indigo-700 transition-colors"
                                            >
                                                <Pencil className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Bouton ajouter */}
                                {!hasSlots ? (
                                    <button
                                        onClick={() => openCreateModal(jour.key)}
                                        className="w-full h-full min-h-[80px] flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-indigo-500 transition-colors"
                                    >
                                        <Plus className="size-5" />
                                        <span className="text-xs font-medium">Ajouter</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openCreateModal(jour.key)}
                                        className="w-full flex items-center justify-center gap-1 py-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium mt-1"
                                    >
                                        <Plus className="size-3.5" />
                                        Ajouter
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal création / modification */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">

                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingCreneau ? 'Modifier le créneau' : 'Nouveau créneau'}
                                </h2>
                                <p className="text-indigo-200 text-sm mt-0.5">
                                    Semaine du {format(weekStart, 'd MMMM yyyy', { locale: fr })}
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-full">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Sélecteur de jour */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Jour de la semaine</label>
                                <div className="flex flex-wrap gap-2">
                                    {JOURS.map((j) => {
                                        const d = getDateForDayKey(j.key);
                                        return (
                                            <button
                                                key={j.key}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, jour: j.key })}
                                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                    formData.jour === j.key
                                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                <span className="block">{j.short}</span>
                                                <span className="block text-[10px] opacity-75">
                                                    {format(d, 'd/MM', { locale: fr })}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Heure début</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.heureDebut}
                                        onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Heure fin</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.heureFin}
                                        onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Capacité max */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Nombre maximum de réservations
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, nbMax: Math.max(1, formData.nbMax - 1) })}
                                        className="size-10 rounded-lg border border-gray-300 text-gray-600 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.nbMax}
                                        onChange={(e) => setFormData({ ...formData, nbMax: Math.max(1, parseInt(e.target.value) || 1) })}
                                        className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, nbMax: formData.nbMax + 1 })}
                                        className="size-10 rounded-lg border border-gray-300 text-gray-600 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500 ml-1">
                                        personne{formData.nbMax > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                                >
                                    {editingCreneau ? 'Enregistrer' : 'Créer le créneau'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreneauxContent;
