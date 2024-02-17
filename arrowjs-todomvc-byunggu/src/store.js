import { reactive } from "https://esm.sh/@arrow-js/core";

export const store = reactive({
  items: [],
  /** all, completed, active 셋 중에 하나 */
  currentFilter: "all",
});

let lastUsedId = 0;

export function getNextId() {
  ++lastUsedId;
  return lastUsedId;
}
