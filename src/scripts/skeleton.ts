/*Skeleton for map app, it adds a header and a footer  */

const contentHtml = (projectTitle: string, nameLastname: string) => `
  <div class="header">
    <div>${projectTitle}</div>
  </div>
  <div id="map-container">
    <div id="map"></div>
    <div id="sidebar" class="sidebar">
      <div id="text-sidebar">
        <h2>Càlcul de rutes</h2>
        <p>Cerca dues adreces per calcular una ruta. Afegeix més cercadors 
        i adreces per obtenir una ruta tancada amb inici i final al primer punt i 
        trobant la ruta optima per recòrrer tots els punts.</p>
      </div>
      <div id="sidebar-content">
        <!-- Afegir inputs cercadors -->
      </div>
    </div>
    <button id="toggle-btn" class="toggle-btn">➔</button>
  </div>
  <div id="footer">
    <p id="attribution">Projecte de pràctiques de <em>${nameLastname}</em> amb la llibreria Leaflet i Typescript</p>
  </div>
  
`;

export const startMapSkeleton = (
  document: Document,
  projectTitle = "GIS Integral de transport",
  nameLastname = "Gemma Riu"
) => {
  document.title = projectTitle;
  // 1. Seleccionamos el id del elemento principal
  const app = document.getElementById("app");
  if (app !== null && app !== undefined) {
    app.classList.add("grid-container");
  }
  // 2.- Creamos una capa temporal para añadir el contenido HTML
  const temp = document.createElement("div");
  // 3.- Incrustamos el HTML de la constante
  temp.innerHTML = contentHtml(projectTitle, nameLastname);
  // 4.- Añadimos en el primer nodo
  while (temp.firstChild) {
    app?.appendChild(temp.firstChild);
  }
  // Añadir funcionalidad del panel lateral
  const sidebar = document.getElementById("sidebar") as HTMLElement;
  const toggleBtn = document.getElementById("toggle-btn") as HTMLElement;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      toggleBtn.style.left = '310px';
      toggleBtn.textContent = '🡸'; 
    } else {
      toggleBtn.style.left = '10px';
      toggleBtn.textContent = '🡺'; 
    }
  });
};
