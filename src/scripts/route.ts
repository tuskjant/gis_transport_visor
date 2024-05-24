import axios from 'axios';
import { formatDistance, formatDuration } from './routedata';

//Route calculation between two points using the OSRM API on localhost
export class Routing {
    private BASE_URL: string = "http://127.0.0.1:5000/";
    private ROUTE_URL: string = "route/v1/driving/";
    private start: [number, number];
    private stop: [number, number];
    private duration: number = 0;
    private distance: number = 0;
    private geometry: L.GeoJSON | null = null;

    constructor(coord_start: [number, number], coord_stop: [number, number]) {
        this.start = coord_start;
        this.stop = coord_stop;
    }

    async getRoute(): Promise<void> {
        const url_query: string = `${this.start[0]},${this.start[1]};${this.stop[0]},${this.stop[1]}?geometries=geojson`;
        const url: string = this.BASE_URL + this.ROUTE_URL + url_query;
        console.log("getting the route", this.start, this.stop)
        try {
            const response = await axios.get(url);
            this.processRoutingData(response.data);
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    private processRoutingData(data: any): void {
        try {
            this.duration = data.routes[0].duration;
            this.distance = data.routes[0].distance;
            this.geometry = data.routes[0].geometry;
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
        console.log("returning geometry", this.geometry)
        return this.geometry;
    }
}
