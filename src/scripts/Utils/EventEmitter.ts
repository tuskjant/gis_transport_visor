type EventCallback = (...args: any[]) => void;

export class EventEmitter {
    private events: { [event: string]: EventCallback[] } = {};

    // Método para suscribirse a un evento
    public on(event: string, listener: EventCallback): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Método para eliminar la suscripción de un evento
    public off(event: string, listener: EventCallback): void {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter((l) => l !== listener);
    }

    // Método para emitir un evento
    public emit(event: string, ...args: any[]): void {
        if (!this.events[event]) return;

        this.events[event].forEach((listener) => {
            listener(...args);
        });
    }
}
