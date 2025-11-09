import { useState, useEffect, useCallback } from 'react';

const getUsers = () => JSON.parse(localStorage.getItem("usuarios") || "[]");
const saveUsers = (users) => localStorage.setItem("usuarios", JSON.stringify(users));

/**
 * Custom Hook para gestionar el estado de autenticación y los modales.
 * 💡 Reemplaza toda la lógica global de autenticación de app.js.
 * @param {function} showInfoModal - Función para mostrar diálogos (reemplazo de dialogo/alert).
 */
export const useAuth = (showInfoModal) => {
    const [sessionUser, setSessionUser] = useState(localStorage.getItem("sesion"));
    
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    
  
    useEffect(() => {
        
        if (!localStorage.getItem("usuarios")) {
            saveUsers([{ usuario: "prueba", clave: "123" }]);
        }
    }, []);

    
    const openLogin = useCallback(() => setIsLoginModalOpen(true), []); 
    const closeLogin = useCallback(() => setIsLoginModalOpen(false), []); 
    const openRegister = useCallback(() => setIsRegisterModalOpen(true), []); 
    const closeRegister = useCallback(() => setIsRegisterModalOpen(false), []); 

  
    const confirmLogin = (usuario, clave, onClearFields) => {
        const u = (usuario || "").trim();
        const c = (clave || "").trim();
        const ok = getUsers().find((x) => x.usuario === u && x.clave === c);

        if (ok) {
            localStorage.setItem("sesion", u);
            setSessionUser(u); 
            closeLogin();
        } else {
            showInfoModal("Usuario o contraseña incorrectos.");
        }
        onClearFields();
    };
    
    
    const confirmRegister = (usuario, clave, onClearFields) => {
        const u = (usuario || "").trim();
        const c = (clave || "").trim();

        if (!u || !c) {
            return showInfoModal("Completá usuario y contraseña.");
        }

        const users = getUsers();
        if (users.find((x) => x.usuario === u)) {
            showInfoModal("Ese usuario ya existe.");
            return onClearFields();
        }

        users.push({ usuario: u, clave: c });
        saveUsers(users);
        localStorage.setItem("sesion", u);
        setSessionUser(u); 
        closeRegister();
        showInfoModal("Usuario registrado correctamente.");
        onClearFields();
    };

 
    const logout = () => {
        localStorage.removeItem("sesion");
        setSessionUser(null);
    };

    return {
        sessionUser, 
        isLoggedIn: !!sessionUser,
        isLoginModalOpen,
        isRegisterModalOpen,
        openLogin,
        closeLogin,
        openRegister,
        closeRegister,
        confirmLogin,
        confirmRegister,
        logout,
    };
};