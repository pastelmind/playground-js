// const succeedingPromise = Promise.resolve(1);
// const rejectedPromise = Promise.reject("asdf");
// // const pendingPromise = new Promise();
// // const rejectingPromise = new Promise();

// // const nextPromise = succeedingPromise.then(
// //   (value) => value + 1
// //   // (error) => console.log("succeedingPromise error:", error)
// // );

// const nextPromise = new Promise((resolve, reject) => {
//   // succeedingPromise의 결과를 가공해야 하기 때문에
//   // then()을 호출하고, 우리가 하고 싶은 작업을
//   // 콜백 함수로 만들어서 then()의 인자로 넘긴다.
//   succeedingPromise.then((string) => {
//     // 우리가 하고 싶은 작업: 문자열을 복제하는 것이다.
//     const newString = string + string;
//     // 결과를 바로 돌려주는 게 아니라, 2초 뒤에 돌려주고 싶다.
//     // 이를 위해 setTimeout()을 호출한다.
//     setTimeout(() => resolve(newString), 2000);
//   }); // then()의 인자로 넘긴 콜백 함수의 끝
// });

const s = Promise.resolve(1);
console.log("1");
s.then(() => {
  console.log("2");
});
console.log("3");
