export interface MarkerPoint {
    pointId: string;
    pointType: string;
    point: GeocodedPoint;
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
