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

  useEffect(() => {
    // Si pasa 3 segundo y Supabase no responde, forzamos el desbloqueo
    const seguro = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const iniciarAplicacion = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const { data } = await supabase
            .from('usuario')
            .select('rol')
            .eq('id_usuario', session.user.id)
            .maybeSingle();
          
          if (data) setUserRole(data.rol);
        }
      } catch (error) {
        console.error("Fallo al contactar con Supabase:", error);
      } finally {
        clearTimeout(seguro); // Todo fue bien, cancelamos el temporizador
        setLoading(false); // Quitamos la pantalla de carga
      }
    };

    iniciarAplicacion();

    // Radar en segundo plano para cambios de cuenta
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      
      if (currentSession) {
      // Solo buscamos el rol si no lo tenemos ya, para evitar saltos
      const { data } = await supabase
        .from('usuario')
        .select('rol')
        .eq('id_usuario', currentSession.user.id)
        .maybeSingle();
      if (data) setUserRole(data.rol);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      clearTimeout(seguro);
      subscription.unsubscribe();
    };
  }, []);

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