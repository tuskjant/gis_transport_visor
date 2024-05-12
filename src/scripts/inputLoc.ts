import { Control, ControlPosition, DomUtil, Util, DomEvent } from 'leaflet';
import { Geocoder } from './geocod'
import L  from 'leaflet';


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
    onAdd: function (map: L.Map) {
        const controlLoc = DomUtil.create('div', 'leaflet-control leaflet-bar custom-control');
        const self = this;

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
            if (event.key == "Enter") { 
                var center: [number, number] = ([map.getCenter().lng, map.getCenter().lat]);  //focus al centre del mapa
                const geocoder = new Geocoder(input.value, null, center);
                await geocoder.forwardGeocoding();
                const geocoderText = geocoder.getText();
                console.log(geocoderText);
                if (geocoderText !== null) {
                    input.value = geocoderText;
                }
                
                console.log(map.getCenter());
                var coord = geocoder.getCoord();
                if (coord !== null) {
                    console.log('Buscar:', geocoder.getCoord());
                    const marcador = L.marker([coord[1], coord[0]], {
                        draggable: true
                    }).addTo(map)
                }
            }
        });

        return controlLoc;
    }
});

export const inputLoc = (map: L.Map, options?: {
    id?: string, position?: ControlPosition, placeHolder?: string
}) => new InputLoc(options);