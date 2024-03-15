import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./canvas.js"

export class Column {
  /** 기둥의 종류 */
  type = Math.random() > 0.5 ? "top" : "bottom"
  /** 위치 */
  x = SCREEN_WIDTH // 항상 오른쪽 끝에 생성된다
  /** 기둥의 속도 (왼쪽으로 움직이므로 음수) */
  vx = -10
  width = 30
  height = Math.random() * canvas.height * 0.7

  get left() {
    return this.x - this.width / 2
  }
  get right() {
    return this.x + this.width / 2
  }
  get top() {
    return this.type === "top" ? 0 : SCREEN_HEIGHT - this.height
  }
  get bottom() {
    return this.type === "top" ? this.height : SCREEN_HEIGHT
  }

  draw(context, tick) {
    context.fillStyle = "#cccccc"
    context.fillRect(this.left, this.top, this.width, this.height)
  }

  update(tick) {
    this.x += this.vx
  }
}

/** 기둥 사이 간격 (틱수) */
const TICKS_PER_COLUMN = 40

export let columns = []

/** 매 틱마다 실행된다 */
export const updateColumns = (tick) => {
  // 일정 틱마다 기둥 생성
  if (tick % TICKS_PER_COLUMN === 0) {
    columns.push(new Column())
  }

  // 모든 기둥을 왼쪽으로 옮긴다
  for (const column of columns) {
    column.update(tick)
  }

  // 맵 바깥으로 벗어난 기둥은 제거한다
  columns = columns.filter((column) => column.x >= 0)
}

export const drawColumns = (context, tick) => {
  for (const column of columns) {
    column.draw(context, tick)
  }
}
