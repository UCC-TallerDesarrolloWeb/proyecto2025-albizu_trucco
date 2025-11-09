import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSorted, fmtUSD } from '@components/Vueloutils';
import logoImg from '@assets/Logo AM.png'; 
const FlightCard = ({ vuelo, onSelect }) => {
    const {
        aerolinea, origen, destino, fechaIda, horaSalida,
        esIdaYVuelta, fechaVuelta, horaVuelta, precioTotal
    } = vuelo;

    return (
        <div className="tarjeta-vuelo">
            <h3>{aerolinea}</h3>

            <div>{origen} → {destino}</div>
            <small><strong>Fecha ida:</strong> {fechaIda}</small>
            <small><strong>Hora ida:</strong> {horaSalida}</small>
            
            {esIdaYVuelta && (
                <>
                    <hr className="separador" />
                    <div>{destino} → {origen}</div>
                    <small><strong>Fecha vuelta:</strong> {fechaVuelta}</small>
                    <small><strong>Hora vuelta:</strong> {horaVuelta}</small>
                </>
            )}

            <hr className="separador" />
            <div className="fila-precio">
            <strong>Precio total: {fmtUSD.format(precioTotal)}</strong>
                <button 
                    className="btn primary" 
                    onClick={() => onSelect(vuelo)}
                >
                    Seleccionar
                </button>
            </div>
        </div>
    );
};

function FlightResultsPage() {
    const navigate = useNavigate();
    
    const [busqueda, setBusqueda] = useState(null);
    const [vuelosOriginal, setVuelosOriginal] = useState([]);
    const [criterioOrden, setCriterioOrden] = useState('precio-asc');
    
    const vuelosOrdenados = getSorted(vuelosOriginal, criterioOrden);
    
    useEffect(() => {
        if (!localStorage.getItem("sesion")) {
            alert("Debes iniciar sesión para ver los resultados.");
            return navigate('/'); 
        }

        const datos = JSON.parse(localStorage.getItem("busquedaVuelo") || "null");
        const vuelosGenerados = JSON.parse(localStorage.getItem("vuelosGenerados") || "[]");

        if (!datos) {
             return navigate('/'); 
        }

        setBusqueda(datos);
        setVuelosOriginal(vuelosGenerados);
     }, [navigate]); 
    const seleccionarVuelo = (vuelo) => {
        localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));
        navigate('/pasajes'); };

    if (!busqueda) {
        return <div className="cargando">Cargando resultados de vuelo...</div>;
    }

    const renderFlightInfo = () => (
        <div className="info-grid">
            <div className="info-item"><h2>Vuelos de {busqueda.origen} a {busqueda.destino}</h2></div>
            <div className="info-item"><p><strong>Fecha ida:</strong> {busqueda.fechaIda}</p></div>
            {!busqueda.soloIda && (
                <div className="info-item"><p><strong>Fecha vuelta:</strong> {busqueda.fechaVuelta}</p></div>
            )}
            <div className="info-item"><p><strong>Pasajeros:</strong> {busqueda.pasajeros}</p></div>
        </div>
    );
    
    const renderVuelosList = () => {
        if (vuelosOrdenados.length === 0) {
            return <div className="sin-resultados">No hay pasajes disponibles</div>;
        }

        return vuelosOrdenados.slice(0, 5).map((vuelo, index) => (
            <FlightCard key={index} vuelo={vuelo} onSelect={seleccionarVuelo} />
        ));
    };

    return (
        <div className="body2">
            <header className="topbar">
                <div className="brand">
                    <Link to="/" className="logo" aria-label="Inicio">
                        <img src={logoImg} alt="AM Viajes" />
                    </Link>
                </div>
               </header>

            <main className="container" id="resultados">
                <div className="info-vuelo" id="info-vuelo">
                    {renderFlightInfo()}
                    <hr />
                </div>
                
                <div className="info-bar orden-bar">
                    <label className="suse-mono" htmlFor="ordenar">Ordenar por:</label>
                    <select 
                        id="ordenar" 
                        value={criterioOrden}
                        onChange={(e) => setCriterioOrden(e.target.value)} 
                        >
                        <option value="precio-asc">Precio (menor a mayor)</option>
                        <option value="precio-desc">Precio (mayor a menor)</option>
                        <option value="hora-asc">Hora (00 → 23:59)</option>
                        <option value="hora-desc">Hora (23:59 → 00)</option>
                    </select>
                </div>

                <div className="lista-vuelos" id="lista-vuelos">
                    {renderVuelosList()}
                </div>
            </main>
        </div>
    );
}

export default FlightResultsPage;