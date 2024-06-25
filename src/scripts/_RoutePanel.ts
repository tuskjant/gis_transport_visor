/**
 * Panell de rutes:
 * - Crearà vàries instàncies de GeocoderComponent
 * - Botó de calcular ruta
 */

// rep un div amb panell lateral


// Inputs from and to

const sidebarContent = (idContainer: string) => {
    const sidebarContainer = document.getElementById(idContainer);
    if (sidebarContainer) {
        
    }
}


const sidebarContent = document.getElementById('sidebar-content');

if (sidebarContent) {
    const input1 = inputLoc({ id: 'i', placeHolder: "Inici..." });
    const input2 = inputLoc({ id: 'p1', placeHolder: "Destí..." });

    const select1 = new Selector('1', 'sidebar-content')

    const input1Container = input1.onAdd(my_map);
    const input2Container = input2.onAdd(my_map);

    if (input1Container && input2Container) {
        sidebarContent.appendChild(input1Container);
        sidebarContent.appendChild(input2Container);

        // Counter for inputs (case TSP)
        let next_input: number = 2;

        // Button to add more inputs (case TSP)
        const button = document.createElement('button');
        button.className = 'leaflet-bar leaflet-control';
        button.innerHTML = '<p class="fa">🞧</p>';
        button.title = "Travel Salesman Problem";
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const newInput = inputLoc({
                id: `p${next_input}`,
                placeHolder: "Parada..."
            });

            const newInputContainer = newInput.onAdd(my_map);
            if (newInputContainer) {
                sidebarContent.appendChild(newInputContainer);
                next_input++;
            }
        });

        sidebarContent.appendChild(button);
    }

}