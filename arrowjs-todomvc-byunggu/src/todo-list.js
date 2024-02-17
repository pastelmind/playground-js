import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

/**
 * 할일 목록의 할 일을 나타내는 `<li>` 컴포넌트
 */
function todoListItem(item) {
  return html`<li
    class="${() =>
      `todo-list__item ${
        (store.currentFilter === "active" && item.isCompleted) ||
        (store.currentFilter === "completed" && !item.isCompleted)
          ? "todo-list__item--hiding"
          : ""
      }`}"
  >
    <div class="todo-list__item-left">
      <button
        class="todo-list__item-check-button"
        @click="${() => {
          item.isCompleted = !item.isCompleted;
        }}"
      >
        ${() => (item.isCompleted ? "✔️" : "")}
      </button>
      <div
        class="${() =>
          `todo-list__item-text ${
            item.isCompleted ? "todo-list__item-checked" : ""
          }`}"
      >
        ${item.text}
      </div>
      <input class="todo-list__item-input todo-list--switch" type="text" />
    </div>
    <button
      class="todo-list__delete-button"
      @click="${() => {
        store.items = store.items.filter((x) => x.id !== item.id);
      }}"
    >
      X
    </button>
  </li>`;
}

/**
 * 할일 목록을 나타내는 `<ul>` 컴포넌트
 */
export const todoList = html`<ul class="todo-list">
  ${() => store.items.map((item) => todoListItem(item).key(item.id))}
</ul>`;
