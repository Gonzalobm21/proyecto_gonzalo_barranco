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
    const iniciarAplicacion = async () => {
      try {
        console.log("Paso 1: Voy a pedir la sesión a Supabase...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Paso 2: Sesión recibida. Error:", error);
        //  Si Supabase nos dice que el token es inválido o hay error
        if (error) {
          console.warn("Se detectó un token corrupto. Limpiando sesión...");
          await supabase.auth.signOut(); // Obligamos al navegador a borrar la basura
          setSession(null);
          setUserRole(null);
          return; // Cortamos la ejecución aquí, no intentamos buscar el rol
        }

        setSession(session);

        // Si la sesión es válida y está limpia, buscamos su rol
        if (session) {
          console.log("Paso 3: Hay sesión. Voy a pedir el rol a la base de datos...");
          const { data } = await supabase
            .from('usuario')
            .select('rol')
            .eq('id_usuario', session.user.id)
            .maybeSingle();
          console.log("Paso 4: Rol recibido:", data);
          if (data) setUserRole(data.rol);
        }
      } catch (err) {
        console.error("¡BUM! Ha saltado un error crítico:", err);
        // Seguro de vida por si el servidor se cae por completo
        setSession(null); 
        setUserRole(null);
      } finally {
        console.log("Paso 5: He llegado al finally. Voy a quitar el Loading.");
        setLoading(false); // quitamos la pantalla de carga
      }
    };

    iniciarAplicacion();

    // Radar en segundo plano para cambios de cuenta
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
  setSession(currentSession);
  
  // Si el evento es explícitamente cerrar sesión, limpiamos todo
  if (event === 'SIGNED_OUT') {
    setUserRole(null);
  } 
  // Si hay sesión activa (login o refresco), pedimos el rol a la base de datos
  else if (currentSession) {
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