import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Resgister_user from "./pages/Register_User.jsx"
import Resgister_pro from "./pages/Register_Pro.jsx"
import Choice_Register from "./pages/Choice_Register.jsx"
import Forgot_password from "./pages/Forgot_password.jsx"
import Dashboard_Entreprise from "./pages/dashboard_entreprise/Dashboard_Entreprise.jsx"
import "./static/App.css"
//===============PAGE DE TEST=================
import Test from "./pages/Teste_form.jsx"
import Recap from "./pages/Recap.jsx"

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
        <Route
          path="/dashboard_entreprise"
          element={<Dashboard_Entreprise />}
        />

        <Route path="/teste" element={<Test />} />
        <Route path="/recap" element={<Recap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
