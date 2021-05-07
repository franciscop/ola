// Calculate the position based on the current position, speed and time:
//  https://www.wolframalpha.com/input/?i=x+%3D+2+*+t+%5E+3+-+3+*+t+%5E+2+%2B+1+from+t+%3D+0+to+t+%3D+1
const position = (x0, v0, t1, t) => {
  const a = (v0 * t1 + 2 * x0) / t1 ** 3;
  const b = -(2 * v0 * t1 + 3 * x0) / t1 ** 2;
  const c = v0;
  const d = x0;
  return a * t ** 3 + b * t ** 2 + c * t + d;
};

// Calculate the speed based on the current position, speed and time:
const speed = (x0, v0, t1, t) => {
  const a = (v0 * t1 + 2 * x0) / t1 ** 3;
  const b = -(2 * v0 * t1 + 3 * x0) / t1 ** 2;
  const c = v0;
  const d = x0;
  return 3 * a * t ** 2 + 2 * b * t + c;
};

// Loop it in different ways
const each = function(values, cb) {
  const multi = typeof values === "number" ? { value: values } : values;
  Object.entries(multi).map(([key, value]) => cb(value, key));
};

// Handle a single dimension
function Single(init, time) {
  this.start = new Date() / 1000;
  this.time = time;
  this.from = init;
  this.current = init;
  this.to = init;
  this.speed = 0;
}

Single.prototype.get = function(now) {
  const t = now / 1000 - this.start;
  if (t < 0) {
    throw new Error("Cannot read in the past");
  }
  if (t >= this.time) {
    return this.to;
  }
  return this.to - position(this.to - this.from, this.speed, this.time, t);
};

Single.prototype.getSpeed = function(now) {
  const t = now / 1000 - this.start;
  if (t >= this.time) {
    return 0;
  }
  return speed(this.to - this.from, this.speed, this.time, t);
};

Single.prototype.set = function(value, time) {
  const now = new Date();
  const current = this.get(now);
  this.speed = this.getSpeed(now);
  this.start = now / 1000;
  this.from = current;
  this.to = value;
  if (time) {
    this.time = time;
  }
  return current;
};

// The multidimensional constructor, makes a { value: init } if it's 1D
function Ola(values, time = 300) {
  // This is just an alias
  if (typeof values === "number") {
    values = { value: values };
  }

  // Loop over the first argument
  each(values, (init, key) => {
    const value = new Single(init, time / 1000);
    // But we are not interested in it; instead, set it as a ghost
    Object.defineProperty(values, "_" + key, { value });   // pos._x.to, pos._x.speed, ...
    Object.defineProperty(values, "$" + key, { value: value.to });   // pos.$x
    Object.defineProperty(values, key, {
      get: () => value.get(new Date()), // pos.x
      set: val => value.set(val), // pos.x = 10
      enumerable: true
    });
  });

  // pos.get('x')
  Object.defineProperty(values, "get", {
    get: () =>
      function(name = "value", now = new Date()) {
        return this["_" + name].get(now);
      }
  });

  // pos.set(10)
  // pos.set({ x: 10 })
  // pos.set({ x: 10 }, time)
  Object.defineProperty(values, "set", {
    get: () =>
      function(values, time = 0) {
        each(values, (value, key) => {
          this["_" + key].set(value, time / 1000);
        });
      }
  });

  // So that you can use the original methods
  return values;
}

export default Ola;
