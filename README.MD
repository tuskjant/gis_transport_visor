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
Introdueix una adreça a inici, selecciona l'adreça trobada i apareixerà un marcador al punt. Alternativament fes click sobre l'icona bandera i seguidament fes click en un punt al mapa i apareixerà un marcador al punt seleccionat i s'indicarà l'adreça corresponent. 
Fes el mateix per una adreça destí i es mostrarà un segon marcador, la ruta entre l'inici i el destí, i la informació de la ruta.
Es poden moure els marcadors i recalcularà la ruta. Per eliminar un marcador fer doble-click sobre el marcador o el text de l'adreça. Per obtenir informació de la ruta fer click sobre la ruta.


Per obtenir la ruta segons el Problema del Venedor Ambulant (TSP) agregar més cercadors fent click al botó "+". Es poden afegir tans cercadors com es vulgui. Per crear una ruta tancada amb inici igual a final fer marcar la opció "Ruta circular".
 A l'introduir la nova adreça recalcularà la ruta solucionant el TSP i mostrará l'ordre de la ruta a seguir.
