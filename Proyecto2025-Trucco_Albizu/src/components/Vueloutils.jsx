
export const CIUDADES = ["Córdoba", "Buenos Aires", "Miami", "Madrid"];


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


export const allowedDestinos = (origen) => {
    if (!origen) return CIUDADES.slice();
    if (origen === "Córdoba") return ["Buenos Aires"];
    if (origen === "Buenos Aires")
        return CIUDADES.filter((c) => c !== "Buenos Aires");
    if (origen === "Miami" || origen === "Madrid")
        return CIUDADES.filter((c) => c !== "Córdoba" && c !== origen);
    return CIUDADES.slice();
};


export const allowedOrigens = (destino) => {
    if (!destino) return CIUDADES.slice();
    if (destino === "Córdoba") return ["Buenos Aires"];
    if (destino === "Buenos Aires")
        return CIUDADES.filter((c) => c !== "Buenos Aires");
    if (destino === "Miami" || destino === "Madrid")
        return CIUDADES.filter((c) => c !== "Córdoba" && c !== destino);
    return CIUDADES.slice();
};


export const horaRandom = () => {
    const h = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    return `${h}:${m}`;
};

export const precioBasePara = (origen, destino) => {
    const esCbba =
        (origen === "Córdoba" && destino === "Buenos Aires") ||
        (origen === "Buenos Aires" && destino === "Córdoba");
    if (esCbba) return Math.floor(Math.random() * 81) + 20; 
    return Math.floor(Math.random() * 601) + 300; 
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