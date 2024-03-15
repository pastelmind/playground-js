class Range {
  constructor(from, to) {
    this._from = from ?? 1;
    this._to = to ?? 1;
  }

  _count = 0;

  get count() {
    return this._count;
  }
  // set count(x) {
  //   this._count = x;
  // }

  sayHello() {
    console.log("Range says hello");
  }

  static sayBye() {
    console.log("Range says bye");
  }
}

class SubRange extends Range {
  constructor(to) {
    super();
  }

  sayHello() {
    super.sayHello();
    console.log("SubRange says hello");
  }

  sayBye2() {
    super.sayBye();
    console.log("SubRange says bye");
  }
}

SubRange.prototype.sayBye2 = function () {
  console.log("SubRange says bye");
};

const i2 = new SubRange();
// i2.sayHello();
// i2.sayBye();
SubRange.sayBye2();
