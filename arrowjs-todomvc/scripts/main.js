import { html } from "https://esm.sh/@arrow-js/core";
import { todoEntry } from "./todo-entry.js";
import { todoList } from "./todo-list.js";

const appElement = document.querySelector("#app");

const app = html`${todoEntry}${todoList}`;

app(appElement);
