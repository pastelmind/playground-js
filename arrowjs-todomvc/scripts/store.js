import { reactive } from "https://esm.sh/@arrow-js/core";

export const store = reactive({
  items: [],
  currentFilter: "all",
});

let lastUsedId = 0;

export function getNextId() {
  ++lastUsedId;
  return lastUsedId;
}
