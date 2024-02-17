import { html } from "https://esm.sh/@arrow-js/core";
import { getNextId, store } from "./store.js";

// 한글 입력시 조합 때문에 keydown이 두 번 발생한다.
// 이로 인해 todo 항목이 두 개 생기는 버그가 있다.
// 이 버그를 방지하기 위해 isComposing 속성을 검사한다.
// 참고:
// - https://doqtqu.tistory.com/344
// - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
const handleKeydown = (event) => {
  if (event.code === "Enter" && !event.isComposing) {
    const itemText = event.currentTarget.value;
    event.currentTarget.value = "";

    store.items.unshift({ id: getNextId(), text: itemText, isComplete: false });
  }
};

export const todoEntry = html`
  <section class="todo-entry">
    <input type="checkbox" class="todo-complete-all-toggle" />
    <input
      type="text"
      class="todo-entry__fill-child todo-new-item-input"
      placeholder="What needs to be done?"
      @keydown="${handleKeydown}"
    />
  </section>
`;
