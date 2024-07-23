import { MarkerPoint, RouteLine } from "../Domain/interfaces";

export interface RoutingData {
    duration: string,  //string with information of the trip duration
    distance: string,  //string with information of the trip distance
    geometry: RouteLine, //geometry of the route
    wayPoints: [number, number][], // list of nearest points on the path (effective start, stop and final point on the route)
    routeOrder: string, //string with information of the route order (start point - first point - second point ... -end point)
}

export interface RoutingService {
    getRoute2P(startPoint: MarkerPoint, finalPoint: MarkerPoint): Promise<RoutingData>,
    getRoute3P(startPoint: MarkerPoint, stopPoints: MarkerPoint[], finalPoint: MarkerPoint): Promise<RoutingData>,
}
