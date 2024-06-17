import { Geocoder } from './geocod.ts';
import { Option } from './selectLoc';

export async function fetchOptions(query: string, focus: [number, number] | null = null): Promise<Option[]> {
    const geocoder = new Geocoder(query, null, focus);
    return await geocoder.autocomplete(query);
}