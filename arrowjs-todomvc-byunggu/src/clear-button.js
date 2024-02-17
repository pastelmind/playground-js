import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

export const clearButton = html`
  <button
    class="${() =>
      `menu-clear ${
        store.items.filter((item) => item.isCompleted).length === 0
          ? "menu-clear--hiding"
          : ""
      }`}"
    @click="${() => {
      store.items = store.items.filter((item) => !item.isCompleted);
    }}"
  >
    Clear completed
  </button>
`;
