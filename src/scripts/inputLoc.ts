import { Control, ControlPosition, DomUtil, Util, DomEvent } from 'leaflet';
import { Geocoder } from './geocod'
import L  from 'leaflet';
import { crearMarcador, marcadores } from './marcadores';

//Component input from - to
const InputLoc = Control.extend({
    //Inicialización
    initialize: function (options: {
        id:string, position: ControlPosition, placeHolder: string

    }) {
        Util.setOptions(this, options);
    },

    //Options
    options: {
        id: 'input_loc',  
        position: 'topleft',
        placeHolder: 'Posició...'
    },

    //Control
    onAdd: function (map: L.Map) {
        const controlLoc = DomUtil.create('div', 'leaflet-control leaflet-bar custom-control');

        // Create input
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = this.options.placeHolder;
        input.className = 'custom-input';
        input.id = this.options.id;
        controlLoc.appendChild(input);

         // Create button for positioning
        var button = document.createElement('button');
        button.innerHTML = 'Ubicar';
        button.className = 'custom-button';
        controlLoc.appendChild(button);

        // Avoid that clicking on the control triggers events on the map
        DomEvent.disableClickPropagation(controlLoc);

        // Add the event listener to the input
        input.addEventListener('keydown', async function(event) {
            if (event.key == "Enter") { 
                var center: [number, number] = ([map.getCenter().lng, map.getCenter().lat]);  //focus al centre del mapa
                const geocoder = new Geocoder(input.value, null, center);
                await geocoder.forwardGeocoding();
                const geocoderText = geocoder.getText();
                //Show text result in input box
                if (geocoderText !== null) {
                    input.value = geocoderText;
                }
                //Remove marker if exists
                var coord = geocoder.getCoord();
                if (marcadores[input.id] !== null && marcadores[input.id] !== undefined) {
                    const marcador = marcadores[input.id];
                    marcador.remove(); 
                    delete marcadores[input.id];
                }
                //Create marker linked to geocoder 
                if (coord !== null) {
                    crearMarcador(input.id, coord[1], coord[0], map, geocoder, )
                }
            }
        });

        return controlLoc;
    }
});

export const inputLoc = (map: L.Map, options?: {
    id?: string, position?: ControlPosition, placeHolder?: string
}) => new InputLoc(options);