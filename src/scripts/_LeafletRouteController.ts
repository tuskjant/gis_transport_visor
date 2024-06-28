import L from 'leaflet';
import { AwesomeNumberMarkers, AwesomeNumberMarkerOptions } from "./leafletAwesomeNumberMarkers";


export class LeafletRouteController {
    private map: L.Map;
    private marcadores: { [id: string]: L.Marker } = {};

    constructor(map: L.map) {
        this.map = map;
    }

    //Create or update route point
    updateRoutePoint(routePointId: string, type:string, location: [number, number]) {
        if (this.marcadores[routePointId] != null) {
            this.deleteRoutePoint(routePointId);
        }

        //Create marker
        const awesomeNumberMarkerIcon = new AwesomeNumberMarkers({
            icon: "home",
            markerColor: "blue",
            numberColor: "white",
            number: routePointId,
        } as AwesomeNumberMarkerOptions);

        const marcador = L.marker([location[0], location[1]], {
            draggable: true,
            title: `Marcador ${routePointId}`,
            icon: awesomeNumberMarkerIcon,
        });

        this.marcadores[routePointId] = marcador;

        marcador.addTo(this.map);

    }

    // Delete route point by id
    deleteRoutePoint(routePointId: string) {
        // Check if marker exist
        if (this.marcadores[routePointId]) {
            // Remove from map
            this.marcadores[routePointId].remove();
            // Remove from marcadores object
            delete this.marcadores[routePointId];
        }
    }

    updateRoute(route: string) {
        
    }

    enableRoutePointInput() {
        
    }

    disableRoutePointInput() {
        
    }

    onRoutePointInput(routePointId: string, callback) {
        
    }





}