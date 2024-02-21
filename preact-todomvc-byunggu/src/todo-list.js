import { html } from "./util.js";

export function TodoList(props) {
  return html`
    <ul class="todo-list">
      ${props.items.map(
        (item) =>
          html`
            <${TodoListItem}
              key=${item.id}
              item=${item}
              currentFilter=${props.currentFilter}
              onToggleCompleted=${() => {
                props.onToggleCompleted(item.id);
              }}
              onDelete=${() => {
                props.onDelete(item.id);
              }}
            />
          `
      )}
    </ul>
  `;
}

function TodoListItem(props) {
  let listItemClass = "todo-list__item";
  if (
    (props.currentFilter === "active" && props.item.isCompleted) ||
    (props.currentFilter === "completed" && !props.item.isCompleted)
  ) {
    listItemClass += " todo-list__item--hiding";
  }

  let listItemTextClass = "todo-list__item-text";
  if (props.item.isCompleted) {
    listItemTextClass += " todo-list__item-checked";
  }

  return html`
    <li class=${listItemClass}>
      <div class="todo-list__item-left">
        <button
          class="todo-list__item-check-button"
          onClick=${props.onToggleCompleted}
        >
          ${props.item.isCompleted ? "✔️" : ""}
        </button>
        <div class=${listItemTextClass}>${props.item.text}</div>
        <input type="text" />
      </div>
      <button class="todo-list__delete-button" onClick=${props.onDelete}>
        X
      </button>
    </li>
  `;
}
