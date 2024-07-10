import axios from 'axios';
import { formatDistance, formatDuration } from './routedata';
import { RoutingService, MarkerPoint } from './interfaces';


/**
 * Class for route calculation between two points using the OSRM API https://project-osrm.org/
 * Prepared to use on localhost:5000 (https://github.com/Project-OSRM/osrm-backend)
 * API route service
 */
export class Routing implements RoutingService{
    private BASE_URL: string = "http://127.0.0.1:5000/";
    //private BASE_URL: string = "http://router.project-osrm.org/";
    private ROUTE_URL_2P: string = "route/v1/driving/";
    private ROUTE_URL_3P: string = "trip/v1/driving/";
    private APIsource: string = 'first'; //first point is always starting point
    private APIdestination: string = 'last';
    private APIroundtrip: string = 'false';

    private startPoint: MarkerPoint; //start point to calculate route (long, lat)
    private finalPoint: MarkerPoint; // end point to calculate route (long, lat)
    private stopPoints: MarkerPoint[]; //stop middle points (TSP) 
    
    private duration: number = 0;
    private distance: number = 0;
    private geometry: Record<string, any> | null = null;
    private routeOrder: number[] = []; // order of route, first point is always starting point

    private waypoints: [number, number][] = []; // effective waypoint (on route line) (long, lat)



    constructor(startPoint: MarkerPoint, finalPoint: MarkerPoint, stopPoints: MarkerPoint[]) {
        this.startPoint = startPoint;
        this.finalPoint = finalPoint;
        this.stopPoints = stopPoints;
    }

    // Get route data using the api route service for 2 points
    public async getRoute2P(): Promise<void> {
        const coordStart = this.startPoint.point.coordinates;
        const coordStop = this.finalPoint.point.coordinates;
        const url_query: string = `${coordStart[0]},${coordStart[1]};${coordStop[0]},${coordStop[1]}?geometries=geojson`;
        const url: string = this.BASE_URL + this.ROUTE_URL_2P + url_query;
        try {
            const response = await axios.get(url);
            this.processRoutingData2P(response.data);
        } catch (error) {
            throw new Error("Error accessing route data.");
        }
    }

    // Get route data using the api trip service for more than 2 points
    public async getRoute3P(): Promise<void> {  
        if (this.stopPoints) {
            var routeString = `${this.startPoint.point.coordinates[0]},${this.startPoint.point.coordinates[1]};`
            routeString += this.stopPoints.map((point) => {
                return `${point.point.coordinates[0]},${point.point.coordinates[1]}`;
            }).join(';');
            routeString += `;${this.finalPoint.point.coordinates[0]},${this.finalPoint.point.coordinates[1]}`;

            const url_query: string = `${routeString}?roundtrip=${this.APIroundtrip}&source=${this.APIsource}&destination=${this.APIdestination}&geometries=geojson`;
            const url: string = this.BASE_URL + this.ROUTE_URL_3P + url_query;

            try {
                const response = await axios.get(url);
                this.processRoutingData3P(response.data);
            } catch (error) {
                throw new Error("Error accessing trip data.");
            }
        }    
    }

    // Extract the route information from data
    private processRoutingData2P(data: any): void {
        try {
            this.duration = data.routes[0].duration;
            this.distance = data.routes[0].distance;
            this.geometry = data.routes[0].geometry;
            data.waypoints.forEach((element: { location: any; }) => {
                this.waypoints.push(element.location);
            });
            this.routeOrder = [0, 1]; // allways i-f 
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    // Extract the route information from data
    private processRoutingData3P(data: any): void {
        try {
            this.duration = data.trips[0].duration;
            this.distance = data.trips[0].distance;
            this.geometry = data.trips[0].geometry;
            for (const element of data.waypoints) {
                this.routeOrder.push(element.waypoint_index);
            };
            data.waypoints.forEach((element: { location: any; }) => {
                this.waypoints.push(element.location);
            });

        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    getDuration(): string {
        return formatDuration(this.duration);
    }

    getDistance(): string {
        return formatDistance(this.distance);
    }

    getGeometry(): any {
        return this.geometry;
    }

    getWayPoints(): [number, number][] {
        return this.waypoints;
    }

    getRouteOrder(): string {
        var allPoints: MarkerPoint[] = [];
        allPoints.push(this.startPoint);
        allPoints = allPoints.concat(this.stopPoints);
        allPoints.push(this.finalPoint);

        var routeOrderStr: string = '';
        var position: number;
        for (let i = 0; i < allPoints.length - 1; i++){
            position = this.routeOrder[i];
            routeOrderStr += `${allPoints[position].pointId} ⇨ `;
        }
        routeOrderStr += allPoints[allPoints.length - 1].pointId;
        return routeOrderStr;
    }
}