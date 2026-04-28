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
    // Chivato de seguridad para comprobar que Render tiene bien tus variables
    console.log("1. Arrancando App. URL Supabase:", import.meta.env.VITE_SUPABASE_URL ? "DETECTADA" : "¡FALTA!");

    // El Radar ahora es el único jefe. Hace la carga inicial y vigila los cambios.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("2. Radar disparado. Evento:", event);
      
      setSession(currentSession);

      // Si cerramos sesión explícitamente
      if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setLoading(false);
      } 
      // Si hay sesión (ya sea inicial o un nuevo login)
      else if (currentSession) {
        try {
          console.log("3. Buscando rol en la base de datos...");
          const { data } = await supabase
            .from('usuario')
            .select('rol')
            .eq('id_usuario', currentSession.user.id)
            .maybeSingle();
            
          if (data) {
            console.log("4. Rol encontrado:", data.rol);
            setUserRole(data.rol);
          }
        } catch (error) {
          console.error("Fallo al buscar rol:", error);
        } finally {
          setLoading(false); // Levantamos el telón
        }
      } 
      // Si entra a la web y no tiene cuenta iniciada
      else {
        console.log("3. No hay sesión activa. Modo invitado.");
        setUserRole(null);
        setLoading(false); // Levantamos el telón
      }
    });

    // Limpieza al desmontar
    return () => {
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