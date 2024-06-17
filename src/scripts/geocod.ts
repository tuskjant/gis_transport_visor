import axios from 'axios';
import { Option } from './selectLoc';



/**  Class Geocoder for forward and reverse geocoding
* Utilize the geocoder from ICGC: https://eines.icgc.cat
*/
export class Geocoder {
    private BASE_URL: string = "https://eines.icgc.cat";
    private FWD_URL: string = "/geocodificador/cerca";
    private RVS_URL: string = "/geocodificador/invers";
    private ACP_URL: string = "/geocodificador/autocompletar";
    private text: string | null;
    private coord: [number, number] | null;
    private focus: [number, number] | null;
    private layers: string = "address,topo1,topo2";
    private size: string = "1";
    private autocompleteSize: string = "5";
    private options: Option[] | void =[];



    /**
     * Creates an instance of class Geocoder
     * @param text text describing location for forward geocoding
     * @param coord coordinates (long, lat) for reverse geocoding
     * @param focus coordinates (long, lat) of point center to priorize results
     */
    constructor(text: string | null = null, coord: [number, number] | null = null, focus: [number, number] | null = null) {
        if (text === null && coord === null) {
            throw new Error("Missed parameters for geocoding");
        }
        this.text = text;
        this.coord = coord;
        this.focus = focus;
    }

    public setFocus(focus: [number, number]): void {
        this.focus = focus;
    }

    public getText(): string | null {
        return this.text;
    }

    public getCoord(): [number, number] | null {
        return this.coord;
    }

    //Forward geocoding
    public async forwardGeocoding(): Promise<boolean | void> {
        if (this.text === null || this.text.length < 3) {
            return false;
        }
        var urlQuery : string = ''
        if (this.focus !== null) {
            urlQuery = `text=${encodeURIComponent(this.text)}&focus.point.lat=${this.focus[1]}&focus.point.lon=${this.focus[0]}&layers=${this.layers}&size=${this.size}`;
        }
        else {
             urlQuery = `text=${encodeURIComponent(this.text)}&layers=${this.layers}&size=${this.size}`;
        }
        const url: string = this.BASE_URL + this.FWD_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            this.extractText(response.data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    //Reverse geocoding
    public async reverseGeocoding(coords: [number, number]): Promise<boolean | void> {
        this.coord = coords
        const urlQuery: string = `lat=${this.coord[1]}&lon=${this.coord[0]}&layers=${this.layers}&size=${this.size}`;
        const url: string = this.BASE_URL + this.RVS_URL + '?' + urlQuery;

        try {
            const response = await axios.get(url);
            this.extractCoord(response.data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    //Autocomplete forward geocoding
    public async autocomplete(text: string ): Promise<Option[]>{
        var urlQuery: string = ''
        if (this.focus !== null) {
            urlQuery = `text=${encodeURIComponent(text)}&focus.point.lat=${this.focus[1]}&focus.point.lon=${this.focus[0]}&layers=${this.layers}&size=${this.size}`;
        }
        else {
            urlQuery = `text=${encodeURIComponent(text)}&layers=${this.layers}&size=${this.autocompleteSize}`;
        }
        const url: string = this.BASE_URL + this.FWD_URL + '?' + urlQuery;
        console.log(url)

        const response = await axios.get(url);
        var options = this.extractOptions(response.data.features);     
        return options;
    }


    //Get coordinates from response for reverse geocoding considering nearest point
    private extractCoord(data: any): void {
        let dist: number ;
        let coords: [number, number] | null = null;
        let text: string | null = null;
        try {
            dist = data.features[0].properties.distancia;
            if (dist !== null && dist !== undefined) {
                data.features.forEach((feature: any) => {
                    if (feature.properties.distancia <= dist) {
                        dist = feature.properties.distancia;
                        text = feature.properties.etiqueta;
                        coords = feature.geometry.coordinates;
                    }
                });
            }
            this.coord = coords;
            this.text = text;
        } catch (error) {
            console.error("Error accessing geocoding data.");
            throw new Error("Error accessing geocoding data.");
        }
    }

    //Get text from response for forward geocoding    
    private extractText(data: any): void {
        try {
            this.coord = data.features[0].geometry.coordinates;
            this.text = data.features[0].properties.etiqueta;
        } catch (error) {
            console.error("Error accessing geocoding data.");
            throw new Error("Error accessing geocoding data.");
        }
    }

    private extractOptions(feature: any): Option[] {
        var options: Option[] = [];
        try {
            feature.forEach((element, index) => {
                const option: Option = {
                    value: (index + 1).toString(),
                    label: element.properties.etiqueta,
                    type: element.properties.layer
                }
                options.push(option);
            })
            return options;       
        } catch (error) {
            console.error("Error accessing geocoding data.");
            throw new Error("Error accessing geocoding data.");
        }
    }
}






