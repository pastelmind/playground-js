// import subtract from "./library.js";

import("./library.js").then((module) => {
  const { add } = module;
  console.log(add(1, 2));
});

console.log("app.js:", import.meta.url);
