import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

function shouldBeVisible(item) {
  switch (store.currentFilter) {
    case "all":
      // Always show item
      return true;
    case "active":
      // Only show if item is incomplete
      return !item.isComplete;
    case "complete":
      // Only show if item is complete
      return item.isComplete;
    default:
      throw new Error(`Unhandled filter: ${currentFilter}`);
  }
}

function deleteItem(item) {
  console.log("haha");
  store.items = store.items.filter((currentItem) => currentItem.id !== item.id);
}

const todoListItem = (item) => html`
  <li
    class="todo-list-item ${() =>
      shouldBeVisible(item) ? "" : "todo-list-item--hidden"}"
  >
    <label class="todo-list-item__completed-checkbox-label">
      <input
        type="checkbox"
        class="todo-list-item__completed-checkbox"
        checked="${() => (console.log(item), item.isComplete)}"
      />
    </label>
    <div class="todo-list-item__text">${() => item.text}</div>
    <button
      type="button"
      class="todo-list-item__delete-button"
      @click="${() => deleteItem(item)}"
    ></button>
  </li>
`;

export const todoList = html`
  <ul class="todo-list">
    ${() => store.items.map((item) => todoListItem(item).key(item.id))}
  </ul>
`;
