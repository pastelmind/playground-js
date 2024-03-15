/**
 * 주어진 값에 최소, 최대치를 적용한다.
 * @param {number} min
 * @param {number} x
 * @param {number} max
 * @returns {number}
 */
export const clamp = (min, x, max) => Math.max(min, Math.min(x, max))

/** 두 물체가 충돌 상태인지 검사한다 */
export const checkCollide = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
