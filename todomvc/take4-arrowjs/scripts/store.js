import { reactive } from "https://esm.sh/@arrow-js/core";

export const store = reactive({
  items: [],
  currentFilter: "all",
});
