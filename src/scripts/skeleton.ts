/*Skeleton for map app, it adds a header and a footer  */

const contentHtml = (projectTitle: string, nameLastname: string) => `
    <div class="header">
        <div>${projectTitle}</div>
    </div>
    <div id="map-container">
        <div id="map"></div>
    </div>
    <div id="footer">
        <p id="attribution">Projecte de pràctiques de <em>${nameLastname} </em>amb la llibreria Leaflet i Typescript</p>
    </div>
`;

export const startMapSkeleton = (
    document: Document,
    projectTitle = 'GIS Integral de transport',
    nameLastname = 'Gemma Riu',
) => {
  document.title = projectTitle;
  // 1. Seleccionamos el id del elemento principal
    const app = document.getElementById('app');
    if (app !== null && app !== undefined) {
        app.classList.add('grid-container')
    }
  // 2.- Creamos una capa temporal para añadir el contenido HTML
  const temp = document.createElement('div'); 
  // 3.- Incrustamos el HTML de la constante
  temp.innerHTML = contentHtml(projectTitle, nameLastname);
  // 4.- Añadimos en el primer nodo
  while (temp.firstChild) {
    app?.appendChild(temp.firstChild);
  }
};