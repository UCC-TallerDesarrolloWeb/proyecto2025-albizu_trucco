/**
 * Servicio de API para manejar operaciones CRUD con el db.json
 * Usa fetch y async/await (sin .then)
 */

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
 * POST - Agregar un nuevo aeropuerto
 * Nota: En una implementación real, esto haría una petición POST al servidor
 * Por ahora, simulamos la operación cargando, agregando y guardando
 * @param {Object} nuevoAeropuerto - Datos del nuevo aeropuerto
 * @returns {Promise<Object>} Aeropuerto creado con ID
 */
export const addAeropuerto = async (nuevoAeropuerto) => {
    try {
        const aeropuertos = await getAeropuertos();
        const nuevoId = String(Math.max(...aeropuertos.map(a => parseInt(a.id))) + 1);
        const aeropuertoConId = {
            ...nuevoAeropuerto,
            id: nuevoId
        };
        aeropuertos.push(aeropuertoConId);
        // En una implementación real, aquí haríamos un POST al servidor
        // Por ahora, solo retornamos el objeto creado
        console.log('Aeropuerto agregado (simulado):', aeropuertoConId);
        return aeropuertoConId;
    } catch (error) {
        console.error('Error en addAeropuerto:', error);
        throw error;
    }
};

/**
 * PATCH - Actualizar un aeropuerto existente
 * @param {string} id - ID del aeropuerto a actualizar
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Aeropuerto actualizado
 */
export const updateAeropuerto = async (id, datosActualizados) => {
    try {
        const aeropuertos = await getAeropuertos();
        const index = aeropuertos.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error(`Aeropuerto con ID ${id} no encontrado`);
        }
        const aeropuertoActualizado = {
            ...aeropuertos[index],
            ...datosActualizados,
            id: id // Asegurar que el ID no cambie
        };
        aeropuertos[index] = aeropuertoActualizado;
        // En una implementación real, aquí haríamos un PATCH al servidor
        console.log('Aeropuerto actualizado (simulado):', aeropuertoActualizado);
        return aeropuertoActualizado;
    } catch (error) {
        console.error('Error en updateAeropuerto:', error);
        throw error;
    }
};

/**
 * DELETE - Eliminar un aeropuerto
 * @param {string} id - ID del aeropuerto a eliminar
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const deleteAeropuerto = async (id) => {
    try {
        const aeropuertos = await getAeropuertos();
        const index = aeropuertos.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error(`Aeropuerto con ID ${id} no encontrado`);
        }
        aeropuertos.splice(index, 1);
        // En una implementación real, aquí haríamos un DELETE al servidor
        console.log('Aeropuerto eliminado (simulado):', id);
        return true;
    } catch (error) {
        console.error('Error en deleteAeropuerto:', error);
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

