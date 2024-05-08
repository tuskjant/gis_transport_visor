import '../assets/style.css'
import '../assets/content.css'
import { startMapSkeleton } from './skeleton';
import 'leaflet/dist/leaflet.css';
import L, { Draggable, LeafletMouseEvent, point } from 'leaflet';
import { punts } from '../assets/data/punts';
import { inputLoc } from './inputLoc';


startMapSkeleton(document);

//Mapa
const my_map = new L.Map("map").setView([41.689165, 2.491243], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(my_map);

my_map.zoomControl.remove();
L.control.zoom({ position: 'topright'  }).addTo(my_map);

/*
//Marcador
const marcador = L.marker([41.689165, 2.491243], {
  draggable: true
}).addTo(my_map)
*/

/*
//Modificar ubicació mapa según posición marcador
my_map.fitBounds([[marcador.getLatLng().lat, marcador.getLatLng().lng]])
*/

/*
//Carga dinámica marcadores
punts.map((point) => {
  const markerItem = L.marker([point.lat, point.long], {
    draggable: true
  }).addTo(my_map);
  markerItem.on("move", () => {
    console.log(`Marcador de la posición (${point.nom}) => ${point.lat} / ${point.long} Eliminado!!!`); +
      my_map.removeLayer(markerItem);
  })
})
*/
/*
//Ajuste de límites mapa a los marcadores
my_map.fitBounds([
  ...punts.map(point => [point.lat, point.long] as [number, number]),
  [marcador.getLatLng().lat, marcador.getLatLng().lng]
])
*/

/*
//Añadir evento al marcador
marcador.on("movestart", () => console.log("movestart - empezamos a mover"));
marcador.on("dragstart", () => console.log("dragstart - empezamos a arrastrar"));
marcador.on("move", () => console.log("move - estamos moviendo"));
marcador.on("drag", () => console.log("drag - estamos arrastrando"));
marcador.on("moveend", () => console.log("moveend - finalizamos mover"));
marcador.on("dragend", () => console.log("dragend - finalizamos arrastrar"));
*/

/*
//Añadir evento 
marcador.on("click", () => console.log("click"));
marcador.on("dblclick", () => console.log("doble click"));
marcador.on("mousedown", () => console.log("mousedown"));
marcador.on("mouseup", () => console.log("mouseup"));
marcador.on("mouseover", () => console.log("mouseover"));
marcador.on("mouseout", () => console.log("mouseout"));
marcador.on("contextmenu", () => console.log("contextmenu"));
*/

/*
//Eliminar marcador al hacer click
marcador.on("move", () => {
  my_map.removeLayer(marcador);
  console.log("Marcador eliminado")
});
*/

/*
//Escala al mapa
L.control.scale({
  imperial: false,
  maxWidth: 300,
  position: "bottomleft"
}).addTo(my_map);
*/



//Click en una posició
/*
function clicSobreMapa(ev: LeafletMouseEvent) {
  alert("Coordenadas latitud: " + ev.latlng.lat + " y longitud: " + ev.latlng.lng)
}


//my_map.on("click", clicSobreMapa)
*/

/*
//Popup - si hay más de uno, se abre siempre el último (no hace caso de openpopup)
const marcador = L.marker([41.689165, 2.491243]).addTo(my_map).bindPopup(`
<h5>Carrer ppal</h5>
`).openPopup();


const popupItem = L.popup().setLatLng([41.669329, 2.490061])
  .setContent('<h2>Carrer Major</h2>')
  .openOn(my_map);
*/

//Tooltip
//Popup - si hay más de uno, se abre siempre el último (no hace caso de openpopup)
const marcador = L.marker([41.689165, 2.491243]).addTo(my_map).bindTooltip(`
<h5>Carrer ppal</h5>
`).openPopup();


const popupItem = L.popup().setLatLng([41.669329, 2.490061])
  .setContent('<h2>Carrer Major</h2>')
  .openOn(my_map);




inputLoc({ position: "topleft", placeHolder: "Posició inicial..." }).addTo(my_map)
inputLoc( { position: "topleft", placeHolder: "Posició final..." }).addTo(my_map)