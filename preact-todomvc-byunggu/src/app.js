import { useState } from "https://esm.sh/preact/hooks";
import { TodoInput } from "./todo-input.js";
import { TodoList } from "./todo-list.js";
import { html } from "./util.js";

let lastUsedId = 0;

function getNextId() {
  ++lastUsedId;
  return lastUsedId;
}

export function App() {
  const [items, setItems] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");

  console.log(items);

  return html`
    <div class="main">
      <div class="todo">
        <${TodoInput}
          onAddItem=${(text) => {
            const newItem = {
              id: getNextId(),
              text,
              isCompleted: false,
              isEditing: false,
            };
            setItems([newItem, ...items]);
          }}
        />
      </div>
      <${TodoList}
        items=${items}
        currentFilter=${currentFilter}
        onToggleCompleted=${(id) => {
          setItems(
            items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  isCompleted: !item.isCompleted,
                };
              }

              return item;
            })
          );
        }}
        onDelete=${(id) => {
          const newItems = items.map((item) => {
            if (item.id === id) {
              // item.isCompleted = !item.isCompleted;
              const newItem = {
                ...item,
                isCompleted: !item.isCompleted,
              };
              return newItem;
            }
            return item;
          });
          setItems(newItems);
        }}
      />
    </div>
  `;
}
