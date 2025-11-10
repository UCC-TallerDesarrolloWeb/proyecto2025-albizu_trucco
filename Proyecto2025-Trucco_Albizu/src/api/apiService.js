
const API_URL = '/data/db.json';

/**
 * GET - Obtener todos los aeropuertos
 * @returns {Promise<Array>} Lista de aeropuertos
 */
export const getAeropuertos = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al cargar aeropuertos: ${response.status}`);
        }
        const data = await response.json();
        return data.aeropuertos || [];
    } catch (error) {
        console.error('Error en getAeropuertos:', error);
        throw error;
    }
};

/**
 * GET - Obtener un aeropuerto por ID
 * @param {string} id - ID del aeropuerto
 * @returns {Promise<Object>} Aeropuerto encontrado
 */
export const getAeropuertoById = async (id) => {
    try {
        const aeropuertos = await getAeropuertos();
        const aeropuerto = aeropuertos.find(a => a.id === id);
        if (!aeropuerto) {
            throw new Error(`Aeropuerto con ID ${id} no encontrado`);
        }
        return aeropuerto;
    } catch (error) {
        console.error('Error en getAeropuertoById:', error);
        throw error;
    }
};

/**
 * GET - Obtener aeropuertos filtrados por país
 * @param {string} country - Nombre del país
 * @returns {Promise<Array>} Lista de aeropuertos del país
 */
export const getAeropuertosByCountry = async (country) => {
    try {
        const aeropuertos = await getAeropuertos();
        if (!country) {
            return aeropuertos;
        }
        return aeropuertos.filter(a => a.Country === country);
    } catch (error) {
        console.error('Error en getAeropuertosByCountry:', error);
        throw error;
    }
};

/**
 * GET - Obtener lista única de países
 * @returns {Promise<Array>} Lista de países únicos
 */
export const getPaises = async () => {
    try {
        const aeropuertos = await getAeropuertos();
        const paises = [...new Set(aeropuertos.map(a => a.Country))];
        return paises.sort();
    } catch (error) {
        console.error('Error en getPaises:', error);
        throw error;
    }
};
/**
 * GET - Buscar aeropuerto por ciudad
 * @param {string} ciudad - Nombre de la ciudad
 * @returns {Promise<Object|null>} Aeropuerto encontrado o null
 */
export const getAeropuertoByCity = async (ciudad) => {
    try {
        const aeropuertos = await getAeropuertos();
        const aeropuerto = aeropuertos.find(a => 
            a.city.toLowerCase() === ciudad.toLowerCase()
        );
        return aeropuerto || null;
    } catch (error) {
        console.error('Error en getAeropuertoByCity:', error);
        throw error;
    }
};

