import { html } from "https://esm.sh/@arrow-js/core";
import { store } from "./store.js";

export const option = html`
  <div class="menu__control">
    <button
      class="${() =>
        `control-all ${
          store.currentFilter === "all" ? "" : "control-button--inactive"
        }`}"
      @click="${() => {
        store.currentFilter = "all";
      }}"
    >
      All
    </button>
    <button
      class="${() =>
        `control-active ${
          store.currentFilter === "active" ? "" : "control-button--inactive"
        }`}"
      @click="${() => {
        store.currentFilter = "active";
      }}"
    >
      Active
    </button>
    <button
      class="${() =>
        `control-completed ${
          store.currentFilter === "completed" ? "" : "control-button--inactive"
        }`}"
      @click="${() => {
        store.currentFilter = "completed";
      }}"
    >
      Completed
    </button>
  </div>
`;
