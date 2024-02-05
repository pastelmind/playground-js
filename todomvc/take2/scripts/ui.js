// @ts-check

import * as store from "./store.js";
import { assert } from "./util.js";

/**
 * @param {Element} root
 * @param {object} options
 * @param {(text: string) => void} options.onAddItem
 */
export const setupNewItemInput = (root, options) => {
  const newItemInput = root.querySelector(".todo-new-item-input");
  assert(newItemInput instanceof HTMLInputElement);

  newItemInput.addEventListener("keydown", (event) => {
    // Handle Korean johap edge case
    if (event.key === "Enter" && !event.isComposing) {
      options.onAddItem(newItemInput.value);
      newItemInput.value = "";
    }
  });
};

/**
 * @param {Element} root
 */
export const setupTodoList = (root) => {
  const todoList = root.querySelector(".todo-list");
  assert(todoList);

  /**
   * @type {ReturnType<typeof setupTodoListItem>[]}
   */
  const listItemUis = [];

  /**
   * @param {object} options
   * @param {import("./store.js").TodoItem} options.item
   * @param {(value: boolean) => void} options.onCompletedChange
   * @param {() => void} options.onDelete
   */
  const prependListItem = (options) => {
    todoList.insertAdjacentHTML(
      "afterbegin",
      `
      <li class="todo-list-item">
        <label class="todo-list-item__completed-checkbox-label">
          <input type="checkbox" class="todo-list-item__completed-checkbox" />
        </label>
        <div class="todo-list-item__text"></div>
        <button type="button" class="todo-list-item__delete-button"></button>
      </li>
      `
    );

    const listItem = todoList.querySelector(".todo-list-item");
    assert(listItem);

    const listItemUi = setupTodoListItem(listItem, options);
    listItemUis.unshift(listItemUi);
    return listItemUi;
  };

  /**
   * @param {number} index
   */
  const removeListItemAtIndex = (index) => {
    const [listItemUi] = listItemUis.splice(index, 1);
    assert(listItemUi, `No list item at index ${index}`);

    listItemUi.remove();
  };

  /**
   * @param {number[]} indices
   */
  const removeListItemsAtIndices = (indices) => {
    const reversedIndices = [...indices].reverse();
    for (const index of reversedIndices) {
      removeListItemAtIndex(index);
    }
  };

  const update = () => {
    for (const [index, item] of store.getItems().entries()) {
      const listItemUi = listItemUis[index];
      assert(listItemUi, `No list item at index ${index}`);

      listItemUi.update(item.isComplete);
    }
  };

  return {
    prependListItem,
    removeListItemsAtIndices,
    update,
  };
};

/**
 * @param {Element} listItem
 * @param {object} options
 * @param {import("./store.js").TodoItem} options.item
 * @param {(value: boolean) => void} options.onCompletedChange
 * @param {() => void} options.onDelete
 */
const setupTodoListItem = (listItem, options) => {
  const listItemText = listItem.querySelector(".todo-list-item__text");
  assert(listItemText);
  listItemText.textContent = options.item.text;

  const listItemEditInput = document.createElement("input");
  listItemEditInput.type = "text";

  listItemText.addEventListener("dblclick", () => {
    listItemEditInput.value = options.item.text;
    listItem.replaceChild(listItemEditInput, listItemText);
  });

  listItemEditInput.addEventListener("blur", () => {
    options.item.text = listItemEditInput.value;

    listItemText.textContent = options.item.text;
    listItem.replaceChild(listItemText, listItemEditInput);
  });

  const completedCheckbox = listItem.querySelector(
    ".todo-list-item__completed-checkbox"
  );
  assert(completedCheckbox instanceof HTMLInputElement);
  completedCheckbox.checked = options.item.isComplete;
  completedCheckbox.addEventListener("change", () =>
    options.onCompletedChange(completedCheckbox.checked)
  );

  const deleteButton = listItem.querySelector(".todo-list-item__delete-button");
  assert(deleteButton);
  deleteButton.addEventListener("click", options.onDelete);

  const remove = () => listItem.remove();

  /**
   * @param {boolean} isComplete
   */
  const update = (isComplete) => {
    let shouldBeVisible = true;
    const currentFilter = store.getCurrentFilter();

    switch (currentFilter) {
      case "all":
        // Always show item
        shouldBeVisible = true;
        break;
      case "active":
        // Only show if item is incomplete
        shouldBeVisible = !isComplete;
        break;
      case "complete":
        // Only show if item is complete
        shouldBeVisible = isComplete;
        break;
      default:
        throw new Error(`Unhandled filter: ${currentFilter}`);
    }

    listItem.classList.toggle("todo-list-item--hidden", !shouldBeVisible);
    completedCheckbox.checked = isComplete;
  };

  update(options.item.isComplete);

  return { update, remove };
};

/**
 * @param {Element} root
 * @param {object} options
 * @param {(value: boolean) => void} options.onCompleteAllToggle
 */
export const setupCompleteAllToggle = (root, options) => {
  const completeAllCheckbox = root.querySelector(".todo-complete-all-toggle");
  assert(completeAllCheckbox instanceof HTMLInputElement);

  completeAllCheckbox.addEventListener("change", () => {
    options.onCompleteAllToggle(completeAllCheckbox.checked);
  });

  const update = () => {
    const isAllComplete = store.getItems().every((item) => item.isComplete);
    const isNoneComplete = store.getItems().every((item) => !item.isComplete);

    completeAllCheckbox.checked = isAllComplete;
    completeAllCheckbox.indeterminate = !isAllComplete && !isNoneComplete;
    console.log(
      "Updated to: checked = %s, indeterminate = %s",
      completeAllCheckbox.checked,
      completeAllCheckbox.indeterminate
    );
  };
  update();

  return { update };
};

/**
 * @param {Element} root
 */
export const setupCounter = (root) => {
  const todoCounter = root.querySelector(".todo-counter");
  assert(todoCounter);

  const update = () => {
    const activeCount = store
      .getItems()
      .reduce((count, item) => count + (item.isComplete ? 0 : 1), 0);

    const noun = activeCount === 1 ? "item" : "items";
    todoCounter.textContent = `${activeCount} ${noun} left`;
  };
  update();

  return { update };
};

/**
 * @param {Element} root
 * @param {object} options
 * @param {(filter: string) => void} options.onFilterChange
 */
export const setupToolbar = (root, options) => {
  const toolbar = root.querySelector(".todo-toolbar");
  assert(toolbar);

  const filterRadios = toolbar.querySelectorAll(
    "input[type=radio][name=todo-filter]"
  );
  for (const radio of filterRadios) {
    assert(radio instanceof HTMLInputElement);
    radio.addEventListener("change", () => {
      if (radio.checked) {
        options.onFilterChange(radio.value);
      }
    });
  }

  const update = () => {
    const count = store.getItems().length;
    toolbar.classList.toggle("todo-toolbar--hidden", count === 0);
  };
  update();

  return { update };
};

/**
 * @param {Element} root
 * @param {object} options
 * @param {() => void} options.onClear
 */
export const setupClearButton = (root, options) => {
  const clearButton = root.querySelector(".todo-clear-completed-button");
  assert(clearButton);

  clearButton.addEventListener("click", () => options.onClear());

  const update = () => {
    const hasCompletedItems = store.getItems().some((item) => item.isComplete);

    clearButton.classList.toggle(
      "todo-clear-completed-button--hidden",
      !hasCompletedItems
    );
  };

  return { update };
};
