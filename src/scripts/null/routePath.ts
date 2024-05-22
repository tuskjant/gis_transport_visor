import { Routing } from './route'
import { marcadores } from './marcadores';
import L from 'leaflet';

let routeLine: L.GeoJSON | undefined;

export async function marcadoresPath(map: L.Map) {
    if (Object.keys(marcadores).length >= 2) {
        const coordenadas: [number, number][] = [];
        Object.keys(marcadores).forEach((key) => {
            const marcador = marcadores[key];
            // Array of coordinates from markers
            coordenadas.push([marcador.getLatLng().lng, marcador.getLatLng().lat]);
        });
        
        if (routeLine !== undefined) {
            map.removeLayer(routeLine);
        }
        //Draw route line
        var routing = new Routing(coordenadas[0], coordenadas[1]);
        await routing.getRoute();
        var routeGeometry = routing.getGeometry()
        var route_style = {
            "color": "#0066ff",
            "weight": 5
        }
        routeLine = L.geoJSON(routeGeometry, { style: route_style }).addTo(map)
        console.log(routeGeometry)

        //Show route info
        const geometryCoordinates = routeGeometry.coordinates
        var midpoint = geometryCoordinates[Math.round(geometryCoordinates.length / 2)]
        const popupItem = L.popup().setLatLng([midpoint[1], midpoint[0]])
                .setContent(`<h5>Temps: ${routing.getDuration()}</h5><h5>Distancia: ${routing.getDistance()}</h5>`)
                .openOn(map);

    }
}


