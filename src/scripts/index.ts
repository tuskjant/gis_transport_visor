import '../assets/style.css'
import '../assets/content.css'
import '../assets/leaflet_awesome_number_markers.css'
import 'leaflet/dist/leaflet.css';
import { startMapSkeleton } from './skeleton';
import L from 'leaflet';
import { inputLoc } from './inputLoc';
import 'leaflet-easybutton';

//Viewer skeleton: headera and footer
startMapSkeleton(document);

//Map - centered at Sant Celoni
const my_map = new L.Map("map").setView([41.689165, 2.491243], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(my_map);

my_map.zoomControl.remove();
L.control.zoom({ position: 'topright'  }).addTo(my_map);

// Inputs from and to
inputLoc({ id: 'i', position: "topleft", placeHolder: "Inici..." }).addTo(my_map);
inputLoc({ id: 'p1', position: "topleft", placeHolder: "Destí..." }).addTo(my_map);

// Counter for inputs (case TSP)
var next_input: number = 2
// Button to add more inputs (case TSP)
const myButton = L.easyButton(
  "fa-plus-circle",
  () => {
    inputLoc({
      id: `p${next_input}`,
      position: "topleft",
      placeHolder: "Parada...",
    }).addTo(my_map);
    next_input ++;

  },
  "Travel Salesman Problem"
).addTo(my_map);

