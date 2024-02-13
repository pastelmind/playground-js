export class TodoListItem {
  constructor(list, store, item, updateAll) {
    this.id = item.id;

    const listItem = document.createElement("li");
    listItem.classList.add("todo-list-item");
    listItem.innerHTML = `
      <label class="todo-list-item__completed-checkbox-label">
        <input type="checkbox" class="todo-list-item__completed-checkbox" />
      </label>
      <div class="todo-list-item__text"></div>
      <button type="button" class="todo-list-item__delete-button"></button>
    `;

    let shouldBeVisible = true;
    switch (store.currentFilter) {
      case "all":
        // Always show item
        shouldBeVisible = true;
        break;
      case "active":
        // Only show if item is incomplete
        shouldBeVisible = !item.isComplete;
        break;
      case "complete":
        // Only show if item is complete
        shouldBeVisible = item.isComplete;
        break;
      default:
        throw new Error(`Unhandled filter: ${currentFilter}`);
    }
    listItem.classList.toggle("todo-list-item--hidden", !shouldBeVisible);

    const listItemText = listItem.querySelector(".todo-list-item__text");
    listItemText.textContent = item.text;

    const listItemCheckbox = listItem.querySelector(
      ".todo-list-item__completed-checkbox"
    );
    listItemCheckbox.checked = item.isComplete;
    listItemCheckbox.addEventListener("change", () => {
      item.isComplete = listItemCheckbox.checked;
      updateAll();
    });

    list.appendChild(listItem);
    this.element = listItem;

    const deleteButton = listItem.querySelector(
      ".todo-list-item__delete-button"
    );
    deleteButton.addEventListener("click", () => {
      // store에서 item을 제거한다
      store.items = store.items.filter((currentItem) => currentItem !== item);
      updateAll();
    });
  }

  update() {}

  remove() {
    this.element.remove();
  }
}
