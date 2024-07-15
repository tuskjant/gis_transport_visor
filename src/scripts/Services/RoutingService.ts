import { RouteLine } from "../Domain/interfaces";

export interface RoutingService {
    getGeometry(): RouteLine;
    getDuration(): string;
    getDistance(): string;
    getRouteOrder(): string;
}
