import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';

// Importamos nuestras paginas
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MisCitas from './pages/MisCitas';
import Register from './pages/Register';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comprobamos si el usuario tiene la sesion iniciada
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Si estamos comprobando la sesion, mostramos una pantalla en blanco o un loader
  if (loading) {
    return <div className="min-h-screen bg-crema flex items-center justify-center">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta Publica: El Escaparate */}
        <Route path="/" element={<Home />} />

        {/* --- RUTAS DE AUTENTICACIÓN --- */}
        {/* Si NO hay sesión entran, si HAY sesión van al Dashboard */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!session ? <Register /> : <Navigate to="/" />} 
        />

        {/* Ruta Privada: Solo si HAY sesion. Si no hay, vuelve al Login */}
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* Ruta Privada: Historial de citas */}
        <Route 
          path="/mis-citas" 
          element={session ? <MisCitas /> : <Navigate to="/login" />} 
        />

        
      </Routes>
    </Router>
  );
}

export default App;