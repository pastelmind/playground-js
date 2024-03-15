// let x = 100;
function main(a, b, c, d) {
  console.log("Sum is", a + b + c + d + this.value);
}

const obj = { value: 5 };
// obj.main = main;

// obj.main(3, 5, 6, 7);
main.apply(obj, [3, 5, 6, 7]);
