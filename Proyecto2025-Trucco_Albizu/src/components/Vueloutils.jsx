
// CIUDADES ya no se usa, se cargan desde db.json


export const fmtUSD = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

/**
 * Convierte una hora "HH:MM" a minutos desde medianoche.
 * @method toMinutes
 * @param {string} hhmm - Hora en formato "HH:MM".
 * @return {number} Minutos desde las 00:00 (NaN si no es válida).
 */
export const toMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== "string") return Number.NaN;
    const [hStr = "", mStr = ""] = hhmm.split(":");
    const h = Number.parseInt(hStr, 10);
    const m = Number.parseInt(mStr, 10);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return Number.NaN;
    return Math.max(0, Math.min(23, h)) * 60 + Math.max(0, Math.min(59, m));
};


// allowedDestinos y allowedOrigens ya no se usan, se manejan en el componente con filtrado por país


export const horaRandom = () => {
    const h = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    return `${h}:${m}`;
};

/**
 * Calcula el precio base para una ruta entre origen y destino
 * @param {string} origen - Ciudad de origen
 * @param {string} destino - Ciudad de destino
 * @returns {number} Precio base aleatorio
 */
export const precioBasePara = (origen, destino) => {
    // Rutas domésticas en Argentina (más baratas)
    const ciudadesArgentina = ["Córdoba", "Buenos Aires"];
    const esRutaDomesticaArgentina = 
        ciudadesArgentina.includes(origen) && ciudadesArgentina.includes(destino);
    
    if (esRutaDomesticaArgentina) {
        return Math.floor(Math.random() * 81) + 20; // $20 - $100
    }
    
    // Rutas internacionales (más caras)
    return Math.floor(Math.random() * 601) + 300; // $300 - $900
};


export const getSorted = (base, criterio) => {
    const arr = [...(base || [])];
    switch (criterio) {
        case "precio-asc":
            arr.sort((a, b) => a.precioTotal - b.precioTotal);
            break;
        case "precio-desc":
            arr.sort((a, b) => b.precioTotal - a.precioTotal);
            break;
        case "hora-asc":
            arr.sort((a, b) => toMinutes(a.horaSalida) - toMinutes(b.horaSalida));
            break;
        case "hora-desc":
            arr.sort((a, b) => toMinutes(b.horaSalida) - toMinutes(a.horaSalida));
            break;
        default:
            break;
    }
    return arr;
};