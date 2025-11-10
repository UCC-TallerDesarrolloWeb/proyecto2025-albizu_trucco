import React, { useState } from 'react';
import { useAuth } from './authlogicas'; 
import AuthModal from './Authmodal'; 
import Button from '@components/componente generico/Button';
import profileImg from '@assets/Perfil.png'; 
import logoImg from '@assets/Logo AM.png'; 
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
    } = useAuth(); 

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
                        <Button id="btnAbrirLogin" variant="ghost" onClick={openLogin}>
                            Iniciar sesión
                        </Button>
                        <Button id="btnAbrirRegistro" onClick={openRegister}>
                            Registrarse
                        </Button>
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
                                <Button
                                    id="btnCerrarSesion"
                                    variant="ghost"
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión ({sessionUser})
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default HeaderComponent;