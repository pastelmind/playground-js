export class TodoInput {
  constructor(root, store, updateAll) {
    const todoInput = root.querySelector(".todo-new-item-input");

    // 한글 입력시 조합 때문에 keydown이 두 번 발생한다.
    // 이로 인해 todo 항목이 두 개 생기는 버그가 있다.
    // 이 버그를 방지하기 위해 isComposing 속성을 검사한다.
    // 참고:
    // - https://doqtqu.tistory.com/344
    // - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
    todoInput.addEventListener("keydown", (e) => {
      // 1. 입력 처리
      if (e.code === "Enter" && !e.isComposing) {
        const itemText = todoInput.value;
        // 원래 DOM을 여기서 업데이트하는 건 반칙이지만, 이게 쉬우니까 이렇게 하자
        todoInput.value = "";

        // 2. 상태변경
        store.items.unshift({ text: itemText, isComplete: false });

        // 3. 화면 갱신
        updateAll();
      }
    });
  }

  update() {
    // TODO:
  }
}
