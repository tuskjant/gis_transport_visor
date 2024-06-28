interface Option {
    value: string;
    label: string;
    type: string;
}

import { fetchOptions } from './fetchoptions';

/**
 * Component to search directions using ICGC Geocoder autocomplete function
 * Select direction from options
 */
class Selector {
    private id: string;
    private container: HTMLElement;
    private input: HTMLInputElement;
    private dropdown: HTMLElement;
    private timeoutId: number | undefined;

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
                const options = await fetchOptions(query);
                this.updateDropdown(options);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }, 3000);
    }

    private updateDropdown(options: Option[]): void {
        this.clearDropdown();
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.textContent = option.label;
            optionElement.classList.add('dropdown-option', `tipus_${option.type}`);
            optionElement.addEventListener('click', () => {
                this.onOptionSelected(option);   
            });
            this.dropdown.appendChild(optionElement);
        });
    }

    private onOptionSelected(option: Option): void {
        this.input.value = option.label;
        this.clearDropdown();
    }

    private clearDropdown(): void {
        while (this.dropdown.firstChild) {
            this.dropdown.removeChild(this.dropdown.firstChild);
        }
    }
}


export { Selector };
export type { Option };


