<<<<<<< HEAD
# GIS Integral de Transport Viewer
## Overview
Viewer that is part of the GIS Integral de Transport project, using the OSRM API for route calculation:
+ Route between two points
+ For more than two points, it solves the Travelling Salesman Problem (TSP).
It's a web-based UI built using TypeScript and Leaflet for map rendering and route calculation.
=======
# GIS Integral de Transport
Visor que forma part del projecte GIS Integral de Transport, fa servir l'API de OSRM pel càlcul de rutes:
- Ruta entre dos punts
- Per a més de dos punts resol el Problema del Venedor Ambulant (Travelling Salesman Problem)
>>>>>>> be4eb3c5ab85a0db1fcd79ec7be308f8bf0d1753

### Features
- Map visualization with Leaflet
- Address geocoding with ICGC API
- Dynamic routing with OSRM
- Interactive markers

The network data can be prepared and modified using the [GIS Integral de Transport Editor](https://github.com/tuskjant/OSMEditorForRouting) 

## Usage
Enter an address in the start field, select the found address, and a marker will appear at the location. Alternatively, click on the flag icon, then click on a point on the map, and a marker will appear at the selected point, with the corresponding address displayed.

Do the same for a destination address, and a second marker will appear along with the route between the start and the destination, showing the route information. You can move the markers, and the route will be recalculated. To delete a marker, double-click on the marker or the address text. To get route details, click on the route.

For solving the Travelling Salesman Problem (TSP), add more search fields by clicking the "+" button. You can add as many as needed. To create a closed route where the start and end points are the same, check the "Circular route" option. When a new address is added, the route will be recalculated, solving the TSP and showing the order of the route.

## Sample
<img src="/docs/images/viewer.PNG" alt="Viewer image" width="500"/>


## Installation
1- Clone the repository: "https://github.com/tuskjant/gis_transport_visor"

2- Install dependencies:
    ```cd gis_transport_visor
       npm install```

3- Start the server: ```npm run dev```

## Development
See [architecture overview](/docs/architecture-overview.md) for details.

