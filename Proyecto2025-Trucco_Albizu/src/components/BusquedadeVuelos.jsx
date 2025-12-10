import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { horaRandom, precioBasePara } from './Vueloutils';
import { getAeropuertos } from '@api/apiService.js';
import lupaImg from '@assets/lupa.png';
import Button from '@components/componente generico/Button';
import '@styles/_search.scss';

const initialPassengers = { adultos: 1, ninos: 0, bebes: 0 };
const MAX_PASAJEROS = 10;
const MAX_AUTOCOMPLETE_RESULTS = 15;
const MAX_FECHA = '2027-12-31';
const obtenerFechaLocalISO = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const hoyISO = obtenerFechaLocalISO();

const formatAeropuerto = (aeropuerto) => {
    if (!aeropuerto) return '';
    const { city, IATA, name, Country } = aeropuerto;
    return `${city} (${IATA}) – ${name} · ${Country}`;
};

const normalizeText = (value) => value?.toString().toLowerCase().trim() ?? '';

const filterAeropuertosList = (aeropuertos, query, excludeId) => {
    if (!Array.isArray(aeropuertos)) return [];
    const normalizedQuery = normalizeText(query);

    const matches = aeropuertos.filter((a) => {
        if (excludeId && a.id === excludeId) return false;
        if (!normalizedQuery) return true;
        const fields = [
            normalizeText(a.city),
            normalizeText(a.name),
            normalizeText(a.Country),
            normalizeText(a.IATA),
        ];
        return fields.some((field) => field.includes(normalizedQuery));
    });

    return matches
        .sort((a, b) => {
            const cityCompare = a.city.localeCompare(b.city, 'es', { sensitivity: 'base' });
            if (cityCompare !== 0) return cityCompare;
            return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        })
        .slice(0, MAX_AUTOCOMPLETE_RESULTS);
};

function FlightSearch({ showInfoModal }) {
    const navigate = useNavigate();
    
    const [pasajeros, setPasajeros] = useState(initialPassengers);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [soloIda, setSoloIda] = useState(false);
    const [selectedOrigen, setSelectedOrigen] = useState(null);
    const [selectedDestino, setSelectedDestino] = useState(null);
    const [searchOrigen, setSearchOrigen] = useState('');
    const [searchDestino, setSearchDestino] = useState('');
    const [fechaIda, setFechaIda] = useState('');
    const [fechaVuelta, setFechaVuelta] = useState('');
    const [message, setMessage] = useState('');
    
    const [aeropuertos, setAeropuertos] = useState([]);
    const [filteredOrigen, setFilteredOrigen] = useState([]);
    const [filteredDestino, setFilteredDestino] = useState([]);
    const [dropdownOrigenOpen, setDropdownOrigenOpen] = useState(false);
    const [dropdownDestinoOpen, setDropdownDestinoOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const totalPasajeros = pasajeros.adultos + pasajeros.ninos + pasajeros.bebes;
    const origenCiudad = selectedOrigen?.city ?? '';
    const destinoCiudad = selectedDestino?.city ?? '';

    const origenDropdownTimeout = useRef(null);
    const destinoDropdownTimeout = useRef(null);
    const passengerRef = useRef(null);

    const clearTimeoutRef = (ref) => {
        if (ref.current) {
            clearTimeout(ref.current);
            ref.current = null;
        }
    };

    const closeDropdownWithDelay = (setter, ref) => {
        clearTimeoutRef(ref);
        ref.current = setTimeout(() => {
            setter(false);
        }, 120);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const aeropuertosData = await getAeropuertos();
                setAeropuertos(aeropuertosData);
                setFilteredOrigen(filterAeropuertosList(aeropuertosData, ''));
                setFilteredDestino(filterAeropuertosList(aeropuertosData, '', null));
            } catch (error) {
                console.error('Error al cargar aeropuertos:', error);
                showInfoModal('Error al cargar los aeropuertos. Por favor, recarga la página.');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [showInfoModal]);

    useEffect(() => {
        setFilteredOrigen(filterAeropuertosList(aeropuertos, searchOrigen, null));
    }, [aeropuertos, searchOrigen]);

    useEffect(() => {
        setFilteredDestino(filterAeropuertosList(aeropuertos, searchDestino, selectedOrigen?.id ?? null));
    }, [aeropuertos, searchDestino, selectedOrigen]);

    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (passengerRef.current && !passengerRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleOrigenInputChange = (value) => {
        setSearchOrigen(value);
        setMessage('');
        if (selectedOrigen) {
            setSelectedOrigen(null);
            if (selectedDestino) {
                setSelectedDestino(null);
                setSearchDestino('');
            }
        }
        setDropdownOrigenOpen(true);
        if (!value?.trim()) {
            setMessage('Ingresá una ciudad o código IATA para el origen.');
        }
        setFilteredOrigen(filterAeropuertosList(aeropuertos, value, null));
    };

    const handleDestinoInputChange = (value) => {
        setSearchDestino(value);
        setMessage('');
        if (selectedDestino) {
            setSelectedDestino(null);
        }
        setDropdownDestinoOpen(true);
        if (!value?.trim()) {
            setMessage('Ingresá una ciudad o código IATA para el destino.');
        }
        setFilteredDestino(filterAeropuertosList(aeropuertos, value, selectedOrigen?.id ?? null));
    };

    const handleFechaIdaChange = (value) => {
        setFechaIda(value);
        if (!value) {
            setMessage('Seleccioná una fecha de ida.');
            return;
        }
        if (!soloIda && fechaVuelta && new Date(value) > new Date(fechaVuelta)) {
            setMessage('La fecha de vuelta debe ser posterior a la fecha de ida.');
            return;
        }
        setMessage('');
    };

    const handleFechaVueltaChange = (value) => {
        setFechaVuelta(value);
        if (soloIda) {
            setMessage('');
            return;
        }
        if (!value) {
            setMessage('Seleccioná una fecha de vuelta.');
            return;
        }
        if (fechaIda && new Date(value) < new Date(fechaIda)) {
            setMessage('La fecha de vuelta debe ser posterior a la fecha de ida.');
            return;
        }
        setMessage('');
    };

    const handleSelectOrigen = (aeropuerto) => {
        clearTimeoutRef(origenDropdownTimeout);
        setSelectedOrigen(aeropuerto);
        setSearchOrigen(formatAeropuerto(aeropuerto));
        setDropdownOrigenOpen(false);
        setMessage('');

       if (selectedDestino && selectedDestino.id === aeropuerto.id) {
            setSelectedDestino(null);
            setSearchDestino('');
        }

        setFilteredDestino(filterAeropuertosList(aeropuertos, searchDestino, aeropuerto.id));
    };

    const handleSelectDestino = (aeropuerto) => {
        clearTimeoutRef(destinoDropdownTimeout);
        setSelectedDestino(aeropuerto);
        setSearchDestino(formatAeropuerto(aeropuerto));
        setDropdownDestinoOpen(false);
        setMessage('');
    };

    const handleTogglePasajeros = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleClosePasajeros = () => {
        setIsDropdownOpen(false);
    };

    const updatePassengerCount = (type, delta, showInfoModal) => {
        setPasajeros(prev => {
            const newValue = prev[type] + delta;
            const minAdultos = type === 'adultos' ? 1 : 0;
            
            if (newValue < minAdultos) {
                return prev;
            }
            
           const nuevoTotal = (type === 'adultos' ? newValue : prev.adultos) +
                             (type === 'ninos' ? newValue : prev.ninos) +
                             (type === 'bebes' ? newValue : prev.bebes);
            
            if (delta > 0 && nuevoTotal > MAX_PASAJEROS) {
                if (showInfoModal) {
                    showInfoModal(`El número máximo de pasajeros es ${MAX_PASAJEROS}.`);
                }
                return prev;
            }
            
            return { ...prev, [type]: newValue };
        });
        setMessage('');
    };

    const handleSoloIdaChange = (e) => {
        const checked = e.target.checked;
        setSoloIda(checked);
        setMessage('');
        if (checked) {
             setFechaVuelta('');
        } else if (!fechaVuelta) {
            setMessage('Seleccioná una fecha de vuelta.');
        }
    };
    const handleSwapClick = () => {
        if (!selectedOrigen && !selectedDestino && !searchOrigen && !searchDestino) {
            return;
        }

        const nuevoOrigen = selectedDestino || null;
        const nuevoDestino = selectedOrigen || null;
        const nuevoSearchOrigen = selectedDestino ? formatAeropuerto(selectedDestino) : searchDestino;
        const nuevoSearchDestino = selectedOrigen ? formatAeropuerto(selectedOrigen) : searchOrigen;

        setSelectedOrigen(nuevoOrigen);
        setSelectedDestino(nuevoDestino);
        setSearchOrigen(nuevoSearchOrigen || '');
        setSearchDestino(nuevoSearchDestino || '');
        setDropdownOrigenOpen(false);
        setDropdownDestinoOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        
        if (!localStorage.getItem("sesion")) {
            showInfoModal("Debes iniciar sesión para buscar vuelos.");
            return;
        }

        if (!selectedOrigen || !selectedDestino) {
            setMessage("Seleccioná un aeropuerto de origen y otro de destino de la lista.");
            return;
        }

        if (!fechaIda || (!soloIda && !fechaVuelta)) {
            setMessage("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (selectedOrigen.id === selectedDestino.id) {
            setMessage("El origen y el destino no pueden ser iguales.");
            return;
        }

        if (new Date(fechaIda) > new Date(MAX_FECHA)) {
            setMessage('La fecha de ida no puede superar el año 2027.');
            return;
        }

        if (!soloIda && fechaVuelta && new Date(fechaVuelta) > new Date(MAX_FECHA)) {
            setMessage('La fecha de vuelta no puede superar el año 2027.');
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

        const origenDisplay = formatAeropuerto(selectedOrigen);
        const destinoDisplay = formatAeropuerto(selectedDestino);
        
        const busqueda = {
            origen: origenDisplay,
            destino: destinoDisplay,
            origenCiudad: selectedOrigen.city,
            origenPais: selectedOrigen.Country,
            origenIATA: selectedOrigen.IATA,
            destinoCiudad: selectedDestino.city,
            destinoPais: selectedDestino.Country,
            destinoIATA: selectedDestino.IATA,
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
            const precioBase = precioBasePara(origenCiudad, destinoCiudad);
            const esIdaYVuelta = !soloIda;
            const horaVuelta = esIdaYVuelta ? horaRandom() : null;
            const precioPorPasajero = esIdaYVuelta ? precioBase * 2 : precioBase;
            const precioTotal = precioPorPasajero * totalPasajeros;

            vuelos.push({
                aerolinea,
                origen: origenDisplay,
                destino: destinoDisplay,
                origenIATA: selectedOrigen.IATA,
                destinoIATA: selectedDestino.IATA,
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
                <div className="field passenger-select" ref={passengerRef}>
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
                            <p className="max-passengers-warning">
                                Máximo {MAX_PASAJEROS} pasajeros
                            </p>
                        )}

                        <Button type="button" id="cerrarDropdown" onClick={handleClosePasajeros}>
                            Aceptar
                        </Button>
                    </div>
                </div>
                <div className="field autocomplete">
                    <label className="suse-mono origen" htmlFor="autocomplete-origen">Aeropuerto Origen</label>
                    <div className={`autocomplete__wrapper ${dropdownOrigenOpen ? 'open' : ''}`}>
                        <input
                            id="autocomplete-origen"
                            type="text"
                            className="autocomplete__input"
                            placeholder={loading ? 'Cargando aeropuertos...' : 'Escribí ciudad, país o código IATA'}
                            value={searchOrigen}
                            onChange={(e) => handleOrigenInputChange(e.target.value)}
                            onFocus={() => {
                                clearTimeoutRef(origenDropdownTimeout);
                                setDropdownOrigenOpen(true);
                                setFilteredOrigen(filterAeropuertosList(aeropuertos, searchOrigen, null));
                            }}
                            onBlur={() => closeDropdownWithDelay(setDropdownOrigenOpen, origenDropdownTimeout)}
                            disabled={loading}
                            autoComplete="off"
                        />
                        <ul className={`autocomplete__list ${dropdownOrigenOpen && !loading ? '' : 'hidden'}`}>
                            {loading && (
                                <li className="autocomplete__empty">Cargando aeropuertos...</li>
                            )}
                            {!loading && filteredOrigen.length === 0 && (
                                <li className="autocomplete__empty">Sin resultados</li>
                            )}
                            {!loading && filteredOrigen.map((aeropuerto) => (
                                <li key={aeropuerto.id} className="autocomplete__option">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectOrigen(aeropuerto)}
                                    >
                                        {aeropuerto.city} ({aeropuerto.IATA})
                                        <span className="autocomplete__meta">
                                            {aeropuerto.name} · {aeropuerto.Country}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
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

                <div className="field autocomplete">
                    <label className="suse-mono destino" htmlFor="autocomplete-destino">Aeropuerto Destino</label>
                    <div className={`autocomplete__wrapper ${dropdownDestinoOpen ? 'open' : ''}`}>
                        <input
                            id="autocomplete-destino"
                            type="text"
                            className="autocomplete__input"
                            placeholder={loading ? 'Cargando aeropuertos...' : 'Escribí ciudad, país o código IATA'}
                            value={searchDestino}
                            onChange={(e) => handleDestinoInputChange(e.target.value)}
                            onFocus={() => {
                                clearTimeoutRef(destinoDropdownTimeout);
                                setDropdownDestinoOpen(true);
                                setFilteredDestino(filterAeropuertosList(aeropuertos, searchDestino, selectedOrigen?.id ?? null));
                            }}
                            onBlur={() => closeDropdownWithDelay(setDropdownDestinoOpen, destinoDropdownTimeout)}
                            disabled={loading || !selectedOrigen}
                            autoComplete="off"
                        />
                        <ul className={`autocomplete__list ${dropdownDestinoOpen && !loading && selectedOrigen ? '' : 'hidden'}`}>
                            {!selectedOrigen && !loading && (
                                <li className="autocomplete__empty">Seleccioná primero un aeropuerto de origen</li>
                            )}
                            {selectedOrigen && !loading && filteredDestino.length === 0 && (
                                <li className="autocomplete__empty">Sin resultados</li>
                            )}
                            {selectedOrigen && !loading && filteredDestino.map((aeropuerto) => (
                                <li key={aeropuerto.id} className="autocomplete__option">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectDestino(aeropuerto)}
                                    >
                                        {aeropuerto.city} ({aeropuerto.IATA})
                                        <span className="autocomplete__meta">
                                            {aeropuerto.name} · {aeropuerto.Country}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                
                <div className="field field--solo-ida">
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
                        min={hoyISO}
                        max={MAX_FECHA}
                        onChange={(e) => handleFechaIdaChange(e.target.value)} 
                    />
                </div>

                <div className={`field ${soloIda ? 'hidden' : ''}`} id="groupVuelta">
                    <label className="suse-mono fechaVuelta" htmlFor="fechaVuelta">Fecha vuelta</label>
                    <input 
                        id="fechaVuelta" 
                        name="fechaVuelta" 
                        type="date"
                        value={fechaVuelta}
                        min={fechaIda || hoyISO}
                        max={MAX_FECHA}
                        onChange={(e) => handleFechaVueltaChange(e.target.value)}
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