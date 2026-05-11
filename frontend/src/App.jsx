import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';

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

// 1. EL RADAR DE SESIÓN: Solo mira si hay alguien conectado o no. Rápido y sin bloqueos.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      
      // Si cerramos sesión o entramos sin cuenta, quitamos la pantalla de carga del tirón
      if (!currentSession) {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. EL BUSCADOR DE ROL: Solo arranca cuando el Radar avisa de que hay una sesión válida.
  useEffect(() => {
    const buscarRol = async () => {
      // Solo buscamos si hay una sesión con un ID de usuario válido
      if (session?.user?.id) {
        try {
          const { data } = await supabase
            .from('usuario')
            .select('rol')
            .eq('id_usuario', session.user.id)
            .maybeSingle();

          if (data) {
            setUserRole(data.rol);
          }
        } catch (error) {
          console.error("Fallo al buscar rol:", error);
        } finally {
          setLoading(false); 
        }
      }
    };

    buscarRol();
  }, [session]); // Esto le dice a React: "Ejecuta esto solo cuando la variable 'session' cambie"

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7FF] flex items-center justify-center">
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