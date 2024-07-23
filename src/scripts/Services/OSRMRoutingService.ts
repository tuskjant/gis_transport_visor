import axios from "axios";
import { formatDistance, formatDuration } from "../Utils/routeDataFormatter";
import { MarkerPoint } from "../Domain/interfaces";
import { RoutingService, RoutingData } from "./RoutingService";

/**
 * Class for route calculation between two points using the OSRM API https://project-osrm.org/
 * Prepared to use on localhost:5000 (https://github.com/Project-OSRM/osrm-backend)
 * API route service
 */
export class Routing implements RoutingService {
    //private BASE_URL: string = "http://127.0.0.1:5000/";
    private BASE_URL: string = "http://router.project-osrm.org/";
    private ROUTE_URL_2P: string = "route/v1/driving/";
    private ROUTE_URL_3P: string = "trip/v1/driving/";
    private APIsource: string = "first"; //first point is always starting point
    private APIdestination: string = "last";
    private APIroundtrip: string = "false";
    private APIoverview: string = "full";
    
    // Get route data using the api route service for 2 points
    public async getRoute2P(startPoint: MarkerPoint, finalPoint: MarkerPoint): Promise<RoutingData> {
        const coordStart = startPoint.point.coordinates;
        const coordFinal = finalPoint.point.coordinates;
        const url_query: string = `${coordStart[0]},${coordStart[1]};${coordFinal[0]},${coordFinal[1]}?geometries=geojson&overview=${this.APIoverview}`;
        const url: string = this.BASE_URL + this.ROUTE_URL_2P + url_query;
        try {
            const response = await axios.get(url);
            return this.processRoutingData2P(response.data, startPoint, [], finalPoint);         
        } catch (error) {
            throw new Error("Error accessing route data.");
        }
    }

    // Get route data using the api trip service for more than 2 points
    public async getRoute3P(startPoint: MarkerPoint, stopPoints: MarkerPoint[], finalPoint: MarkerPoint): Promise<RoutingData> {
        var routeString = `${startPoint.point.coordinates[0]},${startPoint.point.coordinates[1]};`;
        routeString += stopPoints
            .map((point) => {
                return `${point.point.coordinates[0]},${point.point.coordinates[1]}`;
            })
            .join(";");
        routeString += `;${finalPoint.point.coordinates[0]},${finalPoint.point.coordinates[1]}`;

        const url_query: string = `${routeString}?roundtrip=${this.APIroundtrip}&source=${this.APIsource}&destination=${this.APIdestination}&geometries=geojson&overview=${this.APIoverview}`;
        const url: string = this.BASE_URL + this.ROUTE_URL_3P + url_query;

        try {
            const response = await axios.get(url);
            return this.processRoutingData3P(response.data, startPoint, stopPoints, finalPoint);

        } catch (error) {
            throw new Error("Error accessing trip data.");
        }
        
    }

    // Extract the route information from data
    private processRoutingData2P(data: any, startPoint: MarkerPoint, stopPoints: MarkerPoint[], finalPoint: MarkerPoint): RoutingData {
        try {       
            var waypoints: [number, number][] = [];
            data.waypoints.forEach((element: { location: any }) => {
                waypoints.push(element.location);
            });
            
            const routingData: RoutingData = {
                duration: formatDuration(data.routes[0].duration),
                distance: formatDistance(data.routes[0].distance),
                geometry: data.routes[0].geometry,
                wayPoints: waypoints,
                routeOrder: this.getRouteOrder([0, 1], startPoint, stopPoints, finalPoint),
            } 
            return routingData;
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }

    // Extract the route information from data
    private processRoutingData3P(data: any, startPoint: MarkerPoint, stopPoints: MarkerPoint[], finalPoint: MarkerPoint): RoutingData {
        try {
            var routeOrderArray: number[] = [];
            for (const element of data.waypoints) {
                routeOrderArray.push(element.waypoint_index);
            }
            var waypoints: [number, number][] = [];
            data.waypoints.forEach((element: { location: any }) => {
                waypoints.push(element.location);
            });
            const routingData: RoutingData = {
                duration: formatDuration(data.trips[0].duration),
                distance: formatDistance(data.trips[0].distance),
                geometry: data.trips[0].geometry,
                wayPoints: waypoints,
                routeOrder: this.getRouteOrder(routeOrderArray, startPoint, stopPoints, finalPoint),
            } 
            return routingData;
        } catch (error) {
            throw new Error("Error accessing routing data.");
        }
    }


    private getRouteOrder(routeOrderArray: number[], startPoint: MarkerPoint, stopPoints: MarkerPoint[], finalPoint: MarkerPoint): string {
        var allPoints: MarkerPoint[] = [];
        allPoints.push(startPoint);
        allPoints = allPoints.concat(stopPoints);
        allPoints.push(finalPoint);

        var routeOrderStr: string = "";
        var position: number;
        for (let i = 0; i < allPoints.length - 1; i++) {
            position = routeOrderArray[i];
            routeOrderStr += `${allPoints[position].pointId} ⇨ `;
        }
        routeOrderStr += allPoints[allPoints.length - 1].pointId;
        return routeOrderStr;
    }
}
