import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerSesion } from './services/authService';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MisCitas from './pages/MisCitas';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSesion = () => {
      const sesion = obtenerSesion();
      setSession(sesion);
      setUserRole(sesion?.usuario?.rol || null);
      setLoading(false);
    };

    cargarSesion();
    window.addEventListener('essenzia_auth_change', cargarSesion);
    return () => window.removeEventListener('essenzia_auth_change', cargarSesion);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-fondo-claro flex items-center justify-center">
        <span className="text-[#8A2D3B] font-black text-2xl uppercase tracking-widest animate-pulse">
          CARGANDO...
        </span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!session ? <Register /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/mis-citas" element={session ? <MisCitas /> : <Navigate to="/login" />} />
        <Route path="/admin" element={session && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
