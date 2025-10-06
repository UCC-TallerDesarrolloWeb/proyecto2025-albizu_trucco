const CIUDADES = ["Córdoba", "Buenos Aires", "Miami", "Madrid"];
const fmtUSD = new Intl.NumberFormat("es-AR", {
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
const toMinutes = (hhmm) => {
  if (!hhmm || typeof hhmm !== "string") return Number.NaN;
  const [hStr = "", mStr = ""] = hhmm.split(":");
  const h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return Number.NaN;
  return Math.max(0, Math.min(23, h)) * 60 + Math.max(0, Math.min(59, m));
};

/**
 * Carga opciones en un <select> y, si corresponde, mantiene un valor previo.
 * @method setOptions
 * @param {HTMLSelectElement} select - Select a poblar.
 * @param {string[]} values - Lista de opciones.
 * @param {string} [keep] - Valor a mantener seleccionado si existe.
 * @return {void}
 */
const setOptions = (select, values, keep) => {
  if (!select) return;
  const head =
    '<option value="" disabled selected="selected">Seleccionar...</option>';
  select.innerHTML =
    head +
    (values || []).map((v) => `<option value="${v}">${v}</option>`).join("");
  if (keep && values.includes(keep)) select.value = keep;
};

/**
 * Devuelve destinos válidos según el origen elegido (reglas del negocio).
 * @method allowedDestinos
 * @param {string} origen - Ciudad de origen.
 * @return {string[]} Lista de destinos válidos.
 */
const allowedDestinos = (origen) => {
  if (!origen) return CIUDADES.slice();
  if (origen === "Córdoba") return ["Buenos Aires"];
  if (origen === "Buenos Aires")
    return CIUDADES.filter((c) => c !== "Buenos Aires");
  if (origen === "Miami" || origen === "Madrid")
    return CIUDADES.filter((c) => c !== "Córdoba" && c !== origen);
  return CIUDADES.slice();
};

/**
 * Devuelve orígenes válidos según el destino elegido (reglas del negocio).
 * @method allowedOrigens
 * @param {string} destino - Ciudad de destino.
 * @return {string[]} Lista de orígenes válidos.
 */
const allowedOrigens = (destino) => {
  if (!destino) return CIUDADES.slice();
  if (destino === "Córdoba") return ["Buenos Aires"];
  if (destino === "Buenos Aires")
    return CIUDADES.filter((c) => c !== "Buenos Aires");
  if (destino === "Miami" || destino === "Madrid")
    return CIUDADES.filter((c) => c !== "Córdoba" && c !== destino);
  return CIUDADES.slice();
};

/**
 * Genera una hora aleatoria válida entre 00:00 y 23:59.
 * @method horaRandom
 * @return {string} Hora "HH:MM".
 */
const horaRandom = () => {
  const h = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * Calcula un precio base por pasajero según la ruta (con caso especial CBA↔BA).
 * @method precioBasePara
 * @param {string} origen - Ciudad de origen.
 * @param {string} destino - Ciudad de destino.
 * @return {number} Precio base por pasajero.
 */
const precioBasePara = (origen, destino) => {
  const esCbba =
    (origen === "Córdoba" && destino === "Buenos Aires") ||
    (origen === "Buenos Aires" && destino === "Córdoba");
  if (esCbba) return Math.floor(Math.random() * 81) + 20; // 20–100
  return Math.floor(Math.random() * 601) + 300; // 300–900
};

/**
 * Muestra un diálogo informativo reutilizable (o alert si no existe el modal).
 * @method dialogo
 * @param {string} texto - Mensaje a mostrar.
 * @return {void}
 */
const dialogo = (texto) => {
  const m = document.getElementById("modal-info");
  const t = document.getElementById("modal-info-text");
  const ok = document.getElementById("modal-info-ok");
  if (m && t && ok) {
    t.textContent = texto;
    m.classList.remove("hidden");
    const close = () => {
      m.classList.add("hidden");
      ok.removeEventListener("click", close);
    };
    ok.addEventListener("click", close);
    ok.focus();
  } else {
    alert(texto);
  }
};

// ================== Autenticación ==================

/**
 * Lee el array de usuarios desde localStorage.
 * @method getUsers
 * @return {Array<{usuario:string, clave:string}>} Usuarios registrados.
 */
const getUsers = () => JSON.parse(localStorage.getItem("usuarios") || "[]");

/**
 * Guarda el array de usuarios en localStorage.
 * @method saveUsers
 * @param {Array<{usuario:string, clave:string}>} users - Usuarios a persistir.
 * @return {void}
 */
const saveUsers = (users) =>
  localStorage.setItem("usuarios", JSON.stringify(users));

/**
 * Inicializa el estado de autenticación: usuario demo y visibilidad de menú.
 * (Se llama desde el HTML: onload="initAuth()")
 * @method initAuth
 * @return {void}
 */
window.initAuth = () => {
  if (!localStorage.getItem("usuarios"))
    saveUsers([{ usuario: "prueba", clave: "123" }]);
  actualizarSesion();
};

/**
 * Actualiza la UI según haya sesión o no (muestra menú perfil u opciones login).
 * @method actualizarSesion
 * @return {void}
 */
const actualizarSesion = () => {
  const sesion = localStorage.getItem("sesion");
  const btnLogin = document.getElementById("btnAbrirLogin");
  const btnRegister = document.getElementById("btnAbrirRegistro");
  const perfilMenu = document.getElementById("perfilMenu");
  const perfilDropdown = document.getElementById("perfilDropdown");

  if (sesion) {
    if (btnLogin) btnLogin.style.display = "none";
    if (btnRegister) btnRegister.style.display = "none";
    if (perfilMenu) perfilMenu.classList.remove("hidden");
  } else {
    if (perfilMenu) perfilMenu.classList.add("hidden");
    if (btnLogin) btnLogin.style.display = "";
    if (btnRegister) btnRegister.style.display = "";
    if (perfilDropdown) perfilDropdown.classList.add("hidden");
  }
};

/**
 * Abre el modal de login.
 * @method abrirLogin
 * @return {void}
 */
window.abrirLogin = () =>
  document.getElementById("modal-login")?.classList.remove("hidden");

/**
 * Cierra el modal de login.
 * @method cerrarLogin
 * @return {void}
 */
window.cerrarLogin = () =>
  document.getElementById("modal-login")?.classList.add("hidden");

/**
 * Abre el modal de registro.
 * @method abrirRegistro
 * @return {void}
 */
window.abrirRegistro = () =>
  document.getElementById("modal-register")?.classList.remove("hidden");

/**
 * Cierra el modal de registro.
 * @method cerrarRegistro
 * @return {void}
 */
window.cerrarRegistro = () =>
  document.getElementById("modal-register")?.classList.add("hidden");

/**
 * Abre/cierra el dropdown del perfil.
 * @method togglePerfilDropdown
 * @return {void}
 */
window.togglePerfilDropdown = () => {
  document.getElementById("perfilDropdown")?.classList.toggle("hidden");
};

/**
 * Cierra la sesión y actualiza la UI.
 * @method cerrarSesion
 * @return {void}
 */
window.cerrarSesion = () => {
  localStorage.removeItem("sesion");
  actualizarSesion();
};

/**
 * Intenta autenticar con usuario/clave; si funciona, crea sesión.
 * (Se llama desde el HTML: onclick="confirmarLogin()")
 * @method confirmarLogin
 * @return {void}
 */
window.confirmarLogin = () => {
  const uEl = document.getElementById("login-usuario");
  const cEl = document.getElementById("login-clave");
  const u = (uEl?.value || "").trim();
  const c = (cEl?.value || "").trim();
  const ok = getUsers().find((x) => x.usuario === u && x.clave === c);
  if (ok) {
    localStorage.setItem("sesion", u);
    cerrarLogin();
    if (uEl) uEl.value = "";
    if (cEl) cEl.value = "";
    actualizarSesion();
  } else {
    alert("Usuario o contraseña incorrectos.");
    if (uEl) uEl.value = "";
    if (cEl) cEl.value = "";
    uEl?.focus();
  }
};

/**
 * Registra un usuario nuevo y crea sesión si todo es correcto.
 * (Se llama desde el HTML: onclick="confirmarRegistro()")
 * @method confirmarRegistro
 * @return {void}
 */
window.confirmarRegistro = () => {
  const uEl = document.getElementById("reg-usuario");
  const cEl = document.getElementById("reg-clave");
  const u = (uEl?.value || "").trim();
  const c = (cEl?.value || "").trim();
  if (!u || !c) return dialogo("Completá usuario y contraseña.");

  const users = getUsers();
  if (users.find((x) => x.usuario === u)) {
    dialogo("Ese usuario ya existe.");
    if (uEl) uEl.value = "";
    if (cEl) cEl.value = "";
    uEl?.focus();
    return;
  }
  users.push({ usuario: u, clave: c });
  saveUsers(users);
  localStorage.setItem("sesion", u);
  cerrarRegistro();
  if (uEl) uEl.value = "";
  if (cEl) cEl.value = "";
  actualizarSesion();
  dialogo("Usuario registrado correctamente.");
};

// ================== INDEX (buscador) ==================

/**
 * Atajo para document.getElementById.
 * @method sel
 * @param {string} id - Id del elemento.
 * @return {HTMLElement|null} Elemento encontrado o null.
 */
const sel = (id) => document.getElementById(id);

/**
 * Recalcula el total de pasajeros y sincroniza display (visible) + hidden (form).
 * @method actualizarTotalPasajeros
 * @return {void}
 */
const actualizarTotalPasajeros = () => {
  const a = parseInt(sel("adultos")?.textContent || "1", 10);
  const n = parseInt(sel("ninos")?.textContent || "0", 10);
  const b = parseInt(sel("bebes")?.textContent || "0", 10);
  const total = a + n + b;
  const display = sel("pasajeros-display");
  if (display) display.value = String(total);
  const hidden = sel("pasajeros");
  if (hidden) hidden.value = String(total);
};

/**
 * Inicializa el buscador (selects, fechas mínimas, estado Solo Ida, pasajeros).
 * (Se llama desde el HTML: onload="initIndex()")
 * @method initIndex
 * @return {void}
 */
window.initIndex = () => {
  setOptions(sel("origen"), CIUDADES);
  setOptions(sel("destino"), CIUDADES);

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const min = `${yyyy}-${mm}-${dd}`;
  if (sel("fechaIda")) sel("fechaIda").min = min;
  if (sel("fechaVuelta")) sel("fechaVuelta").min = min;

  if (sel("soloIda")) sel("soloIda").checked = false;
  window.onSoloIdaChange();

  actualizarTotalPasajeros();
};

/**
 * Handler de cambio en Origen: recalcula Destino y evita igualdad.
 * (HTML: onchange="onOrigenChange()")
 * @method onOrigenChange
 * @return {void}
 */
window.onOrigenChange = () => {
  const origen = sel("origen")?.value || "";
  const keep = sel("destino")?.value || "";
  setOptions(sel("destino"), allowedDestinos(origen), keep);
  if (sel("destino") && sel("destino").value === origen)
    sel("destino").value = "";
};

/**
 * Handler de cambio en Destino: recalcula Origen y evita igualdad.
 * (HTML: onchange="onDestinoChange()")
 * @method onDestinoChange
 * @return {void}
 */
window.onDestinoChange = () => {
  const destino = sel("destino")?.value || "";
  const keep = sel("origen")?.value || "";
  setOptions(sel("origen"), allowedOrigens(destino), keep);
  if (sel("origen") && sel("origen").value === destino)
    sel("origen").value = "";
};

/**
 * Intercambia Origen y Destino respetando las reglas; si no es válido, limpia.
 * (HTML: onclick="onSwapClick()")
 * @method onSwapClick
 * @return {void}
 */
window.onSwapClick = () => {
  const oSel = document.getElementById("origen");
  const dSel = document.getElementById("destino");
  if (!oSel || !dSel) return;

  const o = oSel.value || "";
  const d = dSel.value || "";
  if (!o && !d) return;

  let newOrigen = d;
  let newDestino = o;

  const destinosOk = allowedDestinos(newOrigen);
  if (!destinosOk.includes(newDestino)) newDestino = "";

  const origenesOk = allowedOrigens(newDestino);
  if (!origenesOk.includes(newOrigen)) newOrigen = "";

  setOptions(oSel, origenesOk, newOrigen);
  setOptions(dSel, destinosOk, newDestino);
};

/**
 * Muestra/oculta el bloque de fecha de vuelta y limpia/inhabilita si corresponde.
 * (HTML: onchange="onSoloIdaChange()")
 * @method onSoloIdaChange
 * @return {void}
 */
window.onSoloIdaChange = () => {
  const chk = sel("soloIda");
  const groupV = sel("groupVuelta");
  const fv = sel("fechaVuelta");
  if (chk?.checked) {
    groupV?.classList.add("hidden");
    if (fv) {
      fv.value = "";
      fv.disabled = true;
    }
  } else {
    groupV?.classList.remove("hidden");
    if (fv) fv.disabled = false;
  }
};

/**
 * Ajusta el mínimo de la fecha de vuelta según la fecha de ida.
 * (HTML: onchange="onFechaIdaChange()")
 * @method onFechaIdaChange
 * @return {void}
 */
window.onFechaIdaChange = () => {
  const fi = sel("fechaIda")?.value || "";
  if (fi && sel("fechaVuelta")) sel("fechaVuelta").min = fi;
};

/**
 * Abre/cierra el dropdown de pasajeros.
 * (HTML: onclick="togglePasajeros()")
 * @method togglePasajeros
 * @return {void}
 */
window.togglePasajeros = () => {
  sel("pasajeros-dropdown")?.classList.toggle("hidden");
};

/**
 * Cierra el dropdown de pasajeros.
 * (HTML: onclick="cerrarPasajeros()")
 * @method cerrarPasajeros
 * @return {void}
 */
window.cerrarPasajeros = () => {
  sel("pasajeros-dropdown")?.classList.add("hidden");
};

/**
 * Incrementa un contador (adultos/niños/bebés) y actualiza totales.
 * (HTML: onclick="inc('adultos'|'ninos'|'bebes')")
 * @method inc
 * @param {string} id - Id del span con el número a incrementar.
 * @return {void}
 */
window.inc = (id) => {
  const el = sel(id);
  if (!el) return;
  let num = parseInt(el.textContent, 10);
  el.textContent = String(++num);
  actualizarTotalPasajeros();
};

/**
 * Decrementa un contador respetando el mínimo y actualiza totales.
 * (HTML: onclick="dec('adultos'|'ninos'|'bebes')")
 * @method dec
 * @param {string} id - Id del span con el número a decrementar.
 * @return {void}
 */
window.dec = (id) => {
  const el = sel(id);
  if (!el) return;
  const min = parseInt(el.dataset.min || "0", 10);
  let num = parseInt(el.textContent, 10);
  if (num > min) {
    el.textContent = String(--num);
    actualizarTotalPasajeros();
  }
};

/**
 * Valida el formulario, genera resultados y navega a index2.
 * (HTML: onsubmit="return onBuscarSubmit(event)")
 * @method onBuscarSubmit
 * @param {SubmitEvent} e - Evento de envío del formulario.
 * @return {boolean} false para evitar submit real.
 */
window.onBuscarSubmit = (e) => {
  e.preventDefault();

  if (!localStorage.getItem("sesion")) {
    dialogo("Debes iniciar sesión para buscar vuelos.");
    abrirLogin();
    return false;
  }

  const origen = sel("origen")?.value;
  const destino = sel("destino")?.value;
  const fechaIda = sel("fechaIda")?.value;
  const soloIda = sel("soloIda")?.checked;
  const fechaVuelta = sel("fechaVuelta")?.value || null;
  const pasajeros = parseInt(sel("pasajeros")?.value || "1", 10);

  const faltan = [];
  if (!pasajeros || pasajeros < 1) faltan.push("pasajeros");
  if (!origen) faltan.push("origen");
  if (!destino) faltan.push("destino");
  if (!fechaIda) faltan.push("fecha de ida");
  if (!soloIda && !fechaVuelta) faltan.push("fecha de vuelta");
  if (faltan.length) {
    dialogo("Completá: " + faltan.join(", ") + ".");
    return false;
  }

  if (origen === destino) {
    dialogo("El origen y el destino no pueden ser iguales.");
    if (sel("destino")) sel("destino").value = "";
    return false;
  }

  if (!soloIda && fechaVuelta) {
    if (new Date(fechaVuelta) < new Date(fechaIda)) {
      dialogo("La fecha de vuelta debe ser posterior a la fecha de ida.");
      if (sel("fechaVuelta")) sel("fechaVuelta").value = "";
      return false;
    }
  }

  const cantAdultos = parseInt(sel("adultos")?.textContent || "1", 10);
  const cantNinos = parseInt(sel("ninos")?.textContent || "0", 10);
  const cantBebes = parseInt(sel("bebes")?.textContent || "0", 10);

  const busqueda = {
    origen,
    destino,
    fechaIda,
    fechaVuelta: soloIda ? null : fechaVuelta,
    pasajeros,
    adultos: cantAdultos,
    ninos: cantNinos,
    bebes: cantBebes,
    soloIda,
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
  const cantidadVuelos = Math.floor(Math.random() * 6); // 0..5

  for (let i = 0; i < cantidadVuelos; i++) {
    const aerolinea = aerolineas[Math.floor(Math.random() * aerolineas.length)];
    const horaSalida = horaRandom();
    const precioBase = precioBasePara(origen, destino);
    const esIdaYVuelta = !soloIda;
    const horaVuelta = esIdaYVuelta ? horaRandom() : null;
    const precioPorPasajero = esIdaYVuelta ? precioBase * 2 : precioBase;
    const precioTotal = precioPorPasajero * pasajeros;

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
      pasajeros,
      precioTotal,
    });
  }

  localStorage.setItem("vuelosGenerados", JSON.stringify(vuelos));
  window.location.href = "index2.html";
  return false;
};

// ================== INDEX2 (resultados) ==================

let __vuelosOriginal = [];
let __vuelosRenderizados = [];

/**
 * Ordena una lista de vuelos según criterio (precio/hora asc/desc).
 * @method getSorted
 * @param {Array<Object>} base - Vuelos a ordenar.
 * @param {"precio-asc"|"precio-desc"|"hora-asc"|"hora-desc"} criterio - Criterio.
 * @return {Array<Object>} Copia ordenada.
 */
const getSorted = (base, criterio) => {
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

/**
 * Renderiza hasta 5 tarjetas de vuelos dentro de #lista-vuelos.
 * @method renderVuelos
 * @param {Array<Object>} arr - Vuelos a renderizar.
 * @return {void}
 */
const renderVuelos = (arr) => {
  const listaDiv = document.getElementById("lista-vuelos");
  if (!listaDiv) return;

  if (!arr || arr.length === 0) {
    __vuelosRenderizados = [];
    listaDiv.innerHTML = `<div class="sin-resultados">No hay pasajes disponibles</div>`;
    return;
  }

  __vuelosRenderizados = arr.slice(0, 5);
  listaDiv.innerHTML = __vuelosRenderizados
    .map((v, i) => {
      if (v.esIdaYVuelta) {
        return /*html*/ `
      <div class="tarjeta-vuelo">
        <h3>${v.aerolinea}</h3>

        <div>${v.origen} → ${v.destino}</div>
        <small><strong>Fecha ida:</strong> ${v.fechaIda}</small>
        <small><strong>Hora ida:</strong> ${v.horaSalida}</small>
        <hr class="separador" />
        <div>${v.destino} → ${v.origen}</div>
        <small><strong>Fecha vuelta:</strong> ${v.fechaVuelta}</small>
        <small><strong>Hora vuelta:</strong> ${v.horaVuelta}</small>
        <hr class="separador" />

        <div class="fila-precio">
          <strong>Precio total: ${fmtUSD.format(v.precioTotal)}</strong>
          <button class="btn primary" onclick="seleccionarVuelo(${i})">Seleccionar</button>
        </div>
      </div>`;
      } else {
        return /*html*/ `
      <div class="tarjeta-vuelo">
        <h3>${v.aerolinea}</h3>

        <div>${v.origen} → ${v.destino}</div>
        <small><strong>Fecha:</strong> ${v.fechaIda}</small>
        <small><strong>Hora salida:</strong> ${v.horaSalida}</small>
        <hr class="separador" />

        <div class="fila-precio">
          <strong>Precio total: ${fmtUSD.format(v.precioTotal)}</strong>
          <button class="btn primary" onclick="seleccionarVuelo(${i})">Seleccionar</button>
        </div>
      </div>`;
      }
    })
    .join("");
};

/**
 * Inicializa la pantalla de resultados: pinta encabezado y ordena/renderiza.
 * (HTML: onload="initResultados()")
 * @method initResultados
 * @return {void}
 */
window.initResultados = () => {
  if (!localStorage.getItem("sesion")) {
    alert("Debes iniciar sesión para ver los resultados.");
    window.location.href = "index.html";
    return;
  }

  const datos = JSON.parse(localStorage.getItem("busquedaVuelo") || "null");
  const vuelos = JSON.parse(localStorage.getItem("vuelosGenerados") || "[]");
  __vuelosOriginal = vuelos;

  const infoDiv = document.getElementById("info-vuelo");
  if (!datos) {
    document.getElementById("lista-vuelos").innerHTML =
      "<p>No se encontraron datos de búsqueda.</p>";
    return;
  }

  infoDiv.innerHTML = /*html*/ `
    <div class="info-grid">
      <div class="info-item"><h2>Vuelos de ${datos.origen} a ${
    datos.destino
  }</h2></div>
      <div class="info-item"><p><strong>Fecha ida:</strong> ${
        datos.fechaIda
      }</p></div>
      ${
        datos.soloIda
          ? ""
          : `<div class="info-item"><p><strong>Fecha vuelta:</strong> ${datos.fechaVuelta}</p></div>`
      }
      <div class="info-item"><p><strong>Pasajeros:</strong> ${
        datos.pasajeros
      }</p></div>
    </div>
    <hr />
  `;

  const selOrden = document.getElementById("ordenar");
  if (selOrden) selOrden.value = "precio-asc";

  window.aplicarOrden();
};

/**
 * Lee el criterio del select #ordenar, ordena y vuelve a renderizar.
 * (HTML: onchange="aplicarOrden()")
 * @method aplicarOrden
 * @return {void}
 */
window.aplicarOrden = () => {
  const selOrden = document.getElementById("ordenar");
  const criterio = selOrden ? selOrden.value : "precio-asc";
  const ordenados = getSorted(__vuelosOriginal, criterio);
  renderVuelos(ordenados);
};

/**
 * Guarda el vuelo elegido y navega a la página del pasaje.
 * (HTML: onclick="seleccionarVuelo(i)")
 * @method seleccionarVuelo
 * @param {number} index - Índice dentro de la lista renderizada.
 * @return {void}
 */
window.seleccionarVuelo = (index) => {
  const vuelo = __vuelosRenderizados[index];
  if (!vuelo) return;
  if (!localStorage.getItem("sesion")) {
    alert("Debes iniciar sesión.");
    window.location.href = "index.html";
    return;
  }
  localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));
  window.location.href = "index3.html";
};

// ================== INDEX3 (pasaje) ==================

/**
 * Carga los datos del vuelo seleccionado y los imprime en el boleto.
 * (HTML: onload="initPasaje()")
 * @method initPasaje
 * @return {void}
 */
window.initPasaje = () => {
  const sesion = localStorage.getItem("sesion");
  const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado") || "null");

  if (!sesion) {
    alert("Debes iniciar sesión para ver tu pasaje.");
    window.location.href = "index.html";
    return;
  }
  if (!vuelo) {
    alert("No se ha seleccionado un vuelo.");
    window.location.href = "index2.html";
    return;
  }

  const byId = (id) => document.getElementById(id);
  byId("nombreUsuario").textContent = sesion;
  byId("aerolinea").textContent = vuelo.aerolinea;
  byId("origenTxt").textContent = vuelo.origen;
  byId("destinoTxt").textContent = vuelo.destino;
  byId("fechaIdaTxt").textContent = vuelo.fechaIda;
  byId("horaIdaTxt").textContent = vuelo.horaSalida;

  byId("precioTotalTxt").textContent = fmtUSD.format(vuelo.precioTotal);

  if (vuelo.esIdaYVuelta) {
    const bloque = byId("bloqueVuelta");
    bloque.classList.remove("hidden");
    byId("origenVueltaTxt").textContent = vuelo.destino;
    byId("destinoVueltaTxt").textContent = vuelo.origen;
    byId("fechaVueltaTxt").textContent = vuelo.fechaVuelta;
    byId("horaVueltaTxt").textContent = vuelo.horaVuelta;
  }

  const datos = JSON.parse(localStorage.getItem("busquedaVuelo") || "{}");
  const parte = (cant, sing, plur) =>
    !cant || cant <= 0 ? "" : `${cant} ${cant === 1 ? sing : plur}`;
  const partes = [
    parte(datos.adultos, "adulto", "adultos"),
    parte(datos.ninos, "niño", "niños"),
    parte(datos.bebes, "bebé", "bebés"),
  ].filter(Boolean);
  const textoPasajeros = datos.pasajeros
    ? `${datos.pasajeros}${partes.length ? " (" + partes.join(", ") + ")" : ""}`
    : "";
  byId("pasajeros").textContent = textoPasajeros;
};
