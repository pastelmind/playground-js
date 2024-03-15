function Range(from, to) {
  console.log("Range being constructed");
  this._from = from;
  this._to = to;
}

Range.prototype.includes = function (x) {
  return this._from <= x && x <= this._to;
};

Range.sayHello = function () {
  console.log("Hello");
};

// const i1 = new Range(10, 30);

function SubRange(from, to) {
  Range.call(this, from, to);
}

SubRange.prototype = Object.create(Range.prototype);
// Object.setPrototypeOf(SubRange.prototype, Range.prototype);

// Object.getPrototypeOf(SubRange.prototype) === Range.prototype

// i2 -> SubRange.prototype -> Range.prototype -> Object.prototype

const i2 = new SubRange(10, 20);
i2.includes();
// console.log(i2.hasOwnProperty("_from"));

// Object.setPrototypeOf(SubRange, Range);
// SubRange.sayHello();
// console.log(Object.getPrototypeOf(SubRange));

// new 키워드가 하는 일:

// 1. new 키워드 오른쪽에 오는 함수를 '생성자'로 호출한다. // MyClass
// 2. 이때 새로운 객체를 하나 만든다.
// 2.1 생성자의 'prototype' 속성을 읽어서, 그 속성을 새로 만든 객체의 프로토타입으로 지정한다.
//    const p = MyClass.prototype
//    const x = Object.create(p)
// 3 생성자로 호출된 함수 내부에서, this와 new.target은 특별한 의미를 갖는다.
// 4 생성자를 실행하고 나서, 1.1에서 만든 객체를 돌려준다.
// Range.sayHello = 1;
// console.log(Object.getPrototypeOf(Range.sayHello) === Function.prototype);
