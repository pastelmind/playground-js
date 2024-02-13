export class TodoClearButton {
  constructor(parent, store, updateAll) {
    this.element = parent.querySelector(".todo-clear-completed-button");
    this.store = store;

    this.element.addEventListener("click", () => {
      this.store.items = this.store.items.filter((item) => !item.isComplete);
      updateAll();
    });
  }

  update() {
    const hasCompletedItem = this.store.items.some((item) => item.isComplete);
    this.element.classList.toggle(
      "todo-clear-completed-button--hidden",
      !hasCompletedItem
    );
  }
}
