import React, { useState } from 'react';
import { useAuth } from './authlogicas';
import { soloLetras } from '@utils/validators';
import Button from '@components/componente generico/Button';

/**
 * Componente dinámico para los modales de Iniciar Sesión y Registrar Usuario.
 * Reemplaza el markup de #modal-login y #modal-register de index.html
 * y conecta los botones a las funciones de authlogicas.jsx.
 * * @param {string} type - 'login' o 'register'
 * @param {function} onClose - Función para cerrar el modal (closeLogin/closeRegister)
 * @param {function} showInfoModal - Función para mostrar diálogos de info/error
 */
function AuthModal({ type, onClose, showInfoModal }) {
     const { confirmLogin, confirmRegister } = useAuth();

    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');

    const onClearFields = () => {
        setUsuario('');
        setClave('');
    };

    const handleUsuarioChange = (e) => {
        const valor = e.target.value;
        if (type === 'register') {
            if (soloLetras(valor)) {
                setUsuario(valor);
            }
        } else {
            setUsuario(valor);
        }
    };

    const handleSubmit = () => {
        if (type === 'login') {
            confirmLogin(usuario, clave, onClearFields, showInfoModal);
        } else {
            confirmRegister(usuario, clave, onClearFields, showInfoModal);
        }
    };

    const title = type === 'login' ? 'Iniciar sesión' : 'Registrar usuario';
    
    const userLabel = type === 'login' ? 'Usuario' : 'Nuevo usuario';
    const confirmButtonText = type === 'login' ? 'Entrar' : 'Registrar';
    const idPrefix = type === 'login' ? 'login' : 'reg';
    const confirmButtonId = type === 'login' ? 'btnLoginConfirmar' : 'btnRegisterConfirmar';
    const closeButtonId = type === 'login' ? 'btnLoginCerrar' : 'btnRegisterCerrar';


    return (
       <div id={`modal-${type}`} className="modal" aria-modal="true" role="dialog">
            <div className="modal-content">
                <h3>{title}</h3>

                <label htmlFor={`${idPrefix}-usuario`}>{userLabel}</label>
                <input
                    id={`${idPrefix}-usuario`}
                    placeholder={userLabel}
                    size="20"
                    maxLength="30"
                    value={usuario}
                    onChange={handleUsuarioChange}
                />

                <label htmlFor={`${idPrefix}-clave`}>Contraseña</label>
                <input
                    id={`${idPrefix}-clave`}
                    type="password"
                    placeholder="Contraseña"
                    size="20"
                    maxLength="30"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                />
                
                <Button
                    id={confirmButtonId}
                    variant="primary"
                    onClick={handleSubmit}
                >
                    {confirmButtonText}
                </Button>
                
                <Button 
                    id={closeButtonId} 
                    variant="ghost" 
                    onClick={onClose}
                >
                    Cerrar
                </Button>
            </div>
        </div>
    );
}

export default AuthModal;