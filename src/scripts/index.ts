import '../assets/content.css'
import '../assets/leaflet_awesome_number_markers.css'
import 'leaflet/dist/leaflet.css';
import { startMapSkeleton } from './skeleton';
import L from 'leaflet';
import { inputLoc } from './inputLoc';
import { Selector, Option } from './selectLoc';
import {Geocoder} from './geocod.ts'


//Viewer skeleton: header and footer
startMapSkeleton(document);

//Map - centered at Sant Celoni
const my_map = new L.Map("map").setView([41.689165, 2.491243], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(my_map);

// Zoom control topright
my_map.zoomControl.remove();
L.control.zoom({ position: 'topright' }).addTo(my_map);

var kkgeocoder = new Geocoder("celo", null, null);
//console.log(kkgeocoder.autocomplete("des"));




// Inputs from and to
const sidebarContent = document.getElementById('sidebar-content');

if (sidebarContent) {
  const input1 = inputLoc({ id: 'i', placeHolder: "Inici..." });
  const input2 = inputLoc({ id: 'p1', placeHolder: "Destí..." });

  const select1 = new Selector('sidebar-content', my_map)

  const input1Container = input1.onAdd(my_map);
  const input2Container = input2.onAdd(my_map);

  if (input1Container && input2Container) {
    sidebarContent.appendChild(input1Container);
    sidebarContent.appendChild(input2Container);

    // Counter for inputs (case TSP)
    let next_input: number = 2;

    // Button to add more inputs (case TSP)
    const button = document.createElement('button');
    button.className = 'leaflet-bar leaflet-control';
    button.innerHTML = '<p class="fa">🞧</p>';
    button.title = "Travel Salesman Problem";
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
      const newInput = inputLoc({
        id: `p${next_input}`,
        placeHolder: "Parada..."
      });

      const newInputContainer = newInput.onAdd(my_map);
      if (newInputContainer) {
        sidebarContent.appendChild(newInputContainer);
        next_input++;
      }
    });

    sidebarContent.appendChild(button);
  }

}


