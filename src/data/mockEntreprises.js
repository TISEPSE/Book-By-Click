import { addDays, startOfWeek, setHours, setMinutes } from "date-fns"

export const entreprises = [
  {
    id: 1,
    slug: "restaurant-le-gourmet",
    name: "Restaurant Le Gourmet",
    category: "Restaurant",
    description:
      "Restaurant gastronomique situé au coeur de Paris. Nous proposons une cuisine française raffinée avec des produits frais et de saison. Notre chef étoilé vous invite à découvrir des saveurs uniques dans un cadre élégant et chaleureux.",
    address: "15 Rue de Rivoli, 75001 Paris",
    phone: "01 42 33 44 55",
    rating: 4.8,
    reviewCount: 234,
    priceRange: "€€",
    verified: true,
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    horaires: {
      Lundi: "11h30 - 14h30 / 18h30 - 22h30",
      Mardi: "11h30 - 14h30 / 18h30 - 22h30",
      Mercredi: "11h30 - 14h30 / 18h30 - 22h30",
      Jeudi: "11h30 - 14h30 / 18h30 - 22h30",
      Vendredi: "11h30 - 14h30 / 18h30 - 23h00",
      Samedi: "12h00 - 15h00 / 19h00 - 23h00",
      Dimanche: "Fermé",
    },
    prestations: [
      {
        id: 101,
        name: "Menu Découverte",
        description: "Entrée + plat + dessert avec produits de saison",
        duration: 90,
        price: 45,
      },
      {
        id: 102,
        name: "Menu Dégustation",
        description: "5 plats avec accords mets-vins",
        duration: 120,
        price: 85,
      },
      {
        id: 103,
        name: "Brunch du week-end",
        description: "Formule brunch complète à volonté",
        duration: 90,
        price: 35,
      },
    ],
    avis: [
      {
        id: 1,
        auteur: "Marie D.",
        note: 5,
        commentaire:
          "Excellent service et cuisine raffinée. Le menu dégustation est un pur bonheur.",
        date: "2025-01-15",
      },
      {
        id: 2,
        auteur: "Thomas L.",
        note: 4,
        commentaire:
          "Très bon restaurant, cadre agréable. Un peu d'attente en salle.",
        date: "2025-01-10",
      },
      {
        id: 3,
        auteur: "Sophie R.",
        note: 5,
        commentaire: "Magnifique expérience culinaire, je recommande vivement.",
        date: "2024-12-28",
      },
    ],
  },
  {
    id: 2,
    slug: "garage-auto-expert",
    name: "Garage Auto Expert",
    category: "Garage automobile",
    description:
      "Garage automobile multimarque spécialisé dans l'entretien, la réparation et le diagnostic de tous types de véhicules. Nos techniciens certifiés utilisent un équipement de pointe pour garantir un service de qualité.",
    address: "28 Avenue des Champs-Élysées, 75008 Paris",
    phone: "01 55 67 88 99",
    rating: 4.9,
    reviewCount: 189,
    priceRange: "€€€",
    verified: true,
    discount: null,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    horaires: {
      Lundi: "8h00 - 18h00",
      Mardi: "8h00 - 18h00",
      Mercredi: "8h00 - 18h00",
      Jeudi: "8h00 - 18h00",
      Vendredi: "8h00 - 18h00",
      Samedi: "9h00 - 13h00",
      Dimanche: "Fermé",
    },
    prestations: [
      {
        id: 201,
        name: "Révision complète",
        description: "Vidange, filtres, niveaux, contrôle des freins",
        duration: 120,
        price: 189,
      },
      {
        id: 202,
        name: "Diagnostic électronique",
        description: "Lecture des codes défaut et diagnostic complet",
        duration: 45,
        price: 59,
      },
      {
        id: 203,
        name: "Changement de pneus",
        description: "Montage, équilibrage et géométrie (4 pneus)",
        duration: 60,
        price: 80,
      },
    ],
    avis: [
      {
        id: 4,
        auteur: "Pierre M.",
        note: 5,
        commentaire:
          "Travail impeccable, prix honnête et délai respecté. Je recommande.",
        date: "2025-01-20",
      },
      {
        id: 5,
        auteur: "Julien B.",
        note: 5,
        commentaire:
          "Très professionnel, diagnostic rapide et réparation efficace.",
        date: "2025-01-05",
      },
    ],
  },
  {
    id: 3,
    slug: "cabinet-dr-martin",
    name: "Cabinet Dr. Martin",
    category: "Médecin généraliste",
    description:
      "Cabinet de médecine générale accueillant les patients de tout âge. Consultations sur rendez-vous, suivi médical personnalisé, vaccinations et bilans de santé dans un environnement moderne et rassurant.",
    address: "42 Rue du Temple, 75003 Paris",
    phone: "01 44 78 12 34",
    rating: 4.7,
    reviewCount: 156,
    priceRange: "€€",
    verified: true,
    discount: null,
    image:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400",
    horaires: {
      Lundi: "8h30 - 12h30 / 14h00 - 18h30",
      Mardi: "8h30 - 12h30 / 14h00 - 18h30",
      Mercredi: "8h30 - 12h30",
      Jeudi: "8h30 - 12h30 / 14h00 - 18h30",
      Vendredi: "8h30 - 12h30 / 14h00 - 17h00",
      Samedi: "Fermé",
      Dimanche: "Fermé",
    },
    prestations: [
      {
        id: 301,
        name: "Consultation générale",
        description: "Consultation de médecine générale classique",
        duration: 20,
        price: 25,
      },
      {
        id: 302,
        name: "Bilan de santé complet",
        description: "Examen clinique approfondi avec bilan sanguin",
        duration: 45,
        price: 60,
      },
      {
        id: 303,
        name: "Vaccination",
        description: "Administration de vaccin avec suivi",
        duration: 15,
        price: 25,
      },
    ],
    avis: [
      {
        id: 6,
        auteur: "Claire V.",
        note: 5,
        commentaire: "Médecin très à l'écoute, prend le temps d'expliquer.",
        date: "2025-01-18",
      },
      {
        id: 7,
        auteur: "Marc F.",
        note: 4,
        commentaire:
          "Bon médecin, cabinet propre. Parfois un peu d'attente.",
        date: "2025-01-02",
      },
    ],
  },
  {
    id: 4,
    slug: "fitness-club-paris",
    name: "Fitness Club Paris",
    category: "Salle de sport",
    description:
      "Salle de sport moderne équipée des dernières machines de cardio et musculation. Nous proposons des cours collectifs variés, un espace bien-être avec sauna, et un accompagnement personnalisé par nos coachs certifiés.",
    address: "8 Boulevard Haussmann, 75009 Paris",
    phone: "01 48 22 56 78",
    rating: 4.6,
    reviewCount: 312,
    priceRange: "€€",
    verified: true,
    discount: "-15%",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    horaires: {
      Lundi: "6h30 - 22h00",
      Mardi: "6h30 - 22h00",
      Mercredi: "6h30 - 22h00",
      Jeudi: "6h30 - 22h00",
      Vendredi: "6h30 - 22h00",
      Samedi: "8h00 - 20h00",
      Dimanche: "9h00 - 18h00",
    },
    prestations: [
      {
        id: 401,
        name: "Séance coaching individuel",
        description: "1h de coaching personnalisé avec un coach certifié",
        duration: 60,
        price: 55,
      },
      {
        id: 402,
        name: "Bilan forme",
        description:
          "Évaluation physique complète et programme personnalisé",
        duration: 45,
        price: 40,
      },
      {
        id: 403,
        name: "Cours collectif",
        description: "Yoga, Pilates, CrossFit, Boxing selon planning",
        duration: 60,
        price: 15,
      },
    ],
    avis: [
      {
        id: 8,
        auteur: "Léa G.",
        note: 5,
        commentaire:
          "Super salle, équipement top et coachs très motivants !",
        date: "2025-01-22",
      },
      {
        id: 9,
        auteur: "Antoine P.",
        note: 4,
        commentaire: "Bonne salle, un peu bondée aux heures de pointe.",
        date: "2025-01-12",
      },
    ],
  },
  {
    id: 5,
    slug: "salon-le-parisien",
    name: "Salon Le Parisien",
    category: "Coiffeur",
    description:
      "Salon de coiffure haut de gamme au coeur de Paris. Notre équipe de coiffeurs expérimentés vous accueille pour des coupes tendance, colorations, soins capillaires et coiffures événementielles dans un cadre élégant.",
    address: "12 Rue de la Paix, 75002 Paris",
    phone: "01 42 61 78 90",
    rating: 4.9,
    reviewCount: 421,
    priceRange: "€€",
    verified: true,
    discount: null,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    horaires: {
      Lundi: "Fermé",
      Mardi: "9h30 - 19h00",
      Mercredi: "9h30 - 19h00",
      Jeudi: "9h30 - 19h00",
      Vendredi: "9h30 - 19h00",
      Samedi: "9h00 - 18h00",
      Dimanche: "Fermé",
    },
    prestations: [
      {
        id: 501,
        name: "Coupe femme",
        description: "Shampoing, coupe et brushing",
        duration: 45,
        price: 45,
      },
      {
        id: 502,
        name: "Coupe homme",
        description: "Shampoing et coupe",
        duration: 30,
        price: 28,
      },
      {
        id: 503,
        name: "Coloration complète",
        description: "Coloration + soin + brushing",
        duration: 90,
        price: 85,
      },
      {
        id: 504,
        name: "Balayage / Mèches",
        description: "Balayage naturel ou mèches avec brushing",
        duration: 120,
        price: 110,
      },
    ],
    avis: [
      {
        id: 10,
        auteur: "Camille S.",
        note: 5,
        commentaire:
          "Le meilleur salon de Paris ! Résultat toujours au top.",
        date: "2025-01-25",
      },
      {
        id: 11,
        auteur: "Nathalie K.",
        note: 5,
        commentaire:
          "Équipe adorable, cadre magnifique et résultat impeccable.",
        date: "2025-01-14",
      },
      {
        id: 12,
        auteur: "Emma T.",
        note: 4,
        commentaire: "Très satisfaite de ma coloration, prix raisonnable.",
        date: "2024-12-20",
      },
    ],
  },
]

export const getEntrepriseBySlug = (slug) =>
  entreprises.find((e) => e.slug === slug)

export const generateMockSlots = (prestationDuration) => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const slots = []

  for (let day = 0; day < 14; day++) {
    const currentDay = addDays(weekStart, day)
    const dayOfWeek = currentDay.getDay()

    // Pas de créneaux le dimanche
    if (dayOfWeek === 0) continue

    // Samedi : moins de créneaux
    const startHour = dayOfWeek === 6 ? 9 : 9
    const endHour = dayOfWeek === 6 ? 14 : 18

    let hour = startHour
    let minute = 0

    while (hour < endHour) {
      // Simuler des créneaux indisponibles (environ 40% d'occupation)
      const isAvailable = Math.random() > 0.4

      if (isAvailable) {
        const slotStart = setMinutes(setHours(currentDay, hour), minute)
        slots.push({
          date: currentDay,
          time: `${String(hour).padStart(2, "0")}h${String(minute).padStart(2, "0")}`,
          start: slotStart,
        })
      }

      // Incrémenter selon la durée de la prestation (minimum 30 min entre créneaux)
      const increment = Math.max(prestationDuration, 30)
      minute += increment
      while (minute >= 60) {
        minute -= 60
        hour++
      }
    }
  }

  return slots
}
