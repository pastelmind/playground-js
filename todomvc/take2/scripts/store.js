// @ts-check

/**
 * @typedef {Object} TodoItem
 * @property {number} id
 * @property {string} text
 * @property {boolean} isComplete
 */

/**
 * @type {TodoItem[]}
 */
const todoItems = [];

/**
 * @typedef {'all' | 'active' | 'complete'} FilterType
 */

/**
 * @type {FilterType}
 */
let currentFilter = "all";

export function getCurrentFilter() {
  return currentFilter;
}

/**
 * @param {string} filter
 */
export function setCurrentFilter(filter) {
  if (filter === "all" || filter === "active" || filter === "complete") {
    currentFilter = filter;
  } else {
    throw new Error(`Invalid filter value: ${filter}`);
  }
}

/**
 * @returns {readonly Readonly<TodoItem>[]}
 */
export function getItems() {
  return todoItems;
}

let lastItemId = 0;
function getNextItemId() {
  return ++lastItemId;
}

/**
 * @param {string} text
 * @param {boolean} isComplete
 * @returns {TodoItem}
 */
export function addItem(text, isComplete) {
  const itemId = getNextItemId();
  const item = { id: itemId, text, isComplete };
  todoItems.unshift(item);
  return item;
}

/**
 * @param {number} itemId
 */
export function deleteItem(itemId) {
  const index = todoItems.findIndex((item) => item.id === itemId);
  if (index === -1) {
    throw new Error(`No item with ID ${itemId}`);
  }
  todoItems.splice(index, 1);
}

/**
 * @param {number} itemId
 * @param {boolean} isComplete
 */
export function setItemCompleted(itemId, isComplete) {
  const item = todoItems.find((item) => item.id === itemId);
  if (!item) {
    throw new Error(`No item with ID ${itemId}`);
  }

  item.isComplete = isComplete;
}

/**
 * @param {boolean} isComplete
 */
export function setAllItemsCompleted(isComplete) {
  for (const item of todoItems) {
    item.isComplete = isComplete;
  }
}

/**
 * @returns {number[]} Array containing deleted indices in order
 */
export function deleteAllCompletedItems() {
  let i = todoItems.length - 1;
  const deletedIndices = [];

  while (i >= 0) {
    if (todoItems[i].isComplete) {
      todoItems.splice(i, 1);
      deletedIndices.push(i);
    }
    --i;
  }

  deletedIndices.reverse();
  return deletedIndices;
}
