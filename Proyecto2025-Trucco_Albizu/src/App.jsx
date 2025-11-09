
import { Routes, Route } from 'react-router-dom';
import HeaderPage from './pages/Header'; 
import ResultadoVuelosPage from './pages/ResultadoVuelos'; 
import PasajePage from './pages/Pasaje'; 

function App() {
    return (
       <Routes>
            <Route path="/" element={<HeaderPage />} />
            <Route path="/vuelos" element={<ResultadoVuelosPage />} />
            <Route path="/pasajes" element={<PasajePage />} />
            <Route path="*" element={<HeaderPage />} /> 
        </Routes>
    );
}

export default App;