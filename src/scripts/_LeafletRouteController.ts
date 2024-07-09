import L from 'leaflet';
import { AwesomeNumberMarkers, AwesomeNumberMarkerOptions } from "./leafletAwesomeNumberMarkers";
import "leaflet-arrowheads";
import { EventEmitter } from './EventEmitter';
import { MarkerPoint, RouteLine } from './interfaces'


export class LeafletRouteController extends EventEmitter{
    private map: L.map;
    private marcadores: { [id: string]: L.Marker } = {};
    private routePolyline: L.polyline;
    

    constructor(map: L.map) {
        super();
        this.map = map;
    }

    public getNumMarcadores(): number{
        return Object.keys(this.marcadores).length;
    }

    //Create or update route point
    public updateRoutePoint(routePoint: MarkerPoint) {
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

        //Event when creating or updating route points
        this.emit('updatedRoutePoint', routePoint);

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
            this.emit('updatedRoutePoint', newRoutePoint);
        });

        this.fitToElements();


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

    // Delete route polyline
    private deleteRoutePolyline() {
        //Delete route if exist
        if (this.routePolyline != null) {
            this.map.removeLayer(this.routePolyline);
        }
    }

    // Center map to fit route points and polyline
    private fitToElements() {
        if (Object.keys(this.marcadores).length > 1) {
            var groupElements: L.Layer[] = [];
            Object.values(this.marcadores).forEach(marker => {
                groupElements.push(marker);
            });
            if (this.routePolyline) {
                groupElements.push(this.routePolyline);
            }
            var featureGroup = new L.FeatureGroup(groupElements);
            const bounds = featureGroup.getBounds();
            const expandedBounds = bounds.pad(0.2);
            this.map.fitBounds(expandedBounds);
        } 
    }

    // Draw routeline from geometry (list of coordinates)
    public updateRoute(routeGeometry: RouteLine) {
        this.deleteRoutePolyline();
        // convert coordinates from geojson to leaflet [lng,lat] -> [lat,lng]
        var coordinates = routeGeometry.coordinates.map(function (
            coord: [number, number]
        ) {
            return [coord[1], coord[0]]; // Leaflet [lat, lng], GeoJSON [lng, lat]
        });

        // Create leaflet polyline
        this.routePolyline = L.polyline(coordinates, {
            color: "#0066ff",
            weight: 5,
        }).addTo(this.map);

        // Add arrowheads to the polyline
        this.routePolyline
            .arrowheads({
                size: "12px",
                frequency: "100px",
                yawn: 45,
            })
            .addTo(this.map);
        
        this.fitToElements();
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



    public getMapCenter(): [number, number] {
        var center: [number, number] = ([this.map.getCenter().lng, this.map.getCenter().lat]);  //focus in center map
        return center;
    }





}