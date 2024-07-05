import { GeocoderComponent } from "./_GeocoderComponent";
import { LeafletRouteController } from "./_LeafletRouteController";
import { markerPoint } from "./interfaces";



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



    constructor(idContainer: string, map: L.Map) {
        this.idContainer = idContainer;
        this.map = map;
        this.controller = new LeafletRouteController(this.map);
        this.controller.on('markerDblclick', this.onMarkerDblClick.bind(this));
        this.controller.on('markerMove', this.onMarkerMove.bind(this));


        const sidebarContainer = document.getElementById(idContainer);
        if (sidebarContainer) {
            this.setupUI(sidebarContainer);
        }

    }

    private setupUI(sidebarContainer: HTMLElement): void {

        // Button to calculate routes
        const buttonCalculateRoute = document.createElement('button');
        buttonCalculateRoute.className = 'button-calculate-route';
        buttonCalculateRoute.innerHTML = '<p class="fa">Route</p>';
        buttonCalculateRoute.title = "Calculate route";
        buttonCalculateRoute.style.cursor = 'pointer';

        sidebarContainer.appendChild(buttonCalculateRoute);

        const input1 = new GeocoderComponent("i", this.idContainer, "inici...", this.map);
        input1.getElement().addEventListener('addressSelected', this.onAddressReturned.bind(this));
        this.inputs["i"] = input1;
        const input2 = new GeocoderComponent("f", this.idContainer, "final...", this.map);
        input2.getElement().addEventListener('addressSelected', this.onAddressReturned.bind(this));
        this.inputs["f"] = input2;

        // Counter for inputs (case TSP)
        let next_input: number = 1;

        // Button to add more inputs (case TSP)
        const buttonAddInput = document.createElement('button');
        buttonAddInput.className = 'leaflet-bar leaflet-control';
        buttonAddInput.id = 'addInput';
        buttonAddInput.innerHTML = '<p class="fa">🞧</p>';
        buttonAddInput.title = "Travel Salesman Problem";
        buttonAddInput.style.cursor = 'pointer';


        // Checkbox to set destination = origin
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        const checkOriginDest = document.createElement('input');
        checkOriginDest.type = 'checkbox';
        checkOriginDest.id = 'originDestCheckBox';

        const label = document.createElement('label');
        label.htmlFor = 'originDestCheckBox';
        label.innerText = 'Ruta tancada. Inici igual a final'

        checkboxContainer.appendChild(checkOriginDest);
        checkboxContainer.appendChild(label);


        // Add more inputs button eventlistener
        buttonAddInput.addEventListener('click', () => {
            const newInput = new GeocoderComponent(`p${next_input}`, this.idContainer, `parada - ${next_input}...`, this.map);
            newInput.getElement().addEventListener('addressSelected', this.onAddressReturned.bind(this));
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
                } else {
                    checkOriginDest.checked = false;
                }
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

    // When double click on a marker
    private onMarkerDblClick(routePoint: markerPoint): void {
        console.log(`doubleclick ${routePoint.pointId}`);
        this.inputs[routePoint.pointId].clearInput();
    }

    // When moving a marker
    private onMarkerMove(routePoint: markerPoint): void {
        // Point with new Coordinates requires new reverse geocoding
        this.inputs[routePoint.pointId].updateInput(routePoint);
    }

   
}
