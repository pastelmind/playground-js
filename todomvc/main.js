import { makeId } from "./utils.js";

/** 만들어진 todo 항목들을 담고 있다 */
const todoItems = [];

const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const itemText = todoInput.value;
    todoInput.value = "";

    const itemId = makeId();
    todoItems.unshift({
      id: itemId,
      isChecked: true,
      text: itemText,
    });

    const listItem = createListItem(itemId, itemText);
    todoList.prepend(listItem);
  }
});

function createListItem(itemId, itemText) {
  const listItem = document.createElement("li");
  listItem.classList.add("todo-list__item");
  listItem.innerHTML = `
      <button class="todo-list__item-check-button" type="button">✅</button>
      <div class="todo-list__item-text"></div>
    `;

  // 리스트 항목의 텍스트를 설정한다
  const itemTextEl = listItem.querySelector(".todo-list__item-text");
  itemTextEl.textContent = itemText;

  const itemButton = listItem.querySelector(".todo-list__item-check-button");
  itemButton.addEventListener("click", () => {
    const item = todoItems.find((item) => item.id === itemId);
    if (!item) {
      throw new Error(`No item with ID: ${itemId}`);
    }

    // 체크된 상태인지 확인하기
    if (item.isChecked) {
      // 체크 해제
      item.isChecked = false;
      itemButton.textContent = "";
    } else {
      // 체크 추가
      item.isChecked = true;
      itemButton.textContent = "✅";
    }
  });

  return listItem;
}
