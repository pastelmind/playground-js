import { html } from "./util.js";

export function TodoInput(props) {
  return html`<input
    class="todo-input"
    type="text"
    placeholder="What needs to be done?"
    autofocus
    onKeyDown=${(e) => {
      if (e.key === "Enter" && !e.isComposing) {
        const string = e.target.value.trim();
        if (string) {
          props.onAddItem(string);
          e.target.value = "";
        }
      }
    }}
  />`;
}
