import { Control, ControlPosition, DomUtil, Util, DomEvent } from 'leaflet';
//import { Geocoder } from './test/geocod_test'
import { Geocoder } from './geocod'
import L  from 'leaflet';
import { MarcadoresManager } from './marcadores';


//Component input from - to
const InputLoc = Control.extend({
    //Initialize
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

                //Create marker linked to geocoder 
                var coord = geocoder.getCoord();
                if (coord !== null) {
                  const marcadoresManager = new MarcadoresManager(
                    map,
                    geocoder
                  );
                  MarcadoresManager.crearMarcador(input.id, coord[1], coord[0]); 
                }
            }
        });

        return controlLoc;
    }
});

export const inputLoc = (map: L.Map, options?: {
    id?: string, position?: ControlPosition, placeHolder?: string
}) => new InputLoc(options);