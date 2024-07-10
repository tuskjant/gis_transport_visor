import { GeocoderComponent } from "./GeocoderComponent";
import { LeafletRouteController } from "./LeafletRouteController";
import { MarkerPoint} from "./interfaces";
import { Routing } from "./RouteService";



/**
 * Panell de rutes:
 * - Crearà vàries instàncies de GeocoderComponent
 * - Botó de calcular ruta
 */

// rep un div amb panell lateral


export class RoutePanel {
    private idContainer: string;
    private map: L.Map;
    private controller: LeafletRouteController;
    private inputs: { [id_input: string]: GeocoderComponent } = {};
    private routePoints: { [pointId: string]: MarkerPoint } = {};



    constructor(idContainer: string, map: L.Map) {
        this.idContainer = idContainer;
        this.map = map;
        this.controller = new LeafletRouteController(this.map);
        this.controller.on('markerDblclick', this.onMarkerDblClick.bind(this));
        this.controller.on('markerMove', this.onMarkerMove.bind(this));
        this.controller.on('updatedRoutePoint', this.onUpdatedRoutePoint.bind(this));
        this.controller.on('showRouteInfo', this.onRouteClick.bind(this));


        const sidebarContainer = document.getElementById(idContainer);
        if (sidebarContainer) {
            this.setupUI(sidebarContainer);
        }

    }

    private setupUI(sidebarContainer: HTMLElement): void {

        // Button to calculate routes
        /*
        const buttonCalculateRoute = document.createElement('button');
        buttonCalculateRoute.className = 'button-calculate-route';
        buttonCalculateRoute.innerHTML = '<p class="fa">Route</p>';
        buttonCalculateRoute.title = "Calculate route";
        buttonCalculateRoute.style.cursor = 'pointer';
        
        sidebarContainer.appendChild(buttonCalculateRoute);
        */

        const input1 = new GeocoderComponent("i", this.idContainer, "inici...", this.map);
        input1.getElementInput().addEventListener('addressSelected', this.onAddressReturned.bind(this));
        this.inputs["i"] = input1;
        const input2 = new GeocoderComponent("f", this.idContainer, "final...", this.map);
        input2.getElementInput().addEventListener('addressSelected', this.onAddressReturned.bind(this));
        this.inputs["f"] = input2;

        // Counter for inputs (case TSP)
        let next_input: number = 1;

        // Button to add more inputs (case TSP)
        const buttonAddInput = document.createElement('button');
        buttonAddInput.id = 'addInput';
        buttonAddInput.innerHTML = '<p class="fa">&#10010;</p>';
        buttonAddInput.title = "Travel Salesman Problem";


        // Checkbox to set destination = origin
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        const checkOriginDest = document.createElement('input');
        checkOriginDest.type = 'checkbox';
        checkOriginDest.id = 'originDestCheckBox';

        const label = document.createElement('label');
        label.htmlFor = 'originDestCheckBox';
        label.innerText = 'Inici igual a final. Ruta circular'

        checkboxContainer.appendChild(checkOriginDest);
        checkboxContainer.appendChild(label);


        // Add more inputs button eventlistener
        buttonAddInput.addEventListener('click', () => {
            const newInput = new GeocoderComponent(`p${next_input}`, this.idContainer, `parada - ${next_input}...`, this.map);
            newInput.getElementInput().addEventListener('addressSelected', this.onAddressReturned.bind(this));
            this.inputs[`p${next_input}`] = newInput;
            next_input++;
        });

        // Checkbox action
        checkOriginDest.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target && target.checked) {
                //checked origin = destination
                var option1 = input1.getOption();
                if (option1 != null) {
                    input2.onOptionSelected(option1);
                    input2.disableComponent();
                } else {
                    checkOriginDest.checked = false;
                }
            } else if (target && !target.checked) {
                input2.enableComponent();
            }
        });


        sidebarContainer.appendChild(checkboxContainer);
        sidebarContainer.appendChild(buttonAddInput);
    }

    // When an address is selected
    private onAddressReturned(event: Event): void {
        if (event instanceof CustomEvent) {
            const pointId = event.detail.pointId;
            var pointType: string = "";
            switch (pointId) {
                case 'i':
                    pointType = "inici";
                    break;
                case 'f':
                    pointType = "final";
                    break;
                default:
                    pointType = "punt de pas";
            }
            var markerPoint = {
                pointId: event.detail.pointId,
                pointType: pointType,
                point: event.detail.point
            }
            this.controller.updateRoutePoint(markerPoint);

        }    
    }

    // When double click on a marker delete marker and clear input
    private onMarkerDblClick(routePoint: MarkerPoint): void {
        this.inputs[routePoint.pointId].clearInput();
        delete this.routePoints[routePoint.pointId];
        this.calculateRoute();
    }

    // When moving a marker update input text with using new coordinates
    private onMarkerMove(routePoint: MarkerPoint): void {
        // Point with new Coordinates requires new reverse geocoding
        this.inputs[routePoint.pointId].updateInput(routePoint);
        this.calculateRoute();
    }

    // When deleting, adding or moving a marker point
    private onUpdatedRoutePoint(newRoutePoint: MarkerPoint): void {
        //update route points list  
        if (newRoutePoint.pointId in this.routePoints) {
            delete this.routePoints[newRoutePoint.pointId];
        }
        this.routePoints[newRoutePoint.pointId] = newRoutePoint;
        this.calculateRoute();       
    }

    // When clicking on route polyline show route info
    private onRouteClick() {
        this.calculateRoute();
    }

    //Calculate route for marker points, get geometry -> draw route
    private async calculateRoute(): Promise<void>{
        //Get coordinates of points
        var stopPoints: MarkerPoint[] = [];
        var startPoint: MarkerPoint | undefined;
        var finalPoint: MarkerPoint | undefined;
        Object.values(this.routePoints).forEach(markerPoint => {
            if (markerPoint.pointType == 'inici') {
                startPoint = markerPoint;
            } else if (markerPoint.pointType== 'final') {
                finalPoint = markerPoint
            } else {
                stopPoints.push(markerPoint);
            }
        })
        //Get the route geometry using Routing class
        if (startPoint && finalPoint) {
            const routing = new Routing(startPoint, finalPoint, stopPoints);
            if (stopPoints.length > 0) {
                await routing.getRoute3P();
            } else {
                await routing.getRoute2P();
            }
            
            const routeGeometry = routing.getGeometry();
            this.controller.updateRoute(routeGeometry);

            const distance = routing.getDistance();
            const duration = routing.getDuration();
            const routeOrder = routing.getRouteOrder();
           
            this.controller.showRouteInfo(distance, duration, routeOrder);

            // Waypoints path
            const waypoints = routing.getWayPoints();
            var allpoints: [number, number][] = [];
            allpoints.push(startPoint.point.coordinates);
            stopPoints.forEach(element => {
                allpoints.push(element.point.coordinates);
            });
            allpoints.push(finalPoint.point.coordinates);
            this.controller.showRoutePath(waypoints, allpoints);
        }   

    }






   


}
