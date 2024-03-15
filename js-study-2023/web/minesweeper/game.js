export const CELL_COUNT = 100;
export const BOMB_COUNT = 10;

// 각 셀의 상태를 나타낸다.
// { isBomb: true/false, isOpen: true/false, hasFlag: true/false }
export const gameMap = [];

export function handleButtonClick(i) {
  if (!gameMap[i].isOpen) {
    openCell(i);
  }
}

function getNearbyCellIndexes(i) {
  const x = i % 10;
  const y = Math.floor(i / 10);

  const indexes = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue;
      indexes.push(ny * 10 + nx);
    }
  }

  return indexes;
}

function getNearbyBombCount(i) {
  let count = 0;
  for (const n of getNearbyCellIndexes(i)) {
    if (gameMap[n].isBomb) count++;
  }
  return count;
}

function openAllCells() {
  for (let j = 0; j < CELL_COUNT; j++) {
    openCell(j, true);
  }
}

function openNearbyCellsIfEmpty(i) {
  if (!gameMap[i].isBomb && getNearbyBombCount(i) === 0) {
    for (const n of getNearbyCellIndexes(i)) {
      openCell(n);
    }
  }
}

function openCell(i, noOpenAll) {
  const cell = gameMap[i];
  if (cell.isOpen) return;

  cell.isOpen = true;
  if (cell.isBomb) {
    cell.button.textContent = "💥";
    // 모든 셀을 연다
    if (!noOpenAll) {
      openAllCells();
    }
  } else {
    cell.button.textContent = String(getNearbyBombCount(i));
    // 주변의 셀을 연쇄적으로 연다
    if (!noOpenAll) {
      openNearbyCellsIfEmpty(i);
    }
  }
}

export function updateResult() {
  const result = document.getElementById("result");

  let openCount = 0;
  for (let i = 0; i < CELL_COUNT; i++) {
    const cell = gameMap[i];
    if (cell.isOpen) openCount++;
  }

  result.textContent = `${openCount} / ${CELL_COUNT} cells open (${BOMB_COUNT} bombs)`;
}

export function uselessFunction() {}
