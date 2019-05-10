// https://gist.github.com/gre/1650294
const timings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};

// Handle a single dimension
function Single(init, time, timing) {
  this.start = new Date();
  this.time = time;
  this.timing = typeof timing === "string" ? timings[timing] : timing;
  this.from = init;
  this.current = init;
  this.to = init;
}

Single.prototype.get = function() {
  const t = Math.min((new Date() - this.start) / this.time, 1);
  const perc = this.timing(t);
  this.current = this.from + (this.to - this.from) * perc;
  return this.current;
};

Single.prototype.set = function(value, time, timing) {
  const current = this.get();
  this.start = new Date();
  this.from = current;
  this.to = value;
  if (time) {
    this.time = time;
  }
  if (timing) {
    this.timing = typeof timing === "string" ? timings[timing] : timing;
  }
  return current;
};

// The multidimensional constructor, makes a { value: init } if it's 1D
function Ola(values, time = 300, timing = "easeInOutQuad") {
  if (!(this instanceof Ola)) {
    return new Ola(values, time, timing);
  }

  // Loop over the first argument
  this.each(values, (init, key) => {
    const value = new Single(init, time, timing);
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
