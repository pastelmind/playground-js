import { Store } from "./store.js";
import { TodoInput } from "./todo-input.js";
import { TodoList } from "./todo-list.js";
import { TodoToolbar } from "./todo-toolbar.js";

export class App {
  constructor(root) {
    const store = new Store();

    const updateAll = () => {
      this.update();
    };

    this.todoInput = new TodoInput(root, store, updateAll);
    this.todoList = new TodoList(root, store, updateAll);
    this.todoToolbar = new TodoToolbar(root, store, updateAll);
  }

  update() {
    this.todoInput.update();
    this.todoList.update();
    this.todoToolbar.update();
  }
}
