import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

function makeToggleButtonClass() {
  if (store.items.length === 0) {
    return "check-all--initial";
  }

  if (store.items.some((item) => !item.isCompleted)) {
    return "check-all--off";
  } else {
    return "check-all--on";
  }
}

export const toggleButton = html`
  <button
    class="${() => `check-all ${makeToggleButtonClass()}`}"
    @click="${() => {
      if (store.items.some((storeItem) => !storeItem.isCompleted)) {
        for (const item of store.items) {
          item.isCompleted = true;
        }
      } else {
        for (const item of store.items) {
          item.isCompleted = false;
        }
      }
    }}"
  >
    ❯
  </button>
`;
