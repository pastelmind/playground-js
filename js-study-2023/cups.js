import readline from "node:readline/promises";
// const readline = require("node:readline/promises");

// 식별자 (identifier)
// 식 (expression)
// 문 (statement)

// 식 -> 식
// 식 -> 문 (o)
// 문 -> 식 (x)

// 오류:
// - 문법 오류
// - 런타임 (실행) 오류

// a = 2

// let a = obj["a"]
// let a = obj["a" + "b"]

// obj.a     // 'a'라는 속성을 찾아!
// obj["a"]  // 'a'라는 속성을 찾아!

// obj.0a    // 문법 오류
// obj['0a'] // '0a'라는 속성을 찾아!

const ROOMS = {
  brightRoom: {
    description:
      "밝은 방이다. 바닥에 물이 흥건하게 고여 있다. 물을 바라보니 어렴풋이 내 모습이 비쳐보인다.",
    s: "darkRoom",
    e: () => {
      console.log("아야! 벽에 머리를 박았다.");

      switchHitCount++;
      if (switchHitCount <= 1) {
        console.log("음? 이 벽 뒤에 뭔가 있는 것 같다.");
      } else if (switchHitCount === 2) {
        console.log("머리가 아프지만 한번 더 해볼 만한 것 같다.");
      } else if (switchHitCount === 3) {
        isSwitchActivated = true;
        console.log("뭐지? 어두운 방에서 큰 소리가 났다.");
      } else {
        console.log("이제 머리만 아프다. 다른 걸 해보자.");
      }
    },
  },
  darkRoom: {
    description: () => {
      console.log("어두운 방이다. 축축한 냄새가 난다.");
      if (isSwitchActivated) {
        console.log("앗! 물이 담긴 컵이 있다. 얼른 마셔야지.");
        console.log("*꿀꺽* ".repeat(3));
        thirst += 1000; // 물 마신 직후에 목마름이 0이 되어 죽는 걸 방지
        isVictory = true;
      }
    },
    n: "brightRoom",
  },
};

let currentRoom = ROOMS.brightRoom;
let thirst = 10;
let bonkCount = 0;
let switchHitCount = 0;
let isSwitchActivated = false;
let isVictory = false;

async function main() {
  while (true) {
    console.log(); // 빈 줄 출력

    if (manageThirst() === END_GAME) return;

    // 방을 묘사한다
    const description = currentRoom.description;
    if (typeof description === "function") {
      description();
    } else {
      console.log(description);
    }

    if (isVictory) {
      console.log("-".repeat(20));
      console.log("축하합니다! 물을 마셨습니다.");
      console.log("게임 끝.");
      return;
    }

    let message = await rl.question("어떻게 할까? [n/s/e/w]: ");
    message = message.trim().toLowerCase();

    if (message === "끝" || message === "exit") {
      console.log("게임 끝.");
      return;
    }

    if (message === "동") message = "e";
    if (message === "서") message = "w";
    if (message === "남") message = "s";
    if (message === "북") message = "n";

    // 다른 방으로 이동
    if ("nsew".includes(message)) {
      const hint = currentRoom[message];
      if (typeof hint === "function") {
        hint();
      } else if (hint in ROOMS) {
        currentRoom = ROOMS[hint];
      } else {
        console.log("아야! 벽에 머리를 박았다.");
        bonkCount++;
      }
      continue;
    }

    console.log("미안해. 그건 할 수 없어.");
  }
}

const END_GAME = "END_GAME";
const CONTINUE_GAME = "CONTINUE_GAME";

function manageThirst() {
  thirst--;
  // 목마름을 묘사한다.
  if (thirst === 7) {
    console.log("목이 타들어간다...");
  }
  if (thirst === 4) {
    console.log("너무 목이 말라. 죽고 싶어");
  }
  if (thirst === 3) {
    console.log("살려줘. 살려줘.");
  }
  if (thirst === 2) {
    console.log("살려줘. 살려줘.");
  }
  if (thirst === 1) {
    console.log("살려줘. 살려줘. 살려줘. 살려줘. 살려줘. 살려줘. 살려줘.");
  }
  if (thirst === 0) {
    console.log("-".repeat(20));
    console.log("당신은 물을 마시지 못해 죽었습니다.");
    return END_GAME;
  }

  return CONTINUE_GAME;
}

const rl = readline.createInterface(process.stdin, process.stdout);
await main();
rl.close();
// main().then(() => rl.close());
