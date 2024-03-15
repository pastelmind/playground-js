/** 이미지를 로딩하고 완전히 디코딩한다 */
const loadImage = async (src) => {
  const img = new Image()
  img.src = src
  await img.decode()
  return img
}

export let assets = {}

export const loadAssets = async () => {
  assets = {
    bird1: await loadImage("./assets/bird/bird-1.png"),
    bird2: await loadImage("./assets/bird/bird-2.png"),
    enemy: [
      await loadImage("./assets/enemy/enemy-00.png"),
      await loadImage("./assets/enemy/enemy-01.png"),
      await loadImage("./assets/enemy/enemy-02.png"),
      await loadImage("./assets/enemy/enemy-03.png"),
      await loadImage("./assets/enemy/enemy-04.png"),
      await loadImage("./assets/enemy/enemy-05.png"),
      await loadImage("./assets/enemy/enemy-06.png"),
      await loadImage("./assets/enemy/enemy-07.png"),
      await loadImage("./assets/enemy/enemy-08.png"),
      await loadImage("./assets/enemy/enemy-09.png"),
      await loadImage("./assets/enemy/enemy-10.png"),
      await loadImage("./assets/enemy/enemy-11.png"),
      await loadImage("./assets/enemy/enemy-12.png"),
      await loadImage("./assets/enemy/enemy-13.png"),
      await loadImage("./assets/enemy/enemy-14.png"),
      await loadImage("./assets/enemy/enemy-15.png"),
      await loadImage("./assets/enemy/enemy-16.png"),
    ],
  }
}
