export class TodoCounter {
  constructor(parent, store, updateAll) {
    this.element = parent.querySelector(".todo-counter");
    this.store = store;
  }

  update() {
    const activeCount = this.store.items.reduce(
      (count, item) => count + (item.isComplete ? 0 : 1),
      0
    );
    const noun = activeCount === 1 ? "item" : "items";
    this.element.textContent = `${activeCount} ${noun} left`;
  }
}
