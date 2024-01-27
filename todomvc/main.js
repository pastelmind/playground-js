import { makeId } from "./utils.js";

/** 만들어진 todo 항목들을 담고 있다 */
const todoItems = [];
/** 활성화된 todo filter의 값을 담고 있다. */
let todoFilter = "all";

const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const todoCounter = document.querySelector(".todo-toolbar__counter");
const todoClearButton = document.querySelector(".todo-toolbar__clear-button");

// 한글 입력시 조합 때문에 keydown이 두 번 발생한다.
// 이로 인해 todo 항목이 두 개 생기는 버그가 있다.
// 이 버그를 방지하기 위해 isComposing 속성을 검사한다.
// 참고:
// - https://doqtqu.tistory.com/344
// - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
todoInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && !e.isComposing) {
    const itemText = todoInput.value;
    todoInput.value = "";

    const itemId = makeId();
    todoItems.unshift({
      id: itemId,
      isChecked: false,
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
    <button class="todo-list__item-check-button" type="button">🔲</button>
    <div class="todo-list__item-text"></div>
    <button class="todo-list__item-delete-button" type="button">❌</button>
  `;

  // 새로운 항목의 표시 여부를 정한다
  updateListItemVisibility(listItem, false);

  // 리스트 항목의 텍스트를 설정한다
  const itemTextEl = listItem.querySelector(".todo-list__item-text");
  itemTextEl.textContent = itemText;

  // 체크 버튼 클릭 시 동작을 설정한다
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
      itemButton.textContent = "🔲";
    } else {
      // 체크 추가
      item.isChecked = true;
      itemButton.textContent = "✅";
    }

    // 항목이 삭제되면 다음 항목을 업데이트한다:
    // - 미완료된 항목의 수
    // - '모두 삭제 버튼의 활성화 상태
    // - 모든 todo 항목의 표시 여부
    updateCounter();
    updateClearButtonState();
    updateAllItemsVisibility();
  });

  // 리스트 항목을 삭제한다
  const deleteButton = listItem.querySelector(".todo-list__item-delete-button");
  deleteButton.addEventListener("click", () => deleteItem(itemId));

  // 항목이 추가되면 다음 항목을 업데이트한다:
  // - 미완료된 항목의 수
  // - '모두 삭제 버튼의 활성화 상태
  // - 툴바의 표시 여부
  updateCounter();
  updateClearButtonState();
  updateToolbarVisibility();

  return listItem;
}

/** 미완료된 항목의 수를 업데이트한다. */
function updateCounter() {
  let uncheckedCount = 0;
  for (const item of todoItems) {
    if (!item.isChecked) {
      uncheckedCount += 1;
    }
  }
  const plural = uncheckedCount === 1 ? "item" : "items";
  todoCounter.textContent = `${uncheckedCount} ${plural} left`;
}

/** '완료된 항목 모두 삭제' 버튼의 활성화 여부를 업데이트한다. */
function updateClearButtonState() {
  const hasCheckedItem = todoItems.some((item) => item.isChecked);
  todoClearButton.disabled = !hasCheckedItem;
}

/** 항목을 삭제한다. */
function deleteItem(itemId) {
  const itemIndex = todoItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    throw new Error(`No item with ID: ${itemId}`);
  }

  todoItems.splice(itemIndex, 1);
  todoList.children[itemIndex].remove();

  // 항목이 삭제되면 다음 항목을 업데이트한다:
  // - 미완료된 항목의 수
  // - '모두 삭제 버튼의 활성화 상태
  // - 툴바의 표시 여부
  updateCounter();
  updateClearButtonState();
  updateToolbarVisibility();
}

// '완료된 항목 모두 삭제' 버튼의 클릭 시 동작을 정의한다
todoClearButton.addEventListener("click", () => {
  const checkedItems = todoItems.filter((item) => item.isChecked);
  for (const item of checkedItems) {
    deleteItem(item.id);
  }
});

const todoFilterRadioAll = document.querySelector("#todo-filter-radio-all");
const todoFilterRadioActive = document.querySelector(
  "#todo-filter-radio-active"
);
const todoFilterRadioCompleted = document.querySelector(
  "#todo-filter-radio-completed"
);

todoFilterRadioAll.addEventListener("change", () => {
  if (todoFilterRadioAll.checked) {
    todoFilter = "all";
    updateAllItemsVisibility();
  }
});
todoFilterRadioActive.addEventListener("change", () => {
  if (todoFilterRadioActive.checked) {
    todoFilter = "active";
    updateAllItemsVisibility();
  }
});
todoFilterRadioCompleted.addEventListener("change", () => {
  if (todoFilterRadioCompleted.checked) {
    todoFilter = "completed";
    updateAllItemsVisibility();
  }
});

/** `todoFilter`의 값을 바탕으로 각 todo 항목들의 표시 여부를 바꾼다. */
function updateAllItemsVisibility() {
  for (const [index, item] of todoItems.entries()) {
    const listItem = todoList.children[index];
    updateListItemVisibility(listItem, item.isChecked);
  }
}

/** 한 todo 항목의 `<li>` 요소의 표시 여부를 업데이트한다 */
function updateListItemVisibility(listItem, isChecked) {
  if (todoFilter === "all") {
    listItem.classList.remove("todo-list__item--hidden");
  } else if (todoFilter === "active") {
    // 완료된 항목을 숨긴다
    listItem.classList.toggle("todo-list__item--hidden", isChecked);
  } else if (todoFilter === "completed") {
    // 미완료된 항목을 숨긴다
    listItem.classList.toggle("todo-list__item--hidden", !isChecked);
  } else {
    throw new Error(`Unexpected filter type: ${todoFilter}`);
  }
}

const todoToolbar = document.querySelector(".todo-toolbar");

/** 툴바의 표시/숨김 상태를 업데이트한다. */
function updateToolbarVisibility() {
  if (todoItems.length > 0) {
    // 툴바를 드러낸다.
    todoToolbar.classList.remove("todo-toolbar--hidden");
  } else {
    // 툴바를 숨긴다.
    todoToolbar.classList.add("todo-toolbar--hidden");
  }
}
