

export interface MarkerPoint {
    pointId: string,
    pointType: string,
    point: GeocodedPoint
}

export interface GeocodedPoint {
    textAddress: string;
    coordinates: [number, number]; //long, lat
    addressType: string;
}

export interface RouteLine {
    coordinates: [number, number][];
    type: string;
}

export interface RoutingService {
    getGeometry(): RouteLine;
    getDuration(): string;
    getDistance(): string;
    getRouteOrder(): string;
}

export interface GeocodingService {
    forwardGeocoding(textAddress: string, focus: [number, number] | null): Promise<GeocodedPoint[]>;
    reverseGeocoding(coords: [number, number]): Promise<GeocodedPoint[]>;
    autocomplete(text: string, focus: [number, number] | null): Promise<GeocodedPoint[]>;
}