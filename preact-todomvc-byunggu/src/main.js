import { render } from "https://esm.sh/preact";
import { App } from "./app.js";
import { html } from "./util.js";

const appElements = document.querySelectorAll(".main");

render(html`<${App} />`, appElements[0]);
