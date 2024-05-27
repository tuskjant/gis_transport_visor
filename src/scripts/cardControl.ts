import * as L from "leaflet";

interface Card {
  id: number;
  text: string;
}

class CardControl extends L.Control {
  private cards: Card[] = [];
  private cardCounter = 0;
  private mapInstance: L.Map | null = null;

  constructor() {
    super({ position: "bottomleft" });
  }

  onAdd(map: L.Map): HTMLElement {
    this.mapInstance = map;
    const container = L.DomUtil.create("div", "custom-control-container");
    return container;
  }

  addCard(text: string) {
    const card: Card = { id: this.cardCounter++, text };
    this.cards.push(card);
    this.renderCards();
  }

  removeCard(id: number) {
    this.cards = this.cards.filter((card) => card.id !== id);
    this.renderCards();
  }

  renderCards() {
    const container = this.getContainer();
     if (!container) {
       return; // Si el contenedor no está definido, salimos de la función
     }
    container.innerHTML = "";

    this.cards.forEach((card) => {
      const cardElement = L.DomUtil.create("div", "card", container);
      cardElement.draggable = true;
      cardElement.dataset.id = card.id.toString();

      const cardText = L.DomUtil.create("span", "card-text", cardElement);
      cardText.textContent = card.text;

      const removeBtn = L.DomUtil.create("span", "remove-btn", cardElement);
      removeBtn.innerHTML = "&times;";
      removeBtn.onclick = () => this.removeCard(card.id);

      cardElement.ondragstart = (event) => {
        if (this.mapInstance) {
          this.mapInstance.dragging.disable();
        }
        (event as DragEvent).dataTransfer?.setData(
          "text/plain",
          card.id.toString()
        );
      };

      cardElement.ondragend = () => {
        if (this.mapInstance) {
          this.mapInstance.dragging.enable();
        }
      };

      cardElement.ondragover = (event) => {
        event.preventDefault();
      };

      cardElement.ondrop = (event) => {
        event.preventDefault();
        const draggedCardId = (event as DragEvent).dataTransfer?.getData(
          "text/plain"
        );
        if (draggedCardId) {
          const draggedCardIndex = this.cards.findIndex(
            (c) => c.id === parseInt(draggedCardId)
          );
          const targetCardIndex = this.cards.findIndex((c) => c.id === card.id);
          const [draggedCard] = this.cards.splice(draggedCardIndex, 1);
          this.cards.splice(targetCardIndex, 0, draggedCard);
          this.renderCards();
        }
      };
    });
  }
}

export default CardControl;
