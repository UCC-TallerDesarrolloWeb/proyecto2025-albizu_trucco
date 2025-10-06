# proyecto2025
Estructura de Proyecto Taller de Desarrollo Web - 2025

# AM Viajes
**Autores:** Augusto Albizu, Mariano Trucco  
**GitHub Pages:** [https://usuario.github.io/proyecto2025-albizu_trucco](#)  
**Descripción:** Busca y compra de vuelos (origen/destino, fechas, pasajeros) con emisión de pasaje simulado.

## Índice
- [Tecnologías](#tecnologías)
- [Estructura](#estructura)
- [Funcionalidades](#funcionalidades)
- [Accesibilidad](#accesibilidad)

## Tecnologías
- **HTML5**, **CSS3**, **JavaScript** (sin frameworks)
- Google Fonts (SUSE Mono), LocalStorage

## Estructura
| Carpeta/Archivo | Contenido |
|------------------|----------------|
| `index.html` | Buscador y auth |
| `index2.html` | Resultados y ordenamiento |
| `index3.html` | Pasaje emitido |
| `styles.css` | Hoja de estilos principal (estilos globales del sitio) |
| `app.js` | Lógica (validaciones, generación, etc.) |
| `imagenes/` | Logos, fondos, íconos |
| `Sketch/` | Bocetos (PNG/JPG/PDF). Incluye desktop y mobile, y estados (errores, vacíos). |
| `Wireframe/` | (baja fidelidad) en PNG/JPG/PDF. Incluye desktop y mobile, y estados (errores, vacíos). |


## Funcionalidades
- Validación de formulario con mensajes accesibles.
- Generación de vuelos aleatorios (0–5), precios por ruta y ordenamiento.
- Emisión de pasaje con desglose de ida/vuelta y total.

## Accesibilidad
- `label/for` en inputs/selects, `alt` en imágenes.
- `role="dialog"` y foco en modales.

