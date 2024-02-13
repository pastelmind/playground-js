import { TodoListItem } from "./todo-list-item.js";

export class TodoList {
  todoListItems = [];

  constructor(root, store, updateAll) {
    const todoList = root.querySelector(".todo-list");
    /** 목록을 나타내는 `<ul>` */
    this.element = todoList;
    this.store = store;
    this.updateAll = updateAll;

    this.todoListItems = [];
  }

  update() {
    /*
    리스트를 업데이트하기 위해 항목을 다 지우고 다시 만드는 것이 아니라,
    필요한 것만 추가하거나 지운다.
    또한 상태가 변경된 것은 다시 그린다. update()
    */

    if (this.store.items.length > this.todoListItems.length) {
      // @TODO: 나중에 이거 좀더 견고하게 만들자
      this.todoListItems.push(
        new TodoListItem(
          this.element,
          this.store,
          this.store.items[0],
          this.updateAll
        )
      );
    } else if (this.store.items.length < this.todoListItems.length) {
      const remainingIds = new Set();
      for (const item of this.store.items) {
        remainingIds.add(item.id);
      }

      // Store에서 삭제한 값들에 해당하는 component들도 지운다
      this.todoListItems = this.todoListItems.filter((todoListItem) => {
        // 삭제해야 하면 false를 리턴한다
        // 남겨야 하면 true를 리턴한다

        // this.store.items의 id 목록 속에, todoListItem.id가 있는지 확인한다
        // for (const item of this.store.items) {
        //   if (item.id === todoListItem.id) {
        //     return true;
        //   }
        // }
        // return false;
        if (remainingIds.has(todoListItem.id)) {
          return true;
        } else {
          return false;
        }
      });
    }

    for (const listItem of this.todoListItems) {
      // 체크박스 상태 업데이트
      listItem.update();
    }
  }
}
