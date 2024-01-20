let lastUsedId = 0;
export function makeId() {
  lastUsedId++;
  return lastUsedId;
}
