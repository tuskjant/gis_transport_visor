import L from 'leaflet';
import { Geocoder } from './geocod';
import { Routing } from './route'
import { Tsalesmanp } from './tsalesmanp';

/*MarcadoresManager: MarcadoresManager creates markers, route information, draws 
the route between two points, and the route for the traveling salesman problem.*/
export class MarcadoresManager {
    private static marcadores: { [id: string]: L.Marker } = {};
    private static map: L.Map;
    private static geocoder: Geocoder;
    private static routeLine: L.GeoJSON | null = null;

    constructor(map: L.Map, geocoder: Geocoder) {
        MarcadoresManager.map = map;
        MarcadoresManager.geocoder = geocoder;
    }

    //Create marker
    public static crearMarcador(id: string, latitud: number, longitud: number) {
        //Delete if exists
        if (MarcadoresManager.marcadores[id] != null) {
            MarcadoresManager.eliminarMarcador(id)
        }

        //Create marker
        const marcador = L.marker([latitud, longitud], {
            draggable: true,
            title: `Marcador ${id}`
        });

        // Add to marcadores object
        MarcadoresManager.marcadores[id] = marcador;

        // Add to map
        marcador.addTo(MarcadoresManager.map);

        // Update or create route
        MarcadoresManager.marcadoresPath();

        // Movend event on marker
        marcador.on("moveend", async () => {
            // Reverse geocoding
            await MarcadoresManager.geocoder.reverseGeocoding([marcador.getLatLng().lng, marcador.getLatLng().lat]);

            // Update input text
            const texto = MarcadoresManager.geocoder.getText();
            const input = document.getElementById(id) as HTMLInputElement;
            if (input) {
                input.value = texto || '';
            }

            // Update route
            console.log("En marcadores2 -> a marcadores.path");
            MarcadoresManager.marcadoresPath();
        });
    }

    public static getMarcadores() {
        return MarcadoresManager.marcadores;
    }

    public static eliminarMarcador(id: string) {
        // Check if marker exist
        if (MarcadoresManager.marcadores[id]) {
            // Remove from map
            MarcadoresManager.marcadores[id].remove();
            // Remove from marcadores object
            delete MarcadoresManager.marcadores[id];
        }
    }

    //Create route between markers
    public static marcadoresPath() { 
        const numMarcadores = Object.keys(this.marcadores).length;
        if ( numMarcadores == 2) {
            this.route2points();
        }
        if (numMarcadores > 2) {
            this.route3points();
        }
        
    }

    //Create route in case of 2 points: origin - destination
    public static async route2points() {
         //Delete route if exist
        if (MarcadoresManager.routeLine != null) {
            this.map.removeLayer(MarcadoresManager.routeLine);
        }
        //Coordinates of points
        const coordenadas: [number, number][] = [];
        Object.keys(this.marcadores).forEach((key) => {
            const marcador = this.marcadores[key];
            
            // Array of coordinates from markers
            coordenadas.push([marcador.getLatLng().lng, marcador.getLatLng().lat]);
        });  
    
        //Draw route line
        const routing = new Routing(coordenadas[0], coordenadas[1]);
        await routing.getRoute();
        const routeGeometry = routing.getGeometry();
        const route_style = {
            "color": "#0066ff",
            "weight": 5
        }
        this.routeLine = L.geoJSON(routeGeometry, { style: route_style }).addTo(this.map)
        //fit map to route bounds
        const bounds = this.routeLine.getBounds();
        const expandedBounds = bounds.pad(0.1);
        this.map.fitBounds(expandedBounds);

        //Show route info
        const geometryCoordinates = routeGeometry.coordinates
        const midpoint = geometryCoordinates[Math.round(geometryCoordinates.length / 2)]
        const popupItem = L.popup().setLatLng([midpoint[1], midpoint[0]])
                .setContent(`<h5>Temps: ${routing.getDuration()}</h5><h5>Distancia: ${routing.getDistance()}</h5>`)
                .openOn(this.map);

    }

    public static async route3points() {
         //Delete route if exist
        if (MarcadoresManager.routeLine != null) {
            this.map.removeLayer(MarcadoresManager.routeLine);
        }
        //Coordinates of points
        const coordenadas: [number, number][] = [];
        Object.keys(this.marcadores).forEach((key) => {
            const marcador = this.marcadores[key];
            // Array of coordinates from markers
            coordenadas.push([marcador.getLatLng().lng, marcador.getLatLng().lat]);
        }); 

         //Draw route trip
        const trip = new Tsalesmanp(coordenadas);
        await trip.getRoute();
        const routeGeometry = trip.getGeometry()
        const route_style = {
            "color": "#D557E8",
            "weight": 5
        }
        this.routeLine = L.geoJSON(routeGeometry, { style: route_style }).addTo(this.map)
        //fit map to route bounds
        const bounds = this.routeLine.getBounds();
        const expandedBounds = bounds.pad(0.1);
        this.map.fitBounds(expandedBounds);

    }
}
