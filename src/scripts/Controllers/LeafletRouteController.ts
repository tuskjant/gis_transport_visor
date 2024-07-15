import L from "leaflet";
import {
    AwesomeNumberMarkers,
    AwesomeNumberMarkerOptions,
} from "../Utils/leafletAwesomeNumberMarkers";
import "leaflet-arrowheads";
import { EventEmitter } from "../Utils/EventEmitter";
import { MarkerPoint, RouteLine } from "../Domain/interfaces";

/**
 * Class to create markers, show route information, draw route polyline and paths
 */

export class LeafletRouteController extends EventEmitter {
    private map: L.map;
    private markers: { [id: string]: L.Marker } = {};
    private routePolyline: L.Polyline;
    private paths: L.Polyline[] = []; //Polyline representing the path from geocoded point to point in the route
    //when they're not the same point (case point far from street)

    constructor(map: L.map) {
        super();
        this.map = map;
    }

    public getNumMarcadores(): number {
        return Object.keys(this.markers).length;
    }

    //Create or update route point
    public updateRoutePoint(routePoint: MarkerPoint) {
        const routePointId = routePoint.pointId;
        if (this.markers[routePointId] != null) {
            this.deleteRoutePoint(routePointId);
        }

        //Create marker
        const awesomeNumberMarkerIcon = new AwesomeNumberMarkers({
            icon: "home",
            markerColor: "blue",
            numberColor: "white",
            number: routePointId,
        } as AwesomeNumberMarkerOptions);

        const marcador = L.marker(
            [routePoint.point.coordinates[1], routePoint.point.coordinates[0]],
            {
                draggable: true,
                title: `Marcador ${routePointId}`,
                icon: awesomeNumberMarkerIcon,
            }
        );

        //Add to list of markers
        this.markers[routePointId] = marcador;
        //Add to map
        marcador.addTo(this.map);

        //Event when creating or updating route points
        this.emit("updatedRoutePoint", routePoint);

        // Event handle dblclick -> emit event markerDblclick
        marcador.on("dblclick", () => {
            this.deleteRoutePoint(routePointId);
            this.deleteRoutePolyline();
            this.emit("markerDblclick", routePoint);
        });

        // Event handle moveend -> emit event markerMove
        marcador.on("moveend", () => {
            var newRoutePoint = routePoint;
            newRoutePoint.point.coordinates[0] = marcador.getLatLng().lng;
            newRoutePoint.point.coordinates[1] = marcador.getLatLng().lat;
            this.emit("markerMove", newRoutePoint);
            this.emit("updatedRoutePoint", newRoutePoint);
        });

        this.fitToElements();
    }

    // Delete route point by id
    public deleteRoutePoint(routePointId: string) {
        // Check if marker exist
        if (this.markers[routePointId]) {
            // Remove from map
            this.markers[routePointId].remove();
            // Remove from marcadores object
            delete this.markers[routePointId];
        }
    }

    // Delete route polyline
    public deleteRoutePolyline() {
        //Delete route if exist
        if (this.routePolyline != null) {
            this.map.removeLayer(this.routePolyline);
        }
        //Delete paths if exist
        if (this.paths.length > 0) {
            this.paths.forEach((path) => {
                this.map.removeLayer(path);
            });
        }
    }

    // Center map to fit route points and polyline
    private fitToElements() {
        if (Object.keys(this.markers).length > 1) {
            var groupElements: L.Layer[] = [];
            Object.values(this.markers).forEach((marker) => {
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

        //Show route info on click
        this.routePolyline.on("click", () => {
            this.emit("showRouteInfo");
        });
    }

    //Enable route point input
    public useMapPointInput(
        callback: (clickedPoint: [number, number]) => void
    ) {
        const clickHandler = (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            callback([lat, lng]);
            this.map.off("click", clickHandler);
        };

        this.map.on("click", clickHandler);
    }

    //Map center
    public getMapCenter(): [number, number] {
        var center: [number, number] = [
            this.map.getCenter().lng,
            this.map.getCenter().lat,
        ]; //focus in center map
        return center;
    }

    //Popup with route info
    public showRouteInfo(
        distance: string,
        duration: string,
        routeOrder: string
    ) {
        const mapBounds = this.map.getBounds().pad(-0.2);
        var latlng = [
            mapBounds.getNorth(),
            (mapBounds.getWest() + mapBounds.getEast()) / 2,
        ];
        //if (routeOrder)
        var popup = L.popup(latlng, {
            content: `<h5>Ruta: ${routeOrder}</h5><h5>Temps: ${duration}</h5><h5>Distancia: ${distance}</h5>`,
        }).openOn(this.map);
    }

    //Path from stopPoint selected to effective waypoint on route
    public showRoutePath(
        waypoints: [number, number][],
        stoppoints: [number, number][]
    ): void {
        let pairedPoints: [[number, number], [number, number]][] = [];
        for (let i = 0; i < waypoints.length; i++) {
            pairedPoints.push([waypoints[i], stoppoints[i]]);
        }

        pairedPoints.forEach((pair) => {
            const startPath = L.polyline(
                [
                    [pair[0][1], pair[0][0]],
                    [pair[1][1], pair[1][0]],
                ],
                {
                    color: "grey",
                    weight: 5,
                    dashArray: "10, 10",
                }
            ).addTo(this.map);
            this.paths.push(startPath);
        });
    }
}
