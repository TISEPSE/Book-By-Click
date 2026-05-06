/**
 * Fichier de configuration du routeur React (React Router v7).
 *
 * Chaque Route associe un chemin URL à un composant de page.
 * Les routes publiques (accueil, recherche, page entreprise) sont accessibles
 * sans authentification. Les routes de tableau de bord vérifient la session
 * côté composant au montage.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home                from "./pages/Home.jsx"
import Login               from "./pages/Login.jsx"
import RegisterUser        from "./pages/Register_User.jsx"
import RegisterPro         from "./pages/Register_Pro.jsx"
import ChoiceRegister      from "./pages/Choice_Register.jsx"
import ForgotPassword      from "./pages/ForgotPassword.jsx"
import ResetPassword       from "./pages/ResetPassword.jsx"
import DashboardEntreprise from "./pages/dashboard/DashboardEntreprise.jsx"
import DashboardClient     from "./pages/dashboard/DashboardClient.jsx"
import Contact             from "./pages/Contact.jsx"
import ResultatRecherche   from "./pages/PageResultatRecherche.jsx"
import Recap               from "./pages/Recap.jsx"
import Profile             from "./pages/Profile.jsx"
import EntrepriseDetail    from "./pages/EntrepriseDetail.jsx"
import BookingCalendar     from "./pages/BookingCalendar.jsx"
import BookingConfirmation from "./pages/BookingConfirmation.jsx"
import Admin               from "./pages/Admin.jsx"
import Aide               from "./pages/Aide.jsx"
import APropos            from "./pages/APropos.jsx"
import Confidentialite    from "./pages/Confidentialite.jsx"
import Conditions         from "./pages/Conditions.jsx"

import ScrollToTop from "./components/ScrollToTop.jsx"
import "./styles/App.css"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Pages publiques ── */}
        <Route path="/"                         element={<Home />} />
        <Route path="/contact"                  element={<Contact />} />
        <Route path="/result"                   element={<ResultatRecherche />} />
        <Route path="/entreprise/:slug"         element={<EntrepriseDetail />} />

        {/* ── Authentification ── */}
        <Route path="/login"                    element={<Login />} />
        <Route path="/register_choice"          element={<ChoiceRegister />} />
        <Route path="/register_form_user"       element={<RegisterUser />} />
        <Route path="/register_form_pro"        element={<RegisterPro />} />
        <Route path="/fogot_password"           element={<ForgotPassword />} />
        <Route path="/reset_password"           element={<ResetPassword />} />

        {/* ── Réservation (flux client) ── */}
        <Route path="/reservation/:slug"        element={<BookingCalendar />} />
        <Route path="/reservation/confirmation" element={<BookingConfirmation />} />

        {/* ── Espaces connectés ── */}
        <Route path="/dashboard_entreprise"     element={<DashboardEntreprise />} />
        <Route path="/dashboard_client"         element={<DashboardClient />} />
        <Route path="/profile"                  element={<Profile />} />
        <Route path="/admin"                    element={<Admin />} />

        {/* ── Divers ── */}
        <Route path="/recap"                    element={<Recap />} />

        {/* ── Pages institutionnelles ── */}
        <Route path="/aide"                     element={<Aide />} />
        <Route path="/a-propos"                 element={<APropos />} />
        <Route path="/confidentialite"          element={<Confidentialite />} />
        <Route path="/conditions"               element={<Conditions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
