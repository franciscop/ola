# Ola

Smooth animation library for [inbetweening](https://en.wikipedia.org/wiki/Inbetweening) / [interpolating](https://en.wikipedia.org/wiki/Interpolation_(computer_graphics) numbers:

<a href="https://jsfiddle.net/franciscop/oechmra8/">
  <img align="right" width="375" height="180" src="https://raw.githubusercontent.com/franciscop/ola/master/docs/line.gif">
</a>

```js
// Initialize it to 0
const temp = Ola(0);

// Set the value randomly (async)
temp.set(100);

// Log the values from 0 to 100
setInterval(() => {
  console.log(temp.value);
}, 10);
```

It works with multiple values/dimensions:

<a href="https://jsfiddle.net/franciscop/oLw01smr/">
  <img align="right" width="375" height="180" src="https://raw.githubusercontent.com/franciscop/ola/master/docs/ball.gif">
</a>

```js
// Initialize it to origin
const pos = Ola({ x: 0, y: 0 });

// Set both values to 100 (async)
pos.set({ x: 100, y: 100 });

// Log how the values evolve
setInterval(() => {
  console.log(pos.x, pos.y);
}, 10);
```

> Tip: click on the GIFs for a live demo with the code :)

## Getting started

Install it with npm:

```
npm install ola
```

Then import it and use it:

```js
import Ola from "ola";
const pos = Ola({ x: 0 });
console.log(pos.x); // 0
```

If you prefer to use a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ola"></script>
<script type="text/javascript">
  const pos = Ola({ x: 0 });
  console.log(pos.x); // 0
</script>
```

## Documentation

There are three distinct operations that can be run: creating an instance, setting it to update and reading it.

### Create an instance

```js
Ola(initial_value, (time = 300));
```

The first parameter is the initial value. It can be either a single number, or an object of `key:numbers`:

```js
const heater = Ola(20); // Alias of `{ value: 0 }`
const motor = Ola({ angle: 180 }); // A named object for convenience
const position = Ola({ x: 0, y: 0 }); // Any number of properties
```

The second parameter is how long the transition will last. It should be a number that represents the time in milliseconds:

```js
const heater = Ola(20, 300); // Default = 300 ms
const motor = Ola({ angle: 180 }, 1000); // Turn the motor slowly
const position = Ola({ x: 0, y: 0 }, 100); // Very quick movements
```

Passing a single number as a parameter is the same as passing `{ value: num }`, we are just helping by setting a shortname. It is offered for convenience, but recommend not mixing both styles in the same project.

It works with Javascript numbers, but please keep things reasonable (under `Number.MAX_VALUE / 10`):

```js
console.log(Ola(100));
console.log(Ola(-100));
console.log(Ola(0.001));
console.log(Ola(1 / 100));
```

The time it takes to update can also be updated while setting the value:

```js
// All `pos.set()` will take 1 full second
const pos = Ola({ x: 0 }, 1000);
pos.set({ x: 100 }, 3000);
```

### Update the value

```js
heater.value = 25; // Since the constructor used a number, use `.value`
motor.angle = 90; // Turn -90 degrees
position.set({ x: 100, y: 100 }); // Move 0,0 => 100,100
```

When we update a property **it is not updated instantaneously** (that's the whole point of this library), but instead it's set to update asynchronously:

```js
const pos = Ola({ x: 0 });
pos.set({ x: 100 });

// 0 - still hasn't updated
console.log(pos.x);

// 100 - after 300ms it's fully updated
setTimeout(() => console.log(pos.x), 1000);
```

Remember that if you set the value as `Ola(10)`, this is really an alias for `Ola({ value: 10 })`, so use the property `.value` to update it:

```js
heater.value = 25;
heater.set({ value: 25 });
```

You can see in this graph, the blue line is the value that is set though `.set()`, while the red line is the value that reading it returns:

<a href="https://jsfiddle.net/franciscop/oechmra8/">
  <img width="375" height="180" src="https://raw.githubusercontent.com/franciscop/ola/master/docs/line.gif">
</a>

### Read the value

```js
log(heater.value); // Since the constructor used a number, use `.value`
log(motor.angle); // Read as an object property
log(position.get("x")); // Find the X value
```

You can read the value at any time, and the value will be calculated at that moment in time:

```js
const pos = Ola({ x: 0 });
pos.set({ x: 100 });

setInterval(() => {
  // It will update every time it's read
  console.log(pos.x);
}, 10);
```

In contrast to other libraries, there's no need to tick/update the function every N ms or before reading the value, since `Ola()` uses math functions you should just read it when needed.

## Features

While there are some other great libraries like Tween, this one has some improvements:

### Smooth interpolation

With other libraries when updating a value **while the previous transition is still ongoing** you are going to have a hard time. We are taking the position derivative (speed) at the update time so they happen smoothly:

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/franciscop/ola/master/docs/smooth_ola.png">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/franciscop/ola/master/docs/smooth_tweenmax.png">
    </td>
  </tr>
  <tr>
    <td>
      Smooth interpolation <strong>with Ola()</strong>
    </td>
    <td>
      Broken interpolation <strong>with Tweenmax</strong>
    </td>
  </tr>
</table>

Status of libraries updating animation mid-way:

- Ola.js (this) - working smoothly, see above.
- TweenMax - Supported natively, but the transition is. See screenshot above.
- Tween.js - Proposed API, but not implemented: https://github.com/tweenjs/tween.js/issues/257
- [**Open an Issue**](https://github.com/franciscop/ola/issues/new) with other libraries that you know.

### Lazy loading

Since this is driven by mathematical equations, the library doesn't calculate any value until it needs to be read/updated. It will also _only_ change the one we need instead of all of the values:

```js
const position = Ola({ x: 0, y: 0 });
position.x = 10; // Only updates X
console.log(position.x); // Calculates only X position, not y
```

Not only this is great for performance, but it also makes for a clean self-contained API where each instance is independent.
