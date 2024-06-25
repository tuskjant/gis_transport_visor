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

export class GeocoderComponent implements RoutePointMapInputListener{
    private id: string;
    private container: HTMLElement;
    private input: HTMLInputElement;
    private dropdown: HTMLElement;
    private timeoutId: number | undefined;
    readonly timeout:number = 3000; 

    constructor(selectorId: string, containerId: string) {
        this.id = selectorId;
        this.container = document.getElementById(containerId) as HTMLElement;
        
        
        this.input = document.createElement('input');
        this.dropdown = document.createElement('div');
        this.dropdown.classList.add('dropdown');

        this.container.appendChild(this.input);
        this.container.appendChild(this.dropdown);

        this.input.addEventListener('input', this.onInputChange.bind(this));
    }

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

    private updateDropdown(options: geocodedPoint[]): void {
        this.clearDropdown();
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.textContent = option.textAddress;
            optionElement.classList.add('dropdown-option', `tipus_${option.addressType}`);
            optionElement.addEventListener('click', () => {
                this.onOptionSelected(option);
            });
            this.dropdown.appendChild(optionElement);
        });
    }

    private onOptionSelected(option: geocodedPoint): void {
        this.input.value = option.textAddress;
        this.clearDropdown();
    }

    private clearDropdown(): void {
        while (this.dropdown.firstChild) {
            this.dropdown.removeChild(this.dropdown.firstChild);
        }
    }

    private async fetchOptions(query: string, focus: [number, number] | null = null): Promise<geocodedPoint[]> {
        const geocoder = new Geocoder();
        const result = await geocoder.autocomplete(query, null);
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