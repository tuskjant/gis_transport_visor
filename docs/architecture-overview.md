# GIS Integral de Transport: Architecture Overview
This repository it's one main part of the GIS Integral de Transport System: Here is hosted and described the GIS Integral de Transport Viewer.

## 1.System Context 
The GIS Integral Transport System is designed to provide route planning and network maintenance functionality for users. It consists of two main interacting systems: GIS Integral de Transport Viewer and GIS Integral de Transport Editor used by two user types.

<img src="/docs/diagrams/c4/01_Context.png" alt="Context diagram" width="300"/>

### Main Actors
+ **Route Planner:** A user who needs to find the optimal route between two or more locations.
+ **Network Maintenance Operator:** A user responsible for editing and updating the road network using the Editor.
### Internal systems
+ **GIS Integral de Transport Viewer:** Map viewer that allows users to plan routes and visualize them on the map by selecting two or more points. This system is located and described in this repository.
+ **GIS Integral de Transport Editor:** Allows network operators to edit road data and update the routing network.  This system is located in [this repository](https://github.com/tuskjant/OSMEditorForRouting)
### External systems
+ **Open Source Routing Machine:** The routing engine that calculates the routes. [OSRM backend](https://github.com/Project-OSRM/osrm-backend)

## 2. GIS Integral de Transport Viewer: Container diagram
The Viewer container provides functionality for quering the road network and getting the shortest route between two or more points. This is achieved through the use of the ICGC Geocoding API, the OpenStreetMap Tile Server, and the OSRM Routing Server.

<img src="/docs/diagrams/c4/02_ContainersViewer.png" alt="Viewer container diagram" width="300"/>

+ **Viewer Web Application:** A web-based UI built using Typescript and Leaflet for map rendering and route calculation. The route planner user uses this application to calculate optimal routes.
+ **API Geocoder ICGC:**  Provides geocoding services: converting user-entered addresses into coordinates and reverse geocoding, converting coordinates into addresses.
+ **OSM Tile server:**  Provides the map tiles used to create the background map for the viewer.
+ **OSRM:**  The routing server that returns the optimal route based on the points entered.

## 3. GIS Integral de Transport Viewer: Components diagram
The viewer web application is composed of modular components that handle specific tasks. 

<img src="/docs/diagrams/c4/03_ViewerComponents.png" alt="Viewer components diagram" width="300"/>

+ **Geocoding service:** This service handles the geocoding of addresses and coordinates. It uses the ICGC API to convert coordinates into addresses and vice versa, addresses into coordinates.
+ **Routing service:** This service calculates optimal routes based on two or more points defined by their coordinates. It leverages the OSRM API to determine the best route.
+ **Geocoder component:** This component allows the user to input an address. It interacts with the Geocoding Service to obtain the corresponding coordinates and with the Leaflet Route Controller to display the entered location on the map.
+ **Leaflet route controller:** This component manages interaction with the map, displaying the input points and calculated routes. It interfaces with the Leaflet map.
+ **Route panel:** The panel that creates instances of the Geocoder Component, captures user input, and directs it to the Leaflet Route Controller to visualize the results on the map.

## Technologies and libraries used
The application was built using TypeScript as the main programming language. For handling map rendering and interaction, the project uses Leaflet, a lightweight and open-source JavaScript library for mobile-friendly interactive maps. Leaflet makes it easy to display background map tiles, markers, and routes on the web interface. To scaffold the project and manage the development environment, Vite was used. Node.js was employed to manage the dependencies and scripts required for development. 