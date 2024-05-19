import axios from 'axios';

export class Routing {
    private BASE_URL: string = "http://127.0.0.1:5000/";
    private ROUTE_URL: string = "route/v1/driving/";
    private start: [number, number];
    private stop: [number, number];
    private duration: number = 0;
    private distance: number = 0;
    private geometry: any;

    constructor(coord_start: [number, number], coord_stop: [number, number]) {
        this.start = coord_start;
        this.stop = coord_stop;
    }

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

    private processRoutingData(data: any): void {
        try {
            this.duration = data.routes[0].duration;
            this.distance = data.routes[0].distance;
            this.geometry = data.routes[0].geometry;
            console.log(data.routes[0].distance);
            console.log(this.distance);
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    getDuration(): string {
        let formatDuration: string;
        var minDur = this.duration / 60;
        var hourDur = 0;
        if (minDur < 60) {
            formatDuration = minDur.toFixed(1) + " min."
        } else {
            hourDur = Math.floor(minDur / 60)
            minDur = minDur % 60
            formatDuration = hourDur.toString() + " h " + minDur.toFixed(0) + " min."
        }
        
        return formatDuration;
    }

    getDistance(): string {
        let formatDist: string;
        if (this.distance > 1000) {
            formatDist = (this.distance / 1000).toFixed(2) + " Km.";
        } else {
            formatDist = this.distance.toString() + " m.";
        }
        return formatDist;
    }

    getGeometry(): any {
        return this.geometry;
    }
}
