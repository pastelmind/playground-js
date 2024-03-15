import { bird } from "./bird.js"
import { canvas } from "./canvas.js"
import { columns, drawColumns, updateColumns } from "./columns.js"
import { enemy } from "./enemy.js"

/** 틱을 처리한다 */
export const processTick = (currentTick) => {
  const context = canvas.getContext("2d")

  // 캔버스 지움
  context.clearRect(0, 0, canvas.width, canvas.height)

  // 게임 상태 업데이트
  bird.update(currentTick)
  enemy.update(currentTick)
  updateColumns(currentTick)

  // 물체를 그린다
  // 나중에 그린 물체가 위에 그려진다
  drawColumns(context, currentTick)
  enemy.draw(context, currentTick)
  bird.draw(context, currentTick)

  // 충돌 체크
  if (bird.checkCollision(columns)) {
    return false
  }
  if (bird.checkCollision([enemy])) {
    return false
  }

  return true
}
