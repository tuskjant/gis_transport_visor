import L from 'leaflet';
import { AwesomeNumberMarkers, AwesomeNumberMarkerOptions } from "./leafletAwesomeNumberMarkers";
import { EventEmitter } from './EventEmitter';
import {markerPoint} from './interfaces'


export class LeafletRouteController extends EventEmitter{
    private map: L.Map;
    private marcadores: { [id: string]: L.Marker } = {};
    

    constructor(map: L.Map) {
        super();
        this.map = map;
    }

    //Create or update route point
    public updateRoutePoint(routePoint: markerPoint) {
        const routePointId = routePoint.pointId;
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

        const marcador = L.marker([routePoint.point.coordinates[1], routePoint.point.coordinates[0]], {
            draggable: true,
            title: `Marcador ${routePointId}`,
            icon: awesomeNumberMarkerIcon,
        });

        //Add to list of markers
        this.marcadores[routePointId] = marcador;
        //Add to map
        marcador.addTo(this.map);

        // Event handle dblclick -> emit event markerDblclick
        marcador.on('dblclick', () => {
            this.deleteRoutePoint(routePointId);
            this.emit('markerDblclick', routePoint);
        });
        
        // Event handle moveend -> emit event markerMove
        marcador.on('moveend', () => {
            console.log(marcador.getLatLng().lng),
            console.log(marcador.getLatLng().lat);
            var newRoutePoint = routePoint;
            newRoutePoint.point.coordinates[0] = marcador.getLatLng().lng;
            newRoutePoint.point.coordinates[1] = marcador.getLatLng().lat;
            this.emit('markerMove', newRoutePoint);
        });
    }


    // Delete route point by id
    private deleteRoutePoint(routePointId: string) {
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

    //Enable route point input
    public useMapPointInput(callback: (clickedPoint: [number, number]) => void) {
        const clickHandler = (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            callback([lat, lng]);
            this.map.off('click', clickHandler);
        };

        this.map.on('click', clickHandler);
    }


    onRoutePointInput(routePointId: string, callback) {
        
    }

    getMapCenter(): [number, number] {
        var center: [number, number] = ([this.map.getCenter().lng, this.map.getCenter().lat]);  //focus in center map
        return center;
    }





}