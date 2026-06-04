const SESSION_KEY = 'essenzia_session';

export const guardarSesion = (token, usuario) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, usuario }));
    window.dispatchEvent(new Event('essenzia_auth_change'));
};

export const obtenerSesion = () => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
};

export const obtenerUsuario = () => {
    return obtenerSesion()?.usuario || null;
};

export const cerrarSesion = () => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('essenzia_auth_change'));
};
