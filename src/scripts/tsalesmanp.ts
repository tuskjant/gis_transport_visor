import axios from 'axios';
import { formatDistance, formatDuration } from './routedata';

/**
 * Class for route calculation between more than two points using the OSRM API https://project-osrm.org/
 * Prepared to use on localhost:5000 (https://github.com/Project-OSRM/osrm-backend)
 * API trip service: it solves the Traveling Salesman Problem (TSP) considering
 * roundtrip from firstpoint
 */
export class Tsalesmanp {
    private BASE_URL: string = "http://127.0.0.1:5000/";
    //private BASE_URL: string = "http://router.project-osrm.org/";
    private ROUTE_URL: string = "trip/v1/driving/";
    private routePoints: [number, number][] = []; //route points, first point is starting point (long, lat)
    private source: string = 'first'; //first point is always starting point
    private destination: string = 'any';
    private roundtrip: string = 'true';
    private duration: number = 0;
    private distance: number = 0;
    private geometry: any;
    private routeOrder: number[] = []; // order of route, first point is always starting point

    /**
     * Creates an instance of Tsalesmanp
     * @param points array of point coordinattes to travel, first point is always start point  (long, lat)
     */
    constructor(points: [number, number][]) {
        this.routePoints = points;
    }

    // Get route data using the api trip service
    async getRoute(): Promise<void> {
        const routeString = this.routePoints.map((point) => {
            return `${point[0]},${point[1]}`;
        }).join(';');

        const url_query: string = `${routeString}?roundtrip=${this.roundtrip}&source=${this.source}&destination=${this.destination}&geometries=geojson`;
        const url: string = this.BASE_URL + this.ROUTE_URL + url_query;

        try {
            const response = await axios.get(url);
            this.processRoutingData(response.data);
        } catch (error) {
            throw new Error("Error accessing trip data.");
        }     
    }

    // Extract the route information from data
    private processRoutingData(data: any): void {
        try {
            this.duration = data.trips[0].duration;
            this.distance = data.trips[0].distance;
            this.geometry = data.trips[0].geometry;
            for (const element of data.waypoints) {
              this.routeOrder.push(element.waypoint_index);
            }

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

    getRouteOrder(): string {
        var routeOrder: string = this.routeOrder.join(" ⇨ ");
        routeOrder = routeOrder.replace('0', 'i');
        routeOrder = routeOrder + " ⇨ i";
        return routeOrder;
    }




}