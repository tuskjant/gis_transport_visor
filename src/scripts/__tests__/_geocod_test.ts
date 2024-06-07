export class Geocoder{
    private text: string | null;
    private coord: [number, number] | null;
    private focus: [number, number] | null;

    constructor(text: string | null = null, coord: [number, number] | null = null, focus: [number, number] | null = null) {
        if (text === null && coord === null) {
            throw new Error("Missed parameters for geocoding");
        }
        this.text = text;
        this.coord = coord;
        this.focus = focus;
    }

    public async forwardGeocoding(): Promise<boolean | void>{
        console.log("Forward geocoding")
        if (this.text == "1") {
            this.text = "Carrer de Campins 5, Sant Celoni"
            this.coord = ([2.49089533, 41.69064646]) 
        }
        else {
            this.text = "Carrer de Sant Josep 5, Sant Celoni"
            this.coord = ([2.48846403, 41.68745059])
        }
        
    }

     public getText(): string | null {
        return this.text;
    }

    public getCoord(): [number, number] | null {
        return this.coord;
    }

}