import axios from 'axios';
import { formatDistance, formatDuration } from './routedata';


/**
 * Class for route calculation between two points using the OSRM API https://project-osrm.org/
 * Prepared to use on localhost:5000 (https://github.com/Project-OSRM/osrm-backend)
 * API route service
 */
export class Routing {
    private BASE_URL: string = "http://127.0.0.1:5000/";
    private ROUTE_URL: string = "route/v1/driving/";
    private start: [number, number]; //start point to calculate route (long, lat)
    private stop: [number, number]; // end point to calculate route (long, lat)
    private duration: number = 0;
    private distance: number = 0;
    private geometry: Record<string, any> | null = null;
    private waypointStart: [number, number] =[0,0]; // effective starting point (on route line) (long, lat)
    private waypointEnd: [number, number] = [0, 0]; // effective ending point (on route line) (long, lat)

    /**
     * Creates an instance of Routing
     * @param coord_start coordinates (long, lat) of start point to calculate the route
     * @param coord_stop coordinates (long, lat) of end point to calculate the route
     */
    constructor(coord_start: [number, number], coord_stop: [number, number]) {
        this.start = coord_start;
        this.stop = coord_stop;
    }

    // Get route data using the api route service
    async getRoute(): Promise<void> {
        const url_query: string = `${this.start[0]},${this.start[1]};${this.stop[0]},${this.stop[1]}?geometries=geojson`;
        const url: string = this.BASE_URL + this.ROUTE_URL + url_query;
        try {
            const response = await axios.get(url);
            this.processRoutingData(response.data);
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    // Extract the route information from data
    private processRoutingData(data: any): void {
        try {
            console.log(data);
            this.duration = data.routes[0].duration;
            this.distance = data.routes[0].distance;
            this.geometry = data.routes[0].geometry;
            this.waypointStart = data.waypoints[0].location;
            this.waypointEnd = data.waypoints[1].location;

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

    getStart(): [number, number] {
        return this.waypointStart;
    }

    getStop(): [number, number] {
        return this.waypointEnd;
    }
}
