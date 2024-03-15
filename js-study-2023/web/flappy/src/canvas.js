export const canvas = document.querySelector("#canvas")

// 캔버스를 초기화한다

export const SCREEN_WIDTH = 640
export const SCREEN_HEIGHT = 480
canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT

export const drawGameOver = () => {
  const context = canvas.getContext("2d")
  context.fillStyle = "red"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = "20px sans-serif"
  context.fillText("Game over", canvas.width / 2, canvas.height / 2)
}
