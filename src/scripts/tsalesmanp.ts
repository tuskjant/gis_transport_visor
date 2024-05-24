import axios from 'axios';
import { formatDistance, formatDuration } from './routedata';

export class Tsalesmanp {
    private BASE_URL: string = "http://127.0.0.1:5000/";
    private ROUTE_URL: string = "trip/v1/driving/";
    private routePoints: [number, number][] = [];
    private source: string = 'first';
    private destination: string = 'any';
    private roundtrip: string = 'true';
    private duration: number = 0;
    private distance: number = 0;
    private geometry: any;

    constructor(points: [number, number][]) {
        this.routePoints = points;
    }

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

    private processRoutingData(data: any): void {
        try {
            this.duration = data.trips[0].duration;
            this.distance = data.trips[0].distance;
            this.geometry = data.trips[0].geometry;
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


}