import readline from "node:readline/promises";

export function runMain(fn) {
  (async () => {
    const rl = readline.createInterface(process.stdin, process.stdout);
    try {
      await fn(rl);
    } finally {
      rl.close();
    }
  })().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

// const readline = require("node:readline/promises");

// module.exports = function runMain(fn) {
//   (async () => {
//     const rl = readline.createInterface(process.stdin, process.stdout);
//     try {
//       await fn(rl);
//     } finally {
//       rl.close();
//     }
//   })().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });
// };
