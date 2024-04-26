import '../style.css'
import 'leaflet/dist/leaflet.css';
import L, { LeafletMouseEvent } from 'leaflet';


L.Icon.Default.imagePath = 'img/icon/';

//Capes
const m_osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

//Mapa
const map = L.map('map', {
  center: [41.689165, 2.491243],
  zoom: 15,
  zoomControl: true,
  layers: [m_osm]
});

//Escala al mapa
L.control.scale({
  imperial: false,
  maxWidth: 300
}).addTo(map);

//Click en una posició
function clicSobreMapa(ev: LeafletMouseEvent) {
  alert("Coordenadas latitud: " + ev.latlng.lat + " y longitud: " + ev.latlng.lng)
}

map.on("click", clicSobreMapa)
