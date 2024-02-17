import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

export const counter = html`
  <div class="menu__count">
    ${() => {
      const count = store.items.filter((item) => !item.isCompleted).length;
      return `${count} ${count === 1 ? "item" : "items"} left`;
    }}
  </div>
`;
