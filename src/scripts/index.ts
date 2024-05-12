import '../assets/style.css'
import '../assets/content.css'
import { startMapSkeleton } from './skeleton';
import 'leaflet/dist/leaflet.css';
import L, { Draggable, LeafletMouseEvent, point } from 'leaflet';
import 'pelias-leaflet-plugin'
import MyGeocoderPlugin from 'pelias-leaflet-plugin';
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




inputLoc(my_map, { id: 'input_from', position: "topleft", placeHolder: "Posició inicial..." }).addTo(my_map)
inputLoc(my_map, { id: 'input_to', position: "topleft", placeHolder: "Posició final..." }).addTo(my_map)

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