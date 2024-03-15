import { assets } from "./assets.js"

export class Enemy {
  x = 0
  y = 0
  vx = 1
  vy = 1
  width = 150
  height = 100

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

  draw(context, tick) {
    const image = assets.enemy[tick % assets.enemy.length]
    context.drawImage(image, this.left, this.top, this.width, this.height)
  }

  update(tick) {
    // 위치 업데이트
    this.x += this.vx
    this.y += this.vy
  }
}

export const enemy = new Enemy()
