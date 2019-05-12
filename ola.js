// Handle a single dimension
function Single(init, time) {
  this.start = new Date() / 1000;
  this.time = time;
  this.from = init;
  this.current = init;
  this.to = init;
  this.speed = 0;
}

// const x_const = (x0, v0, t1, t) => {
//   const a = (2 * x0) / t1 ** 3;
//   const b = -(3 * x0) / t1 ** 2;
//   const c = 0;
//   const d = x0;
//   return a * t ** 3 + b * t ** 2 + c * t + d;
// };

const position = (x0, v0, t1, t) => {
  const a = (v0 * t1 + 2 * x0) / t1 ** 3;
  const b = -(2 * v0 * t1 + 3 * x0) / t1 ** 2;
  const c = v0;
  const d = x0;
  return a * t ** 3 + b * t ** 2 + c * t + d;
};

const speed = (x0, v0, t1, t) => {
  const a = (v0 * t1 + 2 * x0) / t1 ** 3;
  const b = -(2 * v0 * t1 + 3 * x0) / t1 ** 2;
  const c = v0;
  const d = x0;
  return 3 * a * t ** 2 + 2 * b * t + c;
};

Single.prototype.get = function() {
  const t = new Date() / 1000 - this.start;
  if (t >= this.time) {
    return this.to;
  }
  return this.to - position(this.to - this.from, this.speed, this.time, t);
};

Single.prototype.getSpeed = function() {
  const t = new Date() / 1000 - this.start;
  if (t >= this.time) {
    return 0;
  }
  return speed(this.to - this.from, this.speed, this.time, t);
};

Single.prototype.set = function(value, time) {
  const current = this.get();
  this.speed = this.getSpeed();
  this.start = new Date() / 1000;
  this.from = current;
  this.to = value;
  return current;
};

// The multidimensional constructor, makes a { value: init } if it's 1D
function Ola(values, time = 300) {
  if (!(this instanceof Ola)) {
    return new Ola(values, time);
  }

  // Loop over the first argument
  this.each(values, (init, key) => {
    const value = new Single(init, time / 1000);
    // But we are not interested in it; instead, set it as a ghost
    Object.defineProperty(this, "_" + key, { value });
    Object.defineProperty(this, key, {
      get: () => value.get(), // pos.x
      set: val => value.set(val), // pos.x = 10
      enumerable: true
    });
  });
}

// pos.get('x')
Ola.prototype.get = function(name = "value") {
  return this[name];
};

// pos.set(10)
// pos.set({ x: 10 })
// pos.set({ x: 10 }, time)
Ola.prototype.set = function(values, ...args) {
  this.each(values, (value, key) => {
    this["_" + key].set(value, ...args);
  });
};

Ola.prototype.each = function(values, cb) {
  const multi = typeof values === "number" ? { value: values } : values;
  Object.entries(multi).map(([key, value]) => cb(value, key));
};

export default Ola;
