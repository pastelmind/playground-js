import { loadAssets } from "./assets.js"
import { drawGameOver } from "./canvas.js"
import { processTick } from "./loop.js"

// 게임 루프 처리

// 1틱에 쓰는 시간
// 우리는 30FPS를 목표로 하고 있으므로 1000 / 30 ~= 33을 쓴다
const TICK = 33
/** 틱으로 처리한 시간 */
let lastTickTime = 0
/** 지금까지 처리한 틱의 갯수 */
let tickCount = 0

// timestamp는 밀리초 단위이다
const gameLoop = (timestamp) => {
  // 게임 시작 시에 timestamp가 0이 아니기 때문에 시작 시간을 강제로 동기화한다
  if (lastTickTime === 0) {
    lastTickTime = timestamp
  }

  while (lastTickTime <= timestamp) {
    lastTickTime += TICK
    const result = processTick(tickCount)
    if (!result) {
      drawGameOver()
      return
    }
    ++tickCount
  }

  requestAnimationFrame(gameLoop)
}

// 게임 시작
await loadAssets()
requestAnimationFrame(gameLoop)
