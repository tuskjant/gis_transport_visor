// Class Geocoder for forward and reverse geocoding

import axios from 'axios';

export class Geocoder {
    private BASE_URL: string = "https://eines.icgc.cat";
    private FWD_URL: string = "/geocodificador/cerca";
    private RVS_URL: string = "/geocodificador/invers";
    private text: string | null;
    private coord: [number, number] | null;
    private focus: [number, number];
    private layers: string = "address,topo1,topo2";
    private size: string = "1";

    constructor(text: string | null = null, coord: [number, number] | null = null, focus: [number, number] = [1.8566894531250002, 41.39836479]) {
        if (text === null && coord === null) {
            throw new Error("Missed parameters for geocoding");
        }
        this.text = text;
        this.coord = coord;
        this.focus = focus;
    }

    public setFocus(focus: [number, number]): void {
        this.focus = focus;
    }

    public getText(): string | null {
        return this.text;
    }

    public getCoord(): [number, number] | null {
        return this.coord;
    }

    public async forwardGeocoding(): Promise<boolean | void> {
        if (this.text === null || this.text.length < 3) {
            return false;
        }
        const urlQuery: string = `text=${encodeURIComponent(this.text)}&focus.point.lat=${this.focus[1]}&focus.point.lon=${this.focus[0]}&layers=${this.layers}&size=${this.size}`;
        const url: string = this.BASE_URL + this.FWD_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            this.extractText(response.data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async reverseGeocoding(): Promise<boolean | void> {
        if (this.coord === null) {
            return false;
        }
        const urlQuery: string = `lat=${this.coord[1]}&lon=${this.coord[0]}&layers=${this.layers}&size=${this.size}`;
        const url: string = this.BASE_URL + this.RVS_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            this.extractCoord(response.data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    private extractCoord(data: any): void {
        let dist: number | null = null;
        let coords: [number, number] | null = null;
        let text: string | null = null;

        try {
            dist = data.features[0].properties.distancia;
            data.features.forEach((feature: any) => {
                if (feature.properties.distancia < dist) {
                    dist = feature.properties.distancia;
                    text = feature.properties.etiqueta;
                    coords = feature.geometry.coordinates;
                }
            });
        } catch (error) {
            console.error("Error accessing geocoding data.");
            throw new Error("Error accessing geocoding data.");
        }

        this.coord = coords;
        this.text = text;
    }

    private extractText(data: any): void {
        console.log("Extracting text")
        try {
            this.coord = data.features[0].geometry.coordinates;
            this.text = data.features[0].properties.etiqueta;
        } catch (error) {
            console.error("Error accessing geocoding data.");
            throw new Error("Error accessing geocoding data.");
        }
        console.log(this.coord)
    }
}






