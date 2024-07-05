

export interface markerPoint {
    pointId: string,
    pointType: string,
    point: geocodedPoint
}

export interface geocodedPoint {
    textAddress: string;
    coordinates: [number, number]; //long, lat
    addressType: string;
}