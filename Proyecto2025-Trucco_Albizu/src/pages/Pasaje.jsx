import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fmtUSD } from '../utils/Vueloutils';
import logoImg from '../assets/Logo AM.png';
import pasajeImg from '../assets/pasaje.png'; 
const formatPassengerText = (busqueda) => {
    if (!busqueda || busqueda.pasajeros === 0) return '0 pasajeros';

    const parte = (cant, sing, plur) => 
        !cant || cant <= 0 ? "" : `${cant} ${cant === 1 ? sing : plur}`;
    
    const partes = [
        parte(busqueda.adultos, "adulto", "adultos"),
        parte(busqueda.ninos, "niño", "niños"),
        parte(busqueda.bebes, "bebé", "bebés"),
    ].filter(Boolean); 
    return busqueda.pasajeros 
        ? `${busqueda.pasajeros}${partes.length ? " (" + partes.join(", ") + ")" : ""}` 
        : "";
};


function TicketPage() {
    const navigate = useNavigate();
    
    const [sesion, setSesion] = useState(null);
    const [vuelo, setVuelo] = useState(null);
    const [datosBusqueda, setDatosBusqueda] = useState({});
    
    useEffect(() => {
        const userSesion = localStorage.getItem("sesion");
        const vueloSel = JSON.parse(localStorage.getItem("vueloSeleccionado") || "null");
        const busquedaDatos = JSON.parse(localStorage.getItem("busquedaVuelo") || "{}");

        if (!userSesion) {
            alert("Debes iniciar sesión para ver tu pasaje.");
            return navigate('/');
        }
        if (!vueloSel) {
            alert("No se ha seleccionado un vuelo.");
            return navigate('/vuelos');
        }

        setSesion(userSesion);
        setVuelo(vueloSel);
        setDatosBusqueda(busquedaDatos);
        
    }, [navigate]); 
   if (!vuelo) {
        return (
             <div className="body3">
                <header className="topbar3">
                    <div className="brand">
                        <Link to="/" className="logo3">
                            <img src={logoImg} alt="AM Viajes" />
                        </Link>
                    </div>
                    <h1>Cargando pasaje...</h1>
                </header>
            </div>
        );
    }

    const textoPasajeros = formatPassengerText(datosBusqueda);

    return (
         <div className="body3">
            <header className="topbar3">
                <div className="brand">
                    <Link to="/" className="logo3" aria-label="Inicio">
                        <img src={logoImg} alt="AM Viajes" />
                    </Link>
                </div>
                <h1>Muchas gracias!</h1>
            </header>

            <main className="container">
                <div id="pasaje" className="tarjeta-pasaje">
                    <div className="overlay-fondo"></div>

                    <div className="pasaje-contenido">
                        <div className="pasaje-header">
                            <h2>Pasaje aéreo</h2>
                        </div>

                        <div className="pasaje-info">
                            <p><strong>Nombre:</strong> <span id="nombreUsuario">{sesion}</span></p>
                            <p><strong>Aerolínea:</strong> <span id="aerolinea">{vuelo.aerolinea}</span></p>
                            <p><strong>Pasajeros: </strong><span id="pasajeros">{textoPasajeros}</span></p>
                            <hr />

                            <p><strong>Origen:</strong> <span id="origenTxt">{vuelo.origen}</span></p>
                            <p><strong>Destino:</strong> <span id="destinoTxt">{vuelo.destino}</span></p>
                            <p><strong>Fecha ida:</strong> <span id="fechaIdaTxt">{vuelo.fechaIda}</span></p>
                            <p><strong>Hora ida:</strong> <span id="horaIdaTxt">{vuelo.horaSalida}</span></p>

                            {vuelo.esIdaYVuelta && (
                                <div id="bloqueVuelta"><hr />
                                    <p><strong>Origen:</strong> <span id="origenVueltaTxt">{vuelo.destino}</span></p>
                                    <p><strong>Destino:</strong> <span id="destinoVueltaTxt">{vuelo.origen}</span></p>
                                    <p><strong>Fecha vuelta:</strong> <span id="fechaVueltaTxt">{vuelo.fechaVuelta}</span></p>
                                    <p><strong>Hora vuelta:</strong> <span id="horaVueltaTxt">{vuelo.horaVuelta}</span></p>
                                </div>
                            )}
                            
                            <hr />
                            <p>
                                <strong>Total pagado:</strong>
                                <span id="precioTotalTxt">{fmtUSD.format(vuelo.precioTotal)}</span>
                            </p>
                        </div>

                        <div className="pasaje-footer">
                            <img
                                src={logoImg}
                                alt="Logo empresa"
                                className="logo-inferior"
                            />
                            <img
                                src={pasajeImg}
                                alt="Código de barras"
                                className="codigo-barra"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TicketPage;