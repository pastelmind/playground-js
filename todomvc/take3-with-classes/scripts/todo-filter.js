export class TodoFilter {
  constructor(parent, store, updateAll) {
    const filterRadios = parent.querySelectorAll(
      "input[type=radio][name=todo-filter]"
    );
    for (const radio of filterRadios) {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          store.currentFilter = radio.value;
          updateAll();
        }
      });
    }
  }

  update() {}
}
