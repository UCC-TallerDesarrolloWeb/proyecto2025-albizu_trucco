import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CIUDADES, horaRandom, precioBasePara, allowedDestinos } from './Vueloutils';
import lupaImg from '@assets/lupa.png';

const initialPassengers = { adultos: 1, ninos: 0, bebes: 0 };

function FlightSearch({ showInfoModal }) {
    const navigate = useNavigate();
    
    const [pasajeros, setPasajeros] = useState(initialPassengers);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [soloIda, setSoloIda] = useState(false);
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [fechaIda, setFechaIda] = useState('');
    const [fechaVuelta, setFechaVuelta] = useState('');
    const [message, setMessage] = useState('');

    const totalPasajeros = pasajeros.adultos + pasajeros.ninos + pasajeros.bebes;
    const MAX_PASAJEROS = 10;

    
    const handleTogglePasajeros = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClosePasajeros = () => {
        setIsDropdownOpen(false);
    };

    const updatePassengerCount = (type, delta, showInfoModal) => {
        setPasajeros(prev => {
            const newValue = prev[type] + delta;
            const minAdultos = type === 'adultos' ? 1 : 0;
            
            // Validar mínimo (al menos 1 adulto)
            if (newValue < minAdultos) {
                return prev;
            }
            
            // Calcular el nuevo total de pasajeros
            const nuevoTotal = (type === 'adultos' ? newValue : prev.adultos) +
                             (type === 'ninos' ? newValue : prev.ninos) +
                             (type === 'bebes' ? newValue : prev.bebes);
            
            // Validar máximo de 10 pasajeros
            if (delta > 0 && nuevoTotal > MAX_PASAJEROS) {
                if (showInfoModal) {
                    showInfoModal(`El número máximo de pasajeros es ${MAX_PASAJEROS}.`);
                }
                return prev;
            }
            
            return { ...prev, [type]: newValue };
        });
    };

    const handleSoloIdaChange = (e) => {
        setSoloIda(e.target.checked);
        if (e.target.checked) {
             setFechaVuelta('');
        }
    };
const handleSwapClick = () => {
        setOrigen(destino);
        setDestino(origen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        
        if (!localStorage.getItem("sesion")) {
            showInfoModal("Debes iniciar sesión para buscar vuelos.");
            return;
        }

        if (!origen || !destino || !fechaIda || (!soloIda && !fechaVuelta)) {
            setMessage("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (origen === destino) {
            setMessage("El origen y el destino no pueden ser iguales.");
            return;
        }

        if (!soloIda && fechaVuelta && new Date(fechaVuelta) < new Date(fechaIda)) {
            setMessage("La fecha de vuelta debe ser posterior a la fecha de ida.");
            return;
        }

        if (totalPasajeros > MAX_PASAJEROS) {
            setMessage(`El número máximo de pasajeros es ${MAX_PASAJEROS}.`);
            return;
        }

        setMessage('');
        
        const busqueda = {
            origen,
            destino,
            fechaIda,
            fechaVuelta: soloIda ? null : fechaVuelta,
            soloIda,
            pasajeros: totalPasajeros,
            adultos: pasajeros.adultos,
            ninos: pasajeros.ninos,
            bebes: pasajeros.bebes,
        };

        localStorage.setItem("busquedaVuelo", JSON.stringify(busqueda));

     
        const aerolineas = [
            "Aerolíneas Argentinas",
            "LATAM",
            "Iberia",
            "American Airlines",
            "Copa Airlines",
        ];
        const vuelos = [];
        const cantidadVuelos = Math.floor(Math.random() * 6); 

        for (let i = 0; i < cantidadVuelos; i++) {
            const aerolinea = aerolineas[Math.floor(Math.random() * aerolineas.length)];
            const horaSalida = horaRandom();
            const precioBase = precioBasePara(origen, destino);
            const esIdaYVuelta = !soloIda;
            const horaVuelta = esIdaYVuelta ? horaRandom() : null;
            const precioPorPasajero = esIdaYVuelta ? precioBase * 2 : precioBase;
            const precioTotal = precioPorPasajero * totalPasajeros;

            vuelos.push({
                aerolinea,
                origen,
                destino,
                fechaIda,
                horaSalida,
                esIdaYVuelta,
                fechaVuelta: esIdaYVuelta ? fechaVuelta : null,
                horaVuelta,
                precioBase,
                precioPorPasajero,
                pasajeros: totalPasajeros,
                precioTotal,
            });
        }

        localStorage.setItem("vuelosGenerados", JSON.stringify(vuelos));
        navigate('/vuelos');
    };

    return (
        <form
            id="buscador"
            className="buscador-wrap"
            noValidate
            onSubmit={handleSearchSubmit} 
        >
            <div className="search-card">
                <div className="field passenger-select">
                    <label className="suse-mono pasajeros" htmlFor="pasajeros-display">Pasajeros</label>
                    <input
                        id="pasajeros-display"
                        className="select-display"
                        type="text"
                        value={totalPasajeros}
                        readOnly
                        onClick={handleTogglePasajeros}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleTogglePasajeros();
                            }
                        }}
                        aria-haspopup="dialog"
                        aria-controls="pasajeros-dropdown"
                        aria-label="Cantidad de pasajeros"
                    />

                    <div id="pasajeros-dropdown" className={`dropdown ${isDropdownOpen ? '' : 'hidden'}`}>
                        <div className="passenger-group">
                            <span>Adultos <br /><small>(&gt; 12 años)</small></span>
                            <div className="counter">
                                <button type="button" className="minus" onClick={() => updatePassengerCount('adultos', -1, showInfoModal)}>-</button>
                                <span className="value" id="adultos" data-min="1">{pasajeros.adultos}</span>
                                <button 
                                    type="button" 
                                    className="plus" 
                                    onClick={() => updatePassengerCount('adultos', 1, showInfoModal)}
                                    disabled={totalPasajeros >= MAX_PASAJEROS}
                                >+</button>
                            </div>
                        </div>

                        <div className="passenger-group">
                            <span>Niños<br /><small>(2-11 años)</small></span>
                            <div className="counter">
                                <button type="button" className="minus" onClick={() => updatePassengerCount('ninos', -1, showInfoModal)}>-</button>
                                <span className="value" id="ninos" data-min="0">{pasajeros.ninos}</span>
                                <button 
                                    type="button" 
                                    className="plus" 
                                    onClick={() => updatePassengerCount('ninos', 1, showInfoModal)}
                                    disabled={totalPasajeros >= MAX_PASAJEROS}
                                >+</button>
                            </div>
                        </div>
                        
                        <div className="passenger-group">
                            <span>Bebés <br /><small>(&lt; 2 años)</small></span>
                            <div className="counter">
                                <button type="button" className="minus" onClick={() => updatePassengerCount('bebes', -1, showInfoModal)}>-</button>
                                <span className="value" id="bebes" data-min="0">{pasajeros.bebes}</span>
                                <button 
                                    type="button" 
                                    className="plus" 
                                    onClick={() => updatePassengerCount('bebes', 1, showInfoModal)}
                                    disabled={totalPasajeros >= MAX_PASAJEROS}
                                >+</button>
                            </div>
                        </div>
                        
                        {totalPasajeros >= MAX_PASAJEROS && (
                            <p style={{ color: '#d32f2f', fontSize: '12px', margin: '8px 0 0', textAlign: 'center' }}>
                                Máximo {MAX_PASAJEROS} pasajeros
                            </p>
                        )}

                        <button type="button" id="cerrarDropdown" className="btn" onClick={handleClosePasajeros}>
                            Aceptar
                        </button>
                    </div>
                </div>

                 <div className="field">
                    <label className="suse-mono origen" htmlFor="origen">Origen</label>
                    <select
                        id="origen"
                        name="origen"
                        required
                        value={origen}
                        onChange={(e) => {
                            setOrigen(e.target.value);
                            setDestino(''); 
                        }}
                    >
                        <option value="" disabled>Seleccionar...</option>
                        {CIUDADES.map((ciudad) => (
                            <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    id="swap"
                    className="swap"
                    title="Intercambiar"
                    aria-label="Intercambiar"
                    onClick={handleSwapClick} 
                >
                    ⇄
                </button>

                <div className="field">
                    <label className="suse-mono destino" htmlFor="destino">Destino</label>
                    <select
                        id="destino"
                        name="destino"
                        required
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        disabled={!origen}
                    >
                        <option value="" disabled>Seleccionar...</option>
                        {allowedDestinos(origen).map((ciudad) => (
                            <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                    </select>
                </div>

                
                <div className="field">
                    <input 
                        type="checkbox" 
                        id="soloIda" 
                        checked={soloIda}
                        onChange={handleSoloIdaChange} 
                    />
                    <label className="suse-mono checkbox" htmlFor="soloIda">Solo ida</label>
                </div>

                
                <div className="field">
                    <label className="suse-mono fechaIda" htmlFor="fechaIda">Fecha ida</label>
                    <input
                        id="fechaIda"
                        name="fechaIda"
                        type="date"
                        required
                        value={fechaIda}
                        onChange={(e) => setFechaIda(e.target.value)} 
                    />
                </div>

                <div className="field" id="groupVuelta" style={{ display: soloIda ? 'none' : 'block' }}>
                    <label className="suse-mono fechaVuelta" htmlFor="fechaVuelta">Fecha vuelta</label>
                    <input 
                        id="fechaVuelta" 
                        name="fechaVuelta" 
                        type="date"
                        value={fechaVuelta}
                        onChange={(e) => setFechaVuelta(e.target.value)}
                        disabled={soloIda}
                    />
                </div>
                
                <input type="hidden" name="pasajeros" id="pasajeros" value={totalPasajeros} />
                <p id="msg" className="msg" aria-live="polite">{message}</p>
                
                <button className="btn-lupa" id="btnBuscar" type="submit">
                    <img src={lupaImg} alt="Buscar" />
                </button>
            </div>
        </form>
    );
}

export default FlightSearch;