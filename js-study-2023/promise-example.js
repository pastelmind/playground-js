const p = new Promise(myFunc);

p.then(
  (value) => {
    console.log(value);
  },
  (error) => {}
);

function myFunc(resolve, reject) {
  resolve(1);
  reject(new Error("asdf"));
}
