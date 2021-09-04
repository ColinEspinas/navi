class App {
  constructor() {
    this.eventBus = document.createElement('div');
  }

  on(event, callback) {
    this.eventBus.addEventListener(event, callback);
  }

  emit(event, detail) {
    this.eventBus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

const app = new App();

export default app;