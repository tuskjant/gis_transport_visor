import { formatDistance, formatDuration } from "../routedata";  

describe('Format route data test', () => {
    test('format duration min', () => {
        const duration = 147;
        const duration_string = "2.5 min.";
        expect(formatDuration(duration)).toEqual(duration_string);
    });

    test('format duration hour', () => {
        const duration = 14700;
        const duration_string = "4 h 5 min.";
        expect(formatDuration(duration)).toEqual(duration_string);
    });

    test('format distance', () => {
        const distance = 1283.7658;
        const distance_string = "1.28 Km."
        expect(formatDistance(distance)).toEqual(distance_string);
    })
})