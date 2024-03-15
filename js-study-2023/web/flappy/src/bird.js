import { assets } from "./assets.js"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./canvas.js"
import { checkCollide, clamp } from "./util.js"

// 주의사항:
// VY가 양수 = 떨어짐
// VY가 음수 = 올라감

const BIRD_VY_BONUS_PER_CLICK = -10 // 클릭할 때마다 속도에 더해짐

export class Bird {
  /** 위치 */
  x = SCREEN_WIDTH / 4 // 왼쪽에 좀더 가깝게 하자
  /** 위치 */
  y = SCREEN_HEIGHT / 2
  /** 올라가는 최대 속도 */
  VY_MIN = -15
  /** 떨어지는 최대 속도 */
  VY_MAX = 15
  /** y축 속도 */
  vy = 0
  /** y축 가속도 */
  ay = 1
  /** 충돌 박스 너비 */
  width = 50
  /** 충돌 박스 높이 */
  height = 50
  /** 이미지 너비 */
  imageWidth = 100
  /** 이미지 높이 */
  imageHeight = 100

  get left() {
    return this.x - this.width / 2
  }
  get right() {
    return this.x + this.width / 2
  }
  get top() {
    return this.y - this.height / 2
  }
  get bottom() {
    return this.y + this.height / 2
  }

  constructor() {
    // 문서 클릭 시 새의 속도를 높인다
    document.body.addEventListener("click", () => {
      this.vy += BIRD_VY_BONUS_PER_CLICK
    })
  }

  draw(context, tick) {
    // 새가 날갯짓하는 것을 구현
    const birdImage =
      Math.floor(tick / 3) % 2 === 0 ? assets.bird1 : assets.bird2
    context.drawImage(
      birdImage,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight
    )
  }

  update(tick) {
    // 속도 업데이트
    this.vy = clamp(this.VY_MIN, this.vy + this.ay, this.VY_MAX)

    // 위치 업데이트
    this.y = clamp(0, this.y + this.vy, SCREEN_HEIGHT)

    // 천장이나 바닥일 땐 속도 0
    if (this.y === 0 || this.y === SCREEN_HEIGHT) {
      this.vy = 0
    }
  }

  checkCollision(objects) {
    return objects.some((obj) => checkCollide(obj, this))
  }
}

export const bird = new Bird()
