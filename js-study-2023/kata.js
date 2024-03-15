import * as assert from "node:assert/strict";

function pickPeaks(arr) {
  const candidates = arr.reduceRight((candidates, value, index, arr) => {
    console.log(`Checking index = ${index}, value = ${value}`);

    if (index === arr.length - 1) {
      candidates.push(index);
    } else if (arr[index] >= arr[index + 1]) {
      if (candidates.at(-1) === index + 1) {
        candidates[candidates.length - 1] = index;
      } else {
        candidates.push(index);
      }
    }

    console.log(`Candidate array became %s`, candidates);

    return candidates;
  }, []);

  if (arr[0] === arr[candidates.at(-1)]) {
    candidates.pop();
  }
  if (arr.at(-1) === arr[candidates[0]]) {
    candidates.shift();
  }
  candidates.reverse();

  return { pos: candidates, peaks: candidates.map((index) => arr[index]) };
}

// assert.deepEqual(pickPeaks([1, 2, 3, 6, 4, 1, 2, 3, 2, 1]), {
//   pos: [3, 7],
//   peaks: [6, 3],
// });
// assert.deepEqual(pickPeaks([3, 2, 3, 6, 4, 1, 2, 3, 2, 1, 2, 3]), {
//   pos: [3, 7],
//   peaks: [6, 3],
// });
// assert.deepEqual(pickPeaks([3, 2, 3, 6, 4, 1, 2, 3, 2, 1, 2, 2, 2, 1]), {
//   pos: [3, 7, 10],
//   peaks: [6, 3, 2],
// });
// assert.deepEqual(pickPeaks([2, 1, 3, 1, 2, 2, 2, 2, 1]), {
//   pos: [2, 4],
//   peaks: [3, 2],
// });
// assert.deepEqual(pickPeaks([2, 1, 3, 1, 2, 2, 2, 2]), { pos: [2], peaks: [3] });
// assert.deepEqual(pickPeaks([2, 1, 3, 2, 2, 2, 2, 5, 6]), {
//   pos: [2],
//   peaks: [3],
// });
// assert.deepEqual(pickPeaks([2, 1, 3, 2, 2, 2, 2, 1]), { pos: [2], peaks: [3] });
assert.deepEqual(
  pickPeaks([
    1, 2, 5, 4, 3, 2, 3, 6, 4, 1, 2, 3, 3, 4, 5, 3, 2, 1, 2, 3, 5, 5, 4, 3,
  ]),
  { pos: [2, 7, 14, 20], peaks: [5, 6, 5, 5] }
);
assert.deepEqual(pickPeaks([]), { pos: [], peaks: [] });
assert.deepEqual(pickPeaks([1, 1, 1, 1]), { pos: [], peaks: [] });
