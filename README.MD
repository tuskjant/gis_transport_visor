# GIS Integral de Transport
Visor que forma part del projecte GIS Integral de Transport, fa servir l'API d'OSRM pel càlcul de rutes:
- Ruta entre dos punts
- Per a més de dos punts resolt el Problema del Venedor Ambulant (Travelling Salesman Problem)

## Característiques
- Visualització de mapes amb Leaflet
- Geocodificador d'adreces del ICGC
- Enrutament dinàmic amb OSRM
- Marcadors interactius

## Instal·lació
1- Clona el repositori: "https://github.com/tuskjant/gis_transport_visor"

2- Instal·la les dependencies: 
    ```cd gis_transport_visor
       npm install```

3- Inicia el servidor: ```npm run dev```



## Ús
Obra el navegador i accedeix a `http://localhost:5173`.
Introdueix una adreça a inici, al prèmer enter retornarà l'adreça trobada i apareixerà un marcador al punt.
Introdueix una adreça a destí, al prèmer enter retornarà l'adreça trobada i apareixerà un marcador al punt i mostrarà la ruta i la seva informació entre l'inici i el destí.
Es poden moure els marcadors i recalcularà la ruta. Per eliminar un marcador fer doble-click. Per obtenir informació de la ruta fer click sobre la ruta.

Per obtenir la ruta segons el Problema del Venedor Ambulant (TSP) agregar més cercadors fent click al botó "+". Es poden afegir tans cercadors com es vulgui. Al introduir la nova adreça recalcularà la ruta solucionant el TSP amb una ruta tancada desde l'inici.