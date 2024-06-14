import L from "leaflet";
import { Geocoder } from "./geocod";
import { Routing } from "./route";
import { Tsalesmanp } from "./tsalesmanp";
import {AwesomeNumberMarkers, AwesomeNumberMarkerOptions } from "./leafletAwesomeNumberMarkers";
import "leaflet-arrowheads";

/**  Class to create markers, show route information, create  
* the route between two points, and the route for the traveling salesman problem (TSP) for more than 2 points.
*/
export class MarcadoresManager {
    private static marcadores: { [id: string]: L.Marker } = {}; //Object to store markers by their IDs.
    private static map: L.Map;
    private static geocoder: Geocoder; //Geocoder instance
    private static routeLine: L.Polyline | null = null; //Polyline representing the route
    private static paths: L.Polyline[] = []; //Polyline representing the path from geocoded point to point in the route
        //when they're not the same point (case point far from street)

    /**
   * Creates an instance of MarcadoresManager.
   * @param {L.Map} map - The Leaflet map instance.
   * @param {Geocoder} geocoder - The geocoder instance.
   */
    constructor(map: L.Map, geocoder: Geocoder) {
        MarcadoresManager.map = map;
        MarcadoresManager.geocoder = geocoder;
    }

   /**
   * Creates a marker on the map.
   * @param {string} id - The unique identifier for the marker.
   * @param {number} latitud - The latitude for the marker.
   * @param {number} longitud - The longitude for the marker.
   */
    public static crearMarcador(id: string, latitud: number, longitud: number) {
        //Delete if exists
        if (MarcadoresManager.marcadores[id] != null) {
            MarcadoresManager.eliminarMarcador(id);
        }

        //Create marker
        const awesomeNumberMarkerIcon = new AwesomeNumberMarkers({
            icon: "home",
            markerColor: "blue",
            numberColor: "white",
            number: id,
        } as AwesomeNumberMarkerOptions);

        const marcador = L.marker([latitud, longitud], {
            draggable: true,
            title: `Marcador ${id}`,
            icon: awesomeNumberMarkerIcon,
        });

        // Add to marcadores object
        MarcadoresManager.marcadores[id] = marcador;

        // Add to map
        marcador.addTo(MarcadoresManager.map);

        //Fit map bounds to markers (case 1 marker)
        this.map.setView(marcador.getLatLng());

        // Update or create route
        MarcadoresManager.marcadoresPath();

        // Event on marker- "Movend" : recalculate reverse geocoding, show directions and recalculate route
        marcador.on("moveend", async () => {
            // Reverse geocoding
            await MarcadoresManager.geocoder.reverseGeocoding([
                marcador.getLatLng().lng,
                marcador.getLatLng().lat,
            ]);

            // Update input text
            const texto = MarcadoresManager.geocoder.getText();
            const input = document.getElementById(id) as HTMLInputElement;
            if (input) {
                input.value = texto || "";
            }

            // Update route
            MarcadoresManager.marcadoresPath();
        });

        // Event on marker: "double click" - Remove marker
        marcador.on("dblclick", () => {
            // remove maker
            MarcadoresManager.eliminarMarcador(id); 
            //remove routeline
            if (MarcadoresManager.routeLine != null) {
                this.map.removeLayer(MarcadoresManager.routeLine);
            } 
            //remove text from input
            const input = document.getElementById(id) as HTMLInputElement; 
            if (input) {
                input.value = "";
            }
            // redraw routeline
            MarcadoresManager.marcadoresPath(); 
        });
    }

    public static getMarcadores(): { [id: string]: L.Marker } {
        return MarcadoresManager.marcadores;
    }

    /* Remove marker by id 
    */
    public static eliminarMarcador(id: string) {
        // Check if marker exist
        if (MarcadoresManager.marcadores[id]) {
            // Remove from map
            MarcadoresManager.marcadores[id].remove();
            // Remove from marcadores object
            delete MarcadoresManager.marcadores[id];
        }
    }

    /** Create route between points depending of number of points (simple route or TSP)
     */
    public static marcadoresPath() {
        const numMarcadores = Object.keys(this.marcadores).length;
        if (numMarcadores == 2) {  //simple route
            this.route2points();
        }
        if (numMarcadores > 2) {  //Travelling Salesman Problem
            this.route3points();
        }
    }

    /**  Create route in case of 2 points: origin - destination
    */
    public static async route2points() {
        //Delete route and paths if exist
        if (MarcadoresManager.routeLine != null) {
            this.map.removeLayer(MarcadoresManager.routeLine);
        }
        if (this.paths.length > 0) {
            this.paths.forEach((polyline) => {
                this.map.removeLayer(polyline)
            })
        }

        //Get coordinates of points
        const coordenadas: [number, number][] = [];
        Object.keys(this.marcadores).forEach((key) => {
            const marcador = this.marcadores[key];

            // Array of coordinates from markers
            coordenadas.push([
                marcador.getLatLng().lng,
                marcador.getLatLng().lat,
            ]);
        });

        //Get the route geometry using Routing class
        const routing = new Routing(coordenadas[0], coordenadas[1]);
        await routing.getRoute();
        const routeGeometry = routing.getGeometry();

        // convert coordinates from geojson to leaflet
        var coordinates = routeGeometry.coordinates.map(function (
            coord: [number, number]
        ) {
            return [coord[1], coord[0]]; // Leaflet [lat, lng], GeoJSON [lng, lat]
        });

        // Create leaflet polyline
        this.routeLine = L.polyline(coordinates, {
            color: "#0066ff",
            weight: 5,
        }).addTo(this.map);

        // Add arrowheads to the polyline
        this.routeLine
            .arrowheads({
                size: "10px",
                frequency: "100px",
                yawn: 45,
            })
            .addTo(this.map);

        // Create path to route (from geocoded point to route point)
        var searchPointStart: [number, number] = coordenadas[0];
        var searchPointEnd: [number, number] = coordenadas[1];
        var returnedStart: [number, number] = routing.getStart();
        var returnedEnd: [number, number] = routing.getStop();

        const startPath = L.polyline(
            [
                [searchPointStart[1], searchPointStart[0]],
                [returnedStart[1], returnedStart[0]],
            ],
            {
                color: "grey",
                weight: 5,
                dashArray: "10, 10",
            }
        ).addTo(this.map);

        this.paths.push(startPath);

        const endPath = L.polyline(
            [
                [searchPointEnd[1], searchPointEnd[0]],
                [returnedEnd[1], returnedEnd[0]],
            ],
            {
                color: "grey",
                weight: 5,
                dashArray: "10, 10",
            }
        ).addTo(this.map);

        this.paths.push(endPath);

        // Show route information when clicking on route line
        this.routeLine.on("click", () => {
            this.showInfo2points(routing, routeGeometry);
        });

        // Fit map to route bounds
        const bounds = this.routeLine.getBounds();
        const expandedBounds = bounds.pad(0.1);
        this.map.fitBounds(expandedBounds);

        // Show route info
        this.showInfo2points(routing, routeGeometry);
    }

    /**  Create route in case of 3 points: origin - destination
    */
    public static async route3points() {
        //Delete route and path if exist
        if (MarcadoresManager.routeLine != null) {
            this.map.removeLayer(MarcadoresManager.routeLine);
        }
        if (this.paths.length > 0) {
            this.paths.forEach((polyline) => {
                this.map.removeLayer(polyline)
            })
        }
        //Coordinates of points
        const coordenadas: [number, number][] = [];
        Object.keys(this.marcadores).forEach((key) => {
            const marcador = this.marcadores[key];
            // Array of coordinates from markers
            coordenadas.push([
                marcador.getLatLng().lng,
                marcador.getLatLng().lat,
            ]);
        });

        //Draw route trip using Tsalesmanp class
        const trip = new Tsalesmanp(coordenadas);
        await trip.getRoute();
        const routeGeometry = trip.getGeometry();

        // Convert coordinates from geojson to leaflet
        var coordinates = routeGeometry.coordinates.map(function (
            coord: [number, number]
        ) {
            return [coord[1], coord[0]]; // Leaflet [lat, lng], GeoJSON [lng, lat]
        });

        // Create leaflet polyline
        this.routeLine = L.polyline(coordinates, {
            color: "#0066ff",
            weight: 5,
        }).addTo(this.map);

        // Add arrowheads to the polyline
        this.routeLine
            .arrowheads({
                size: "10px",
                frequency: "100px",
                yawn: 45,
            })
            .addTo(this.map);
        
        //Add paths to route start, end, and stopovers
        
        

        //Show route info on click
        this.routeLine.on("click", () => {
            this.showInfo3points(trip, routeGeometry);
        });

        //Show route info
        this.showInfo3points(trip, routeGeometry);

        //fit map to route bounds
        const bounds = this.routeLine.getBounds();
        const expandedBounds = bounds.pad(0.1);
        this.map.fitBounds(expandedBounds);
    }

    /* Show popup with route info for 2 points 
    */
    public static showInfo2points(
        routing: Routing,
        routeGeometry: Record<string, any>
    ) {
        const geometryCoordinates = routeGeometry.coordinates;
        const midpoint =
            geometryCoordinates[Math.round(geometryCoordinates.length / 2)];
        const popupItem = L.popup()
            .setLatLng([midpoint[1], midpoint[0]])
            .setContent(
                `<h5>Temps: ${routing.getDuration()}</h5><h5>Distancia: ${routing.getDistance()}</h5>`
            )
            .openOn(this.map);
    }

    /* Show popup wieh route info >2 points
    */
    public static showInfo3points(
        trip: Tsalesmanp,
        routeGeometry: Record<string, any>
    ) {
        const geometryCoordinates = routeGeometry.coordinates;
        const midpoint =
            geometryCoordinates[Math.round(geometryCoordinates.length / 2)];
        const popupItem = L.popup()
            .setLatLng([midpoint[1], midpoint[0]])
            .setContent(
                `<h5>Temps: ${trip.getDuration()}</h5><h5>Distancia: ${trip.getDistance()}</h5><h5>Ruta: ${trip.getRouteOrder()}</h5>`
            )
            .openOn(this.map);
    }
}
