import { Routing } from "../route";  
import { punts } from "../../assets/data/punts"; 

describe('Routing test', () => {
    test('get route geometry for 2 points', async () => {
        var routing = new Routing([punts[0].long, punts[0].lat], [punts[1].long, punts[1].lat]);
        await routing.getRoute();
        const expectedLineString = {
            "coordinates": [
                [2.489782, 41.689188],
                [2.489301, 41.689717],
                [2.489362, 41.690247],
                [2.489476, 41.692345],
                [2.490062, 41.69236],
                [2.490432, 41.692441],
                [2.490487, 41.692384],
                [2.490624, 41.692367],
                [2.490701, 41.692408],
                [2.490722, 41.692514],
                [2.490775, 41.69257],
                [2.490946, 41.692637],
                [2.494032, 41.692582],
                [2.494084, 41.692495],
                [2.494189, 41.692481],
                [2.494283, 41.692572],
                [2.497918, 41.694103],
                [2.498387, 41.693484],
                [2.498546, 41.693468],
                [2.498954, 41.693719]
            ],
            "type": "LineString"
        };
        expect(routing.getGeometry()).toEqual(expectedLineString);
    });

});