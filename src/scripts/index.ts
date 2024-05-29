import '../assets/style.css'
import '../assets/content.css'
import '../assets/leaflet_awesome_number_markers.css'
import { startMapSkeleton } from './skeleton';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'pelias-leaflet-plugin'
import { inputLoc } from './inputLoc';
import { Tsalesmanp } from './tsalesmanp';
import CardControl from './cardControl';
import 'leaflet-easybutton';


startMapSkeleton(document);

//Map
const my_map = new L.Map("map").setView([41.689165, 2.491243], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(my_map);

my_map.zoomControl.remove();
L.control.zoom({ position: 'topright'  }).addTo(my_map);

/*
const cardControl = new CardControl();
cardControl.addTo(my_map);
cardControl.addCard("hola");
*/

// Inputs from and to
inputLoc(my_map, { id: 'i', position: "topleft", placeHolder: "Inici..." }).addTo(my_map);
inputLoc(my_map, { id: 'f', position: "topleft", placeHolder: "Destí..." }).addTo(my_map);


var last_input: number = 1

const myButton = L.easyButton(
  "fa-plus-circle",
  () => {
    inputLoc(my_map, {
      id: `p${last_input}`,
      position: "topleft",
      placeHolder: "Parada...",
    }).addTo(my_map);
    last_input ++;

  },
  "Travel Salesman Problem"
).addTo(my_map);









var salesman = new Tsalesmanp([[2.496255, 41.692871], [2.4905873526786393, 41.69201021411497], [2.4904812708389947, 41.6898831366636], [2.4965127714595536, 41.68982691212736]]);
salesman.getRoute()

/*
var geocodingOptions = {      
    url:'https://eines.icgc.cat/geocodificador',
    expanded: true,
    layers: "topo1,topo2,address",
	  autocomplete: true,
	  focus:false
};

L.control.geocoder((''),geocodingOptions).addTo(my_map);
*/