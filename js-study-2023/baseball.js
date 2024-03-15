import readline from "node:readline/promises";

const rl = readline.createInterface(process.stdin, process.stdout);

const solution = "5184";

console.log("야구게임을 하자!");
let guesses = 0;

while (true) {
  const answer = await rl.question("맞춰봐: ");

  if (answer.length !== 4) {
    console.log("숫자는 4자리여야 해.");
    continue;
  }

  guesses++;
  let strikes = 0;
  let balls = 0;
  for (let i = 0; i < answer.length; i++) {
    const ch = answer[i];
    if (solution[i] === ch) {
      strikes++;
    } else if (solution.includes(ch)) {
      balls++;
    }
  }

  let outcome = "";
  if (strikes > 0) {
    outcome += strikes + "스트라이크 ";
  }
  if (balls > 0) {
    outcome += balls + "볼 ";
  }
  if (strikes === 0 && balls === 0) {
    outcome = "아웃";
  }

  if (strikes === 4) {
    console.log("축하해! %d번만에 답을 맞췄어.", guesses);
    break;
  } else {
    console.log(outcome);
  }
}

rl.close();
