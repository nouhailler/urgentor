import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import FichePage from './pages/FichePage'
import NewFiche from './pages/NewFiche'
import Settings from './pages/Settings'
import GestionFiches from './pages/GestionFiches'
import EditFiche from './pages/EditFiche'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fiche/:id" element={<FichePage />} />
          <Route path="/nouvelle-fiche" element={<NewFiche />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/gestion" element={<GestionFiches />} />
          <Route path="/modifier-fiche/:id" element={<EditFiche />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
