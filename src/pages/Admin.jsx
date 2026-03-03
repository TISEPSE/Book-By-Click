import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Admin() {
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [blockingId, setBlockingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await fetch("/api/session", {
          credentials: "include",
        })

        if (!sessionResponse.ok) {
          navigate("/login")
          return
        }

        const sessionData = await sessionResponse.json()
        if (!sessionData.isAdmin) {
          navigate("/login")
          return
        }

        const response = await fetch("/api/admin/entreprises", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Impossible de récupérer les entreprises")
        }

        const data = await response.json()
        setEntreprises(data)
      } catch (err) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleBlock = async idPro => {
    setBlockingId(idPro)
    try {
      const response = await fetch(`/api/admin/entreprises/${idPro}/bloquer`, {
        method: "PATCH",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Impossible de bloquer l'utilisateur")
      }

      setEntreprises(prev =>
        prev.map(entreprise =>
          entreprise.idPro === idPro
            ? { ...entreprise, estBloque: true }
            : entreprise
        )
      )
    } catch (err) {
      setError(err.message || "Erreur inconnue")
    } finally {
      setBlockingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
      })
    } finally {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Administration - Entreprises</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
          >
            Se déconnecter
          </button>
        </div>

        {loading && <p className="text-gray-500">Chargement des entreprises...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Entreprise</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Secteur</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Ville</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Pays</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Slug</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Statut</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entreprises.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      Aucune entreprise trouvée.
                    </td>
                  </tr>
                ) : (
                  entreprises.map(entreprise => (
                    <tr key={entreprise.idPro} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{entreprise.idPro}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{entreprise.nomEntreprise}</td>
                      <td className="px-4 py-3 text-gray-700">{entreprise.nomSecteur}</td>
                      <td className="px-4 py-3 text-gray-700">{entreprise.ville}</td>
                      <td className="px-4 py-3 text-gray-700">{entreprise.pays}</td>
                      <td className="px-4 py-3 text-gray-700">{entreprise.slugPublic}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {entreprise.estBloque ? "Bloqué" : "Actif"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleBlock(entreprise.idPro)}
                          disabled={entreprise.estBloque || blockingId === entreprise.idPro}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            entreprise.estBloque
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {blockingId === entreprise.idPro ? "Blocage..." : "Bloquer"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
