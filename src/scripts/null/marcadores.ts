import L from 'leaflet'
import { Geocoder } from './geocod';
//import { Geocoder } from './test/geocod_test'
import { marcadoresPath } from './routePath';


const marcadores: { [id: string]: L.Marker } = {};

// Create marker based on id
export function crearMarcador(id: string, latitud: number, longitud: number, map: L.Map, geocoder: Geocoder) {
    const marcador = L.marker([latitud, longitud], {
        draggable: true,
        title: `Marcador ${id}` 
    });

    // Add to markers
    marcadores[id] = marcador;

    // Add marker to map
    marcador.addTo(map);
    // Trigger when stop moving the marker
    marcador.on("moveend", async () => {
        //reverse geocoding
        await geocoder.reverseGeocoding([marcador.getLatLng().lng, marcador.getLatLng().lat]);
        //update input text
        const texto = geocoder.getText();
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
            input.value = texto || '';
        }
        marcadoresPath(map)
    });
}

export { marcadores };
