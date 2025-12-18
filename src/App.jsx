import { BrowserRouter, Routes, Route } from "react-router-dom"
import {
  Home,
  Login,
  Contact,
  Forgot_password,
  Resgister_user,
  Resgister_pro,
  Choice_Register,
  Test,
  Recap
} from "./pages"
import Dashboard_Entreprise from "./pages/dashboard/Dashboard_Entreprise.jsx"
import "./static/App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login_form" element={<Login />} />
        <Route path="/register_choice" element={<Choice_Register />} />
        <Route path="/register_form_user" element={<Resgister_user />} />
        <Route path="/register_form_pro" element={<Resgister_pro />} />
        <Route path="/fogot_password" element={<Forgot_password />} />
        <Route path="/dashboard_entreprise"element={<Dashboard_Entreprise />}/>
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/dashboard"
          element={<Dashboard_Entreprise />}
        />

        <Route path="/teste" element={<Test />} />
        <Route path="/recap" element={<Recap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
