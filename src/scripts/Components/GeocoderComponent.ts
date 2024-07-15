import { ICGCGeocodingService } from "../Services/ICGCGeocodingService";
import { LeafletRouteController } from "../Controllers/LeafletRouteController";
import { GeocodedPoint, MarkerPoint } from "../Domain/interfaces";
import { EventEmitter } from "../Utils/EventEmitter";

/**
 * Component to get user input and return address with coordinates. Button to add point from map.
 */

export class GeocoderComponent extends EventEmitter {
    private id: string;
    private container: HTMLElement;
    private placeholder: string;
    private map: L.Map;
    private option: GeocodedPoint | null = null;
    private controller: LeafletRouteController;

    private idlabel: HTMLDivElement;
    private input: HTMLInputElement;
    private button_loc: HTMLButtonElement;
    private dropdown: HTMLElement;
    private timeoutId: number | undefined;
    readonly timeout: number = 3000;

    constructor(
        selectorId: string,
        containerId: string,
        placeholder: string,
        map: L.Map
    ) {
        super();
        this.id = selectorId;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.placeholder = placeholder;
        this.map = map;
        this.controller = new LeafletRouteController(this.map);

        const geoComponent = document.createElement("div");
        geoComponent.id = "geocod-component-container";

        this.idlabel = document.createElement("div");
        this.idlabel.className = "id-label";
        this.idlabel.id = `${this.id}_label`;
        this.idlabel.innerHTML = `<h4>${this.id} </h4>`;

        this.input = document.createElement("input");
        this.input.id = `${this.id}_input`;
        this.input.className = "custom-input";
        this.input.placeholder = this.placeholder;
        this.dropdown = document.createElement("div");
        this.dropdown.classList.add("dropdown");

        //Create button
        this.button_loc = document.createElement("button");
        this.button_loc.type = "button";
        this.button_loc.className = "custom-button";
        this.button_loc.innerHTML = "🏴";
        this.button_loc.id = `${this.id}_button`;

        this.container.appendChild(geoComponent);
        geoComponent.appendChild(this.idlabel);
        geoComponent.appendChild(this.input);
        geoComponent.appendChild(this.dropdown);
        geoComponent.appendChild(this.button_loc);

        this.input.addEventListener("input", this.onInputChange.bind(this));
        this.input.addEventListener(
            "dblclick",
            this.onInputDblClick.bind(this)
        );
        this.button_loc.addEventListener(
            "click",
            this.onRoutePointMapInput.bind(this)
        );
    }

    public getElementInput(): HTMLInputElement {
        return this.input;
    }

    public getElementButton(): HTMLButtonElement {
        return this.button_loc;
    }

    public getOption(): GeocodedPoint | null {
        return this.option;
    }

    public disableComponent(): void {
        this.button_loc.disabled = true;
        this.input.disabled = true;
    }

    public enableComponent(): void {
        this.button_loc.disabled = false;
        this.input.disabled = false;
    }

    // When text input change, look for options
    private async onInputChange(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const textToSearch = target.value;

        if (textToSearch.length < 3) {
            this.clearDropdown();
            return;
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(async () => {
            try {
                const options = await this.fetchGeocoderOptions(textToSearch);
                this.updateDropdown(options);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        }, this.timeout);
    }

    // When double click on input
    private onInputDblClick() {
        this.emit("inputDblClick", this.id);
    }

    // Update dropdown list
    private updateDropdown(options: GeocodedPoint[]): void {
        this.clearDropdown();
        options.forEach((option) => {
            const optionElement = document.createElement("div");
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
            optionElement.innerHTML = `<span class="type-style">${type} </span><span>${option.textAddress}</span>`;
            optionElement.classList.add(
                "dropdown-option",
                `tipus_${option.addressType}`
            );
            optionElement.addEventListener("click", () => {
                this.onOptionSelected(option);
            });
            this.dropdown.appendChild(optionElement);
        });
    }

    //When selecting an option, dispatch event containing the option selected
    public onOptionSelected(option: GeocodedPoint): void {
        this.input.value = option.textAddress;
        this.option = option;
        this.clearDropdown();
        var markerPoint: MarkerPoint = {
            pointId: this.id,
            pointType: "undefined",
            point: option,
        };
        const inputEvent = new CustomEvent("addressSelected", {
            detail: markerPoint,
        });
        this.input.dispatchEvent(inputEvent);
    }

    // Clear dropdown list
    private clearDropdown(): void {
        while (this.dropdown.firstChild) {
            this.dropdown.removeChild(this.dropdown.firstChild);
        }
    }

    // Clear input value text
    public clearInput(): void {
        this.input.value = "";
    }

    // Fetch options from geocoder service by text. Autocomplete option
    private async fetchGeocoderOptions(
        textToSearch: string
    ): Promise<GeocodedPoint[]> {
        const geocoder = new ICGCGeocodingService();
        var center = this.controller.getMapCenter();
        const result = await geocoder.autocomplete(textToSearch, center);
        return result;
    }

    // Fetch options from geocoder service by coordinates. Reverse geocoding option
    private async fetchGeocoderOptionsReverse(
        coords: [number, number]
    ): Promise<GeocodedPoint[]> {
        const geocoder = new ICGCGeocodingService();
        const result = await geocoder.reverseGeocoding(coords);
        return result;
    }

    //When selecting a point in the map geocode point
    public onRoutePointMapInput(): void {
        this.controller.useMapPointInput(
            async (clickedPoint: [number, number]) => {
                // Get reverse geocoding
                const geocodedClickedPoint =
                    await this.fetchGeocoderOptionsReverse([
                        clickedPoint[1],
                        clickedPoint[0],
                    ]); //latlng -> lnglat
                // Update option selected
                this.onOptionSelected(geocodedClickedPoint[0]);
            }
        );
    }

    //Update text from new coordinates
    public async updateInput(newPoint: MarkerPoint) {
        var newGeocodedPoint = (
            await this.fetchGeocoderOptionsReverse(newPoint.point.coordinates)
        )[0];
        var newMarkerPoint = newPoint;
        newMarkerPoint.point = newGeocodedPoint;
        this.input.value = newMarkerPoint.point.textAddress;
    }
}
