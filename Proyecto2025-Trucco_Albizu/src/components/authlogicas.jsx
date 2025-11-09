import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const getUsers = () => JSON.parse(localStorage.getItem("usuarios") || "[]");
const saveUsers = (users) => localStorage.setItem("usuarios", JSON.stringify(users));


export const soloLetras = (texto) => {
    if (!texto || texto.length === 0) {
        return true; 
    }
    
    const letrasPermitidas = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú',
        'ñ', 'Ñ'
    ];
    
    for (let i = 0; i < texto.length; i++) {
        const caracter = texto[i];
        if (!letrasPermitidas.includes(caracter)) {
            return false;
        }
    }
    
    return true;
};

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [sessionUser, setSessionUser] = useState(() => {
        return localStorage.getItem("sesion");
    });
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    
    useEffect(() => {
        if (!localStorage.getItem("usuarios")) {
            saveUsers([{ usuario: "prueba", clave: "123" }]);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "sesion") {
                setSessionUser(e.newValue);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const openLogin = useCallback(() => setIsLoginModalOpen(true), []); 
    const closeLogin = useCallback(() => setIsLoginModalOpen(false), []); 
    const openRegister = useCallback(() => setIsRegisterModalOpen(true), []); 
    const closeRegister = useCallback(() => setIsRegisterModalOpen(false), []);

    const confirmLogin = useCallback((usuario, clave, onClearFields, showInfoModal) => {
        const u = (usuario || "").trim();
        const c = (clave || "").trim();
        const ok = getUsers().find((x) => x.usuario === u && x.clave === c);

        if (ok) {
            localStorage.setItem("sesion", u);
            setSessionUser(u);
            closeLogin();
            
        } else {
            if (showInfoModal) {
                showInfoModal("Usuario o contraseña incorrectos.");
            }
        }
        if (onClearFields) {
            onClearFields();
        }
    }, [closeLogin]);
    
    const confirmRegister = useCallback((usuario, clave, onClearFields, showInfoModal) => {
        const u = (usuario || "").trim();
        const c = (clave || "").trim();

        if (!u || !c) {
            if (showInfoModal) {
                showInfoModal("Completá usuario y contraseña.");
            }
            return;
        }

       if (!u || u.length === 0 || !soloLetras(u)) {
            if (showInfoModal) {
                showInfoModal("El nombre de usuario solo puede contener letras. No se permiten números ni símbolos.");
            }
            if (onClearFields) {
                onClearFields();
            }
            return;
        }

        const users = getUsers();
        if (users.find((x) => x.usuario === u)) {
            if (showInfoModal) {
                showInfoModal("Ese usuario ya existe.");
            }
            if (onClearFields) {
                onClearFields();
            }
            return;
        }

        users.push({ usuario: u, clave: c });
        saveUsers(users);
        localStorage.setItem("sesion", u);
        setSessionUser(u);
        closeRegister();
        if (showInfoModal) {
            showInfoModal("Usuario registrado correctamente. Sesión iniciada.");
        }
        if (onClearFields) {
            onClearFields();
        }
    }, [closeRegister]);

    const logout = useCallback(() => {
        localStorage.removeItem("sesion");
        setSessionUser(null);
    }, []);

    const value = {
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom Hook para acceder al contexto de autenticación
 * @param {function} showInfoModal - Función para mostrar diálogos (reemplazo de dialogo/alert).
 */
export const useAuth = (showInfoModal) => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    const confirmLoginWithModal = useCallback((usuario, clave, onClearFields) => {
        return context.confirmLogin(usuario, clave, onClearFields, showInfoModal);
    }, [context, showInfoModal]);

    const confirmRegisterWithModal = useCallback((usuario, clave, onClearFields) => {
        return context.confirmRegister(usuario, clave, onClearFields, showInfoModal);
    }, [context, showInfoModal]);

    return {
        ...context,
        confirmLogin: confirmLoginWithModal,
        confirmRegister: confirmRegisterWithModal,
    };
};