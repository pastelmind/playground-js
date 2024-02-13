import { TodoClearButton } from "./todo-clear-button.js";
import { TodoCounter } from "./todo-counter.js";
import { TodoFilter } from "./todo-filter.js";

export class TodoToolbar {
  constructor(root, store, updateAll) {
    this.store = store;
    this.updateAll = updateAll;

    this.element = root.querySelector(".todo-toolbar");
    this.todoCounter = new TodoCounter(this.element, store, updateAll);
    this.todoFilter = new TodoFilter(this.element, store, updateAll);
    this.todoClearButton = new TodoClearButton(this.element, store, updateAll);
  }

  update() {
    const hasItem = this.store.items.length > 0;
    this.element.classList.toggle("todo-toolbar--hidden", !hasItem);

    this.todoCounter.update();
    this.todoFilter.update();
    this.todoClearButton.update();
  }
}
