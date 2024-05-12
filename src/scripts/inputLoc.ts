import { Control, ControlPosition, DomUtil, Util, DomEvent } from 'leaflet';
import {Geocoder} from './geocod'


const InputLoc = Control.extend({
    //Inicialización
    initialize: function (options: {
        id:string, position: ControlPosition, placeHolder: string

    }) {
        Util.setOptions(this, options);
    },

    //Opciones
    options: {
        id: 'input_loc',
        position: 'topleft',
        placeHolder: 'Posició...'
    },

    //Información control personalizado
    onAdd: function () {
        const controlLoc = DomUtil.create('div', 'leaflet-control leaflet-bar custom-control');

        // Crea el input de texto
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = this.options.placeHolder;
        input.className = 'custom-input';
        input.id = this.options.id;
        controlLoc.appendChild(input);

         // Crea el botón
        var button = document.createElement('button');
        button.innerHTML = 'Buscar';
        button.className = 'custom-button';
        controlLoc.appendChild(button);

        // Evita que hacer clic en el control active eventos en el mapa
        DomEvent.disableClickPropagation(controlLoc);

        // Agrega el evento de escucha al input
        input.addEventListener('keydown', async function(event) {
            if (event.key == "Enter") { // Verifica si se presionó la tecla "Enter" (código 13)
                // Ejecuta la acción que deseas aquí, por ejemplo, buscar
                var searchText = input.value;
                const geocoder = new Geocoder(input.value)
                await geocoder.forwardGeocoding()
                console.log('Buscar:', geocoder.getCoord());
            }
        });

        return controlLoc;
    }
});

export const inputLoc = (options?: {
    id?: string, position?: ControlPosition, placeHolder?: string
}) => new InputLoc(options);