import { Option } from './selectLoc';

export class GeocodComplet {
    private BASE_URL: string = "https://eines.icgc.cat";
    private FWD_URL: string = "/geocodificador/cerca";
    private RVS_URL: string = "/geocodificador/invers";
    private text: string | null;
    private coord: [number, number] | null;
    private focus: [number, number] | null;
    private layers: string = "address,topo1,topo2";
    private size: string = "1";


    const fetchOptions = async (query: string): Promise<Option[]> => {

        const BASE_URL: string = "https://eines.icgc.cat";
        const FWD_URL: string = "/geocodificador/autocompletar";


        const response = await fetch(`https://api.example.com/options?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        return data.options.map((item: any) => ({
            value: item.id,
            label: item.name,
        }));
    };

}



