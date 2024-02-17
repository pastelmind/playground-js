import { html } from "https://esm.sh/@arrow-js/core";
import { getNextId, store } from "./store.js";

/** 텍스트 입력을 받는 `<input>` 컴포넌트 */
export const todoInput = html`
  <input
    class="todo-input"
    type="text"
    placeholder="What needs to be done?"
    autofocus
    @keydown="${(e) => {
      if (e.key === "Enter" && !e.isComposing) {
        const string = e.target.value.trim();
        if (string) {
          const newItem = {
            id: getNextId(),
            text: string,
            isCompleted: false,
            isEditing: false,
          };
          store.items.unshift(newItem);
          e.target.value = "";
        }
      }
    }}"
  />
`;
