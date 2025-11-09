import React, { useState } from 'react';
import { useAuth } from '../utils/authlogicas'; 
import AuthModal from '../components/Authmodal'; 

import profileImg from '../assets/Perfil.png'; 
import logoImg from '../assets/Logo AM.png'; 
import { Link } from 'react-router-dom';


function HeaderComponent({ showInfoModal }) {
    const { 
        sessionUser, 
        isLoggedIn, 
        isLoginModalOpen, 
        isRegisterModalOpen,
        openLogin, 
        closeLogin, 
        openRegister, 
        closeRegister, 
        logout 
    } = useAuth(showInfoModal); 

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const togglePerfilDropdown = () => {
        if (isLoggedIn) {
            setIsProfileDropdownOpen(prev => !prev);
        }
    };

    const handleLogout = () => {
        logout(); 
        setIsProfileDropdownOpen(false);
    };

    return (
        <header className="topbar">
            {isLoginModalOpen && (
                <AuthModal type="login" onClose={closeLogin} showInfoModal={showInfoModal} />
            )}
            {isRegisterModalOpen && (
                <AuthModal type="register" onClose={closeRegister} showInfoModal={showInfoModal} />
            )}

            <div className="brand">
                <Link to="/" className="logo" aria-label="Inicio">
                    <img src={logoImg} alt="AM Viajes" />
                </Link>
            </div>
            
            <nav className="auth">
                {!isLoggedIn ? (
                    <>
                        <button id="btnAbrirLogin" className="btn ghost" onClick={openLogin}>
                            Iniciar sesión
                        </button>
                        <button id="btnAbrirRegistro" className="btn" onClick={openRegister}>
                            Registrarse
                        </button>
                    </>
                ) : (
                    <div className="perfil-menu" id="perfilMenu">
                        <div className="perfil-icono">
                            <img
                                src={profileImg}
                                alt="Perfil"
                                id="perfilBtn"
                                onClick={togglePerfilDropdown}
                            />
                            <div 
                                id="perfilDropdown" 
                                className={`perfil-dropdown ${isProfileDropdownOpen ? '' : 'hidden'}`}
                            >
                                <button
                                    id="btnCerrarSesion"
                                    className="btn ghost"
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión ({sessionUser})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default HeaderComponent;