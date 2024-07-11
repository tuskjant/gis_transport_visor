import { GeocodedPoint } from "../Domain/interfaces";

export interface GeocodingService {
    forwardGeocoding(textAddress: string, focus: [number, number] | null): Promise<GeocodedPoint[]>;
    reverseGeocoding(coords: [number, number]): Promise<GeocodedPoint[]>;
    autocomplete(text: string, focus: [number, number] | null): Promise<GeocodedPoint[]>;
}