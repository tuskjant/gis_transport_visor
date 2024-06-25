import axios from 'axios';
/**
 * Classe per obtenir a partir d’una entrada de text una llista de resultats candidats a adreces
 * mitjançant una crida a l’API de l’ICGC.
 */

export interface geocodedPoint {
    textAddress: string;
    coordinates: [number, number]; //long, lat
    addressType: string;
}

export class Geocoder {
    readonly BASE_URL: string = "https://eines.icgc.cat";
    readonly FWD_URL: string = "/geocodificador/cerca";
    readonly RVS_URL: string = "/geocodificador/invers";
    readonly ACP_URL: string = "/geocodificador/autocompletar";
    readonly layers: string = "address,topo1,topo2";
    readonly size: string = "1";
    readonly autocompleteSize: string = "5";


    //Forward geocoding
    public async forwardGeocoding(textAddress: string, focus:[number, number] | null): Promise<geocodedPoint[]> {
        if (textAddress === null || textAddress.length < 3) {
            return;
        }
        var urlQuery: string = `text=${encodeURIComponent(textAddress)}&layers=${this.layers}&size=${this.size}`;
        if (focus !== null) {
            urlQuery += `&focus.point.lat=${focus[1]}&focus.point.lon=${focus[0]}`; 
        }
        const url: string = this.BASE_URL + this.FWD_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            return this.getGeocodedPoint(response.data);
        } catch (error) {
            console.error(error);
            const errorPoint = [{ textAddress: "Sense adreça", coordinates: [0, 0] as [number, number], addressType: "error" }];
            return errorPoint;
        }
    }

    //Reverse geocoding
    public async reverseGeocoding(coords: [number, number]): Promise<geocodedPoint[]> {
        const urlQuery: string = `lat=${coords[1]}&lon=${coords[0]}&layers=${this.layers}&size=${this.size}`;
        const url: string = this.BASE_URL + this.RVS_URL + '?' + urlQuery;
        try {
            const response = await axios.get(url);
            return this.getGeocodedPoint(response.data);
        } catch (error) {
            console.error(error);
            const errorPoint = [{ textAddress: "Sense adreça", coordinates: [0, 0] as [number, number], addressType: "error" }];
            return errorPoint;
        }
    }

    //Autocomplete forward geocoding
    public async autocomplete(text: string, focus: [number, number] | null): Promise<geocodedPoint[]> {
        var urlQuery: string = `text=${encodeURIComponent(text)}&layers=${this.layers}&size=${this.autocompleteSize}`;
        if (focus !== null) {
            urlQuery += `&focus.point.lat=${focus[1]}&focus.point.lon=${focus[0]}`;
        }

        const url: string = this.BASE_URL + this.FWD_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            return this.getGeocodedPoint(response.data);
        } catch (error) {
            console.error(error);
            const errorPoint = [{ textAddress: "Sense adreça", coordinates: [0, 0] as [number, number], addressType: "error" }];
            return errorPoint;
        }
    }


    // Gets geocoded point from response data of ICGC API for forward and reverse geocoding
    private getGeocodedPoint(data: Record<string, any>): geocodedPoint[] {
        var points: geocodedPoint[] = [];
        data.features.forEach((feature: Record<string, any>) => {
            let point: geocodedPoint = {
                textAddress: feature.properties.etiqueta,
                coordinates: feature.geometry.coordinates,
                addressType: feature.properties.layer
            };
            points.push(point);
        });
        return points;
    }

}
