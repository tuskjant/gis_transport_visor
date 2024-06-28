import { geocodedPoint, Geocoder } from './_GeocoderService';

/**
 * S’encarregarà d’agafar l’input de l’usuari i resoldre-ho a una adreça amb unes coordenades.: Selector
 * Botó que permetrà capturar la coordenada fent click sobre el mapa.
 */

interface RoutePointMapInputListener {
    onRoutePointMapInput(): void;
    getRoutePointId(): string;
    getRoutePointType(): string;
}

export interface markerPoint {
    pointId: string,
    point: geocodedPoint
}

export class GeocoderComponent implements RoutePointMapInputListener{
    private id: string;
    private container: HTMLElement;
    private placeholder: string;
    private map: L.map;
    private option: geocodedPoint | null = null;

    private input: HTMLInputElement;
    private dropdown: HTMLElement;
    private timeoutId: number | undefined;
    readonly timeout:number = 3000; 

    constructor(selectorId: string, containerId: string, placeholder: string, map: L.map) {
        this.id = selectorId;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.placeholder = placeholder;
        this.map = map;
        
        const geoComponent = document.createElement('div');
        geoComponent.id = 'geocod-component-container';

        this.input = document.createElement('input');
        this.input.id = `${this.id}_input`
        this.input.className = 'custom-input';
        this.input.placeholder = this.placeholder;
        this.dropdown = document.createElement('div');
        this.dropdown.classList.add('dropdown');

        //Create button
        const button_loc = document.createElement('button');
        button_loc.type = 'button';
        button_loc.className = 'custom-button';
        button_loc.innerHTML = '⌖'
        button_loc.id = `${this.id}_button`;

        this.container.appendChild(geoComponent);
        geoComponent.appendChild(this.input);
        geoComponent.appendChild(this.dropdown);
        geoComponent.appendChild(button_loc);

        this.input.addEventListener('input', this.onInputChange.bind(this));
    }

    getElement(): HTMLInputElement{
        return this.input;
    }

    // When text input change, look for options
    private async onInputChange(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const query = target.value;

        if (query.length < 3) {
            this.clearDropdown();
            return;
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(async () => {
            try {
                const options = await this.fetchOptions(query);
                this.updateDropdown(options);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }, this.timeout);
    }

    // Update dropdown list
    private updateDropdown(options: geocodedPoint[]): void {
        this.clearDropdown();
        options.forEach(option => {
            const optionElement = document.createElement('div');
            var type: string = "";
            switch (option.addressType) {
                case "address":
                    type = "(adreça)-";
                    break;
                case "topo1":
                    type = "(població)-";
                    break;
                case "topo2":
                    type = "(topònim)-";
                    break;
            }
            optionElement.innerHTML = `<span class="type-style">${type} </span><span>${option.textAddress}</span>`
            optionElement.classList.add('dropdown-option', `tipus_${option.addressType}`);
            optionElement.addEventListener('click', () => {
                this.onOptionSelected(option);
            });
            this.dropdown.appendChild(optionElement);
        });
    }

    //When selecting an option, dispatch event containing the option selected
    private onOptionSelected(option: geocodedPoint): void {
        this.input.value = option.textAddress;
        this.option = option;
        this.clearDropdown();
        var markerPoint: markerPoint = {
            pointId: this.id,
            point: option
        };
        const inputEvent = new CustomEvent('addressSelected', {
            detail: markerPoint,
        }) 
        this.input.dispatchEvent(inputEvent);
    }

    //Set an option for GeocoderComponent  (for check option)
    public setOption(option: geocodedPoint): void {
        this.input.value = option.textAddress;
        this.clearDropdown();
        var markerPoint: markerPoint = {
            pointId: this.id,
            point: option
        };
        const inputEvent = new CustomEvent('addressSelected', {
            detail: markerPoint,
        })
        this.input.dispatchEvent(inputEvent);
    }

    //Get the option for GeocoderComponent (for check option)
    public getOption(): geocodedPoint | null{
        return this.option;
    }

    // Clear dropdown list
    private clearDropdown(): void {
        while (this.dropdown.firstChild) {
            this.dropdown.removeChild(this.dropdown.firstChild);
        }
    }

    // Fetch options from geocoder component
    private async fetchOptions(query: string, focus: [number, number] | null = null): Promise<geocodedPoint[]> {
        const geocoder = new Geocoder();
        var center: [number, number] = ([this.map.getCenter().lng, this.map.getCenter().lat]);  //focus in center map
        const result = await geocoder.autocomplete(query, center);
        return result;
    }


    public onRoutePointMapInput = () => {
        
    }

    public getRoutePointId = () => {
        return "hola";
    }

    public getRoutePointType = () => {
        return "hola";
    }

}