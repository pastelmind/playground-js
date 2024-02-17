import { html } from "https://esm.sh/@arrow-js/core";
import { clearButton } from "./clear-button.js";
import { counter } from "./counter.js";
import { option } from "./option.js";
import { store } from "./store.js";

export const toolbar = html`
  <div
    class="${() =>
      `todo-list__menu ${
        store.items.length === 0 ? "todo-list__menu--hiding" : ""
      }`}"
  >
    ${counter} ${option} ${clearButton}
  </div>
`;
