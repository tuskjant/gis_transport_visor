import '../assets/content.css'
import '../assets/leaflet_awesome_number_markers.css'
import 'leaflet/dist/leaflet.css';
import { startMapSkeleton } from './_Skeleton.ts';
import L from 'leaflet';
import { inputLoc } from './inputLoc';
import { Selector, Option } from './selectLoc';
//import { Geocoder } from './geocod.ts'
import { Geocoder } from './_GeocoderService.ts';
import { GeocoderComponent } from './_GeocoderComponent.ts';
import { RoutePanel } from './_RoutePanel.ts';
//import { my_map } from './_Map.ts';


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


//const map = my_map;


const routePanel = new RoutePanel('sidebar-content', my_map);


