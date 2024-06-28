import { GeocoderComponent } from "./_GeocoderComponent";
import L from 'leaflet';
import { LeafletRouteController } from "./_LeafletRouteController";



/**
 * Panell de rutes:
 * - Crearà vàries instàncies de GeocoderComponent
 * - Botó de calcular ruta
 */

// rep un div amb panell lateral


export class RoutePanel {
    private idContainer: string;
    private map: L.map;
    private controller: LeafletRouteController;



    constructor(idContainer: string, map: L.map) {
        this.idContainer = idContainer;
        this.map = map;
        this.controller = new LeafletRouteController(this.map);

        const sidebarContainer = document.getElementById(idContainer);
        if (sidebarContainer) {
            const input1 = new GeocoderComponent("i", this.idContainer, "inici...", this.map);
            input1.getElement().addEventListener('addressSelected', this.addressReturned.bind(this));
            const input2 = new GeocoderComponent("1", this.idContainer, "final...", this.map);
            input2.getElement().addEventListener('addressSelected', this.addressReturned.bind(this));

            // Counter for inputs (case TSP)
            let next_input: number = 2;

            // Button to add more inputs (case TSP)
            const button = document.createElement('button');
            button.className = 'leaflet-bar leaflet-control';
            button.id = 'addInput';
            button.innerHTML = '<p class="fa">🞧</p>';
            button.title = "Travel Salesman Problem";
            button.style.cursor = 'pointer';


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
            button.addEventListener('click', () => {
                const newInput = new GeocoderComponent(`p${next_input}`, this.idContainer, `parada - ${next_input}...`, this.map);
                newInput.getElement().addEventListener('addressSelected', this.addressReturned.bind(this));
                next_input++;
            });

            // Checkbox action
            checkOriginDest.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target && target.checked) {
                    //checked origin = destination
                    var option1 = input1.getOption();
                    if (option1 != null) {
                        input2.setOption(option1);
                    } else {
                        checkOriginDest.checked = false;
                    }
                }
            });

           
            sidebarContainer.appendChild(checkboxContainer);
            sidebarContainer.appendChild(button);

        }

    }

    // When an address is selected
    private addressReturned(event: Event): void {
        if (event instanceof CustomEvent) {
            console.log(event.detail);
            const coordinates = event.detail.point.coordinates;
            this.controller.updateRoutePoint('1', "prova", [coordinates[1], coordinates[0]]);
        }    
    }
}
