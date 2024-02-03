// @ts-check

import * as store from "./store.js";
import * as ui from "./ui.js";
import { assert } from "./util.js";

const setup = () => {
  const root = document.querySelector(".todo-app");
  assert(root);

  const counterUi = ui.setupCounter(root);
  const completeAllToggleUi = ui.setupCompleteAllToggle(root, {
    onCompleteAllToggle: (isComplete) => {
      store.setAllItemsCompleted(isComplete);
      todoListUi.update();
      clearButtonUi.update();
    },
  });

  const todoListUi = ui.setupTodoList(root);
  const toolbarUi = ui.setupToolbar(root, {
    onFilterChange: (filter) => {
      store.setCurrentFilter(filter);
      todoListUi.update();
    },
  });
  const clearButtonUi = ui.setupClearButton(root, {
    onClear: () => {
      const deletedIndices = store.deleteAllCompletedItems();

      todoListUi.removeListItemsAtIndices(deletedIndices);
      completeAllToggleUi.update();
      toolbarUi.update();
      clearButtonUi.update();
    },
  });

  ui.setupNewItemInput(root, {
    onAddItem: (text) => {
      const isComplete = false;
      const itemId = store.addItem(text, isComplete);

      const listItemUi = todoListUi.prependListItem({
        text,
        isComplete,
        onCompletedChange: (isCompleted) => {
          store.setItemCompleted(itemId, isCompleted);
          listItemUi.update(isCompleted);
          counterUi.update();
          completeAllToggleUi.update();
          clearButtonUi.update();
        },
        onDelete: () => {
          store.deleteItem(itemId);
          listItemUi.remove();
          counterUi.update();
          completeAllToggleUi.update();
          toolbarUi.update();
          clearButtonUi.update();
        },
      });
      counterUi.update();
      completeAllToggleUi.update();
      toolbarUi.update();
      clearButtonUi.update();
    },
  });
};

setup();
