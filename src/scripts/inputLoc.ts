import { Control, ControlPosition, DomUtil, Util, DomEvent } from 'leaflet';
//import { Geocoder } from './test/geocod_test'
import { Geocoder } from './geocod'
import L  from 'leaflet';
import { MarcadoresManager } from './marcadores';


/** Leaflet control to add an input for location
* Input component to enter directions from, to, stopover  
*/
const InputLoc = Control.extend({
   /**  Initializes the control with the provided options
   * @param {Object} options - Options for the control.
   * @param {string} options.id - The ID of the control (from, to)
   * @param {ControlPosition} options.position - The position of the control on the map.
   * @param {string} options.placeHolder - The placeholder text for the input.
   */
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
        controlLoc.id = 'input-loc-container';

        // Create input
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = this.options.placeHolder;
        input.className = 'custom-input';
        input.id = this.options.id;

        if (input) {
            controlLoc.appendChild(input);
        } else {
            console.error('Error: No se pudo crear el elemento input correctamente.');
        }

        //Create button
        var button_loc = document.createElement('button');
        button_loc.type = 'button';
        button_loc.className = 'custom-button';
        button_loc.innerHTML = '⌖'
        button_loc.id = `${this.options.id}_button`; 

        if (button_loc) {
            controlLoc.appendChild(button_loc);
        } else {
            console.error('Error: No se puede crear el elemento button correctamente.')
        }



        let clickHandler: (e: LeafletMouseEvent) => void;

        //Add the event listener to the button
        button_loc.addEventListener('click', () => {
            console.log("click a botó");
            console.log(((button_loc.id).toString()).replace('_button',''));
            // Desactivar cualquier manejador de clics existente
            if (clickHandler) {
                map.off('click', clickHandler);
            }
            // Crear un nuevo manejador de clics
            clickHandler = async (e: LeafletMouseEvent) => {
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`You clicked the map at ${e.latlng.toString()}`)
                    .openOn(map);
                const geocoder = new Geocoder( null, [e.latlng.lng, e.latlng.lat],null);
                await geocoder.reverseGeocoding([e.latlng.lng, e.latlng.lat]);
                const geocoderText = geocoder.getText();
                console.log(geocoderText);
                if (geocoderText != null) {
                    input.value = "hola";
                    input.value = geocoderText;
                }
                

                // Desactivar el clic en el mapa después de un clic
                map.off('click', clickHandler);
            };
            // Activar el nuevo manejador de clics
            map.on('click', clickHandler);
        });


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

                //Create marker linked to geocoder using MarcadoresManager
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

export const inputLoc = (options?: {
    id?: string, position?: ControlPosition, placeHolder?: string
}) => new InputLoc(options);