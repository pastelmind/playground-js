import express from "express";

interface TodoItem {
  text: string;
  isCompleted: boolean;
}

const router = express.Router();
const todoItems: TodoItem[] = [];

const FILTER_TYPES = {
  all: "All",
  active: "Active",
  completed: "Completed",
};
type FilterType = keyof typeof FILTER_TYPES;

const isFilterType = (value: unknown): value is FilterType =>
  typeof value === "string" && Object.hasOwn(FILTER_TYPES, value);

let currentFilterType: FilterType = "all";

const isItemMatchingFilterType = (item: TodoItem, filterType: FilterType) => {
  switch (filterType) {
    case "all":
      return true;
    case "active":
      return !item.isCompleted;
    case "completed":
      return item.isCompleted;
    default:
      filterType satisfies never;
      throw new Error(`Unhandled case: ${filterType}`);
  }
};

const countItems = <T>(values: readonly T[], cond: (item: T) => boolean) =>
  values.reduce((count, item) => count + (cond(item) ? 1 : 0), 0);

const getRenderOptions = () => {
  return {
    items: todoItems.filter((item) =>
      isItemMatchingFilterType(item, currentFilterType),
    ),
    filterTypes: (Object.keys(FILTER_TYPES) as FilterType[]).map(
      (filterType) => ({
        type: filterType,
        text: FILTER_TYPES[filterType],
        checked: filterType === currentFilterType ? "checked" : undefined,
        count: countItems(todoItems, (item) =>
          isItemMatchingFilterType(item, filterType),
        ),
      }),
    ),
  };
};

router.get("/", (req, res) => {
  res.render("todo", getRenderOptions());
});

router.post("/", (req, res) => {
  const {
    complete: itemToCompleteStr,
    incomplete: itemToIncompleteStr,
    delete: itemToDeleteStr,
    todo_text: todoText,
    "filter-type": filterType,
  } = req.body;

  if (filterType !== undefined && isFilterType(filterType)) {
    currentFilterType = filterType;
  }

  if (itemToCompleteStr !== undefined) {
    const itemIndex = Number(itemToCompleteStr);
    if (Number.isSafeInteger(itemIndex)) {
      const item = todoItems[itemIndex];
      if (item) {
        item.isCompleted = true;
      }
    }
  }

  if (itemToIncompleteStr !== undefined) {
    const itemIndex = Number(itemToIncompleteStr);
    if (Number.isSafeInteger(itemIndex)) {
      const item = todoItems[itemIndex];
      if (item) {
        item.isCompleted = false;
      }
    }
  }

  if (itemToDeleteStr !== undefined) {
    const itemToDelete = Number(itemToDeleteStr);
    if (Number.isSafeInteger(itemToDelete)) {
      todoItems.splice(itemToDelete, 1);
    }
  }

  if (todoText) {
    todoItems.push({ text: todoText, isCompleted: false });
  }

  // Remove query parameters and request body, so that users do not resubmit the
  // same request when they refresh the page.
  res.redirect(303, req.baseUrl);
});

export default router;
