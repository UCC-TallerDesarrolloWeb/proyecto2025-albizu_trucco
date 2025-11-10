import HeaderComponent from '@components/HeaderComponent';
import FlightSearch from '@components/BusquedadeVuelos';
import ModalInfo from '@components/ModalInfo';
import React, { useState, useEffect } from 'react';
import '@styles/_layout.scss';


function Home() {

    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [infoModalText, setInfoModalText] = useState('Mensaje');

  
    const showInfoModal = (text) => {
        setInfoModalText(text);
        setInfoModalVisible(true);
    };

    const handleInfoModalClose = () => {
        setInfoModalVisible(false);
    };

    useEffect(() => {
        console.log("Componente Home cargado. Ejecutando lógica de inicialización (React useEffect).");

    }, []);

    return (
        <div className="body1">
            <HeaderComponent showInfoModal={showInfoModal} /> 
            
            <main className="container">
                <FlightSearch showInfoModal={showInfoModal} />
            </main>
            
            <footer className="footer"></footer>

            <ModalInfo 
                isVisible={infoModalVisible}
                message={infoModalText}
                onClose={handleInfoModalClose}
            />
        </div>
    );
}

export default Home;