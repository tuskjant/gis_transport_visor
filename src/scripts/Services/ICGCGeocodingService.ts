import axios from 'axios';
import { GeocodedPoint } from '../Domain/interfaces';
import { GeocodingService } from './GeocodingService';

/** 
 *  Class Geocoder for forward, reverse and autocomplete geocoding
* Utilize the geocoder from ICGC: https://eines.icgc.cat
*/



export class ICGCGeocodingService implements GeocodingService{
    readonly BASE_URL: string = "https://eines.icgc.cat";
    readonly FWD_URL: string = "/geocodificador/cerca";
    readonly RVS_URL: string = "/geocodificador/invers";
    readonly ACP_URL: string = "/geocodificador/autocompletar";
    readonly layers: string = "address,topo1,topo2";
    readonly layerReverse: string = "address";
    readonly size: string = "1";
    readonly autocompleteSize: string = "5";
    readonly errorPoint: GeocodedPoint[] = [{ textAddress: "No s'ha localitza cap adreça", coordinates: [0, 0] as [number, number], addressType: "error" }];


    //Forward geocoding
    public async forwardGeocoding(textAddress: string, focus: [number, number] | null): Promise<GeocodedPoint[]> {
        if (textAddress === null || textAddress.length < 3) {
            return this.errorPoint;
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
            return this.errorPoint;
        }
    }

    //Reverse geocoding
    public async reverseGeocoding(coords: [number, number]): Promise<GeocodedPoint[]> {
        const urlQuery: string = `lat=${coords[1]}&lon=${coords[0]}&layers=${this.layerReverse}&size=${this.size}`;
        const url: string = this.BASE_URL + this.RVS_URL + '?' + urlQuery;
        try {
            const response = await axios.get(url);
            return this.getGeocodedPoint(response.data);
        } catch (error) {
            console.error(error);
            return this.errorPoint;
        }
    }

    //Autocomplete forward geocoding
    public async autocomplete(text: string, focus: [number, number] | null): Promise<GeocodedPoint[]> {
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
            return this.errorPoint;
        }
    }


    // Gets geocoded point from response data of ICGC API for forward and reverse geocoding
    private getGeocodedPoint(data: Record<string, any>): GeocodedPoint[] {
        var points: GeocodedPoint[] = [];
        data.features.forEach((feature: Record<string, any>) => {
            let point: GeocodedPoint = {
                textAddress: feature.properties.etiqueta,
                coordinates: feature.geometry.coordinates,
                addressType: feature.properties.layer
            };
            points.push(point);
        });
        return points;
    }

}
