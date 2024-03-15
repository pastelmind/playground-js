const a = [1, 2, 3, 4, 5, 6, 7];

function test(arr) {
  // 각 값들을 제곱해서, 20보다 큰 값만 남기고 싶다.
  // const newArr = [];
  // for (const x of a) {
  //   const x2 = x ** 2;
  //   if (x2 > 20) {
  //     newArr.push(x2);
  //   }
  // }
  // return newArr;
  return arr.filter((x) => x * x > 20);
}

console.log(test(a));
