# Ola

A smooth interpolation library for Javascript numbers:

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

### `Ola({ x: 0 }, t)` Create an instance

The first parameter is the initial value. It can be either a single number, or an object of `key:numbers`:

```js
const tmp = Ola(0); // Alias of `{ value: 0 }`
const pos = Ola({ x: 0 });
```

Using a single number is the shortname of using the key `value`. It is offered for convenience, but recommend not mixing both styles in the same project.

The second parameter is how long each update will take in ms.

It works with any kind of float:

```js
console.log(Ola(100));
console.log(Ola(-100));
console.log(Ola(0.001));
console.log(Ola(1 / 100));
```

The keys can be any string you prefer, and the instances can be logged as usual:

```js
console.log(Ola({ abcd: 100 })); // { abcd: 100 }
JSON.stringify(Ola({ a: 100 })); // '{"a":100}'
```

> Note: try to keep it safe, so keep your numbers under Number.MAX_VALUE / 10

The time it takes to update can be defined per instance:

```js
// All `pos.set()` will take 1 full second
const pos = Ola({ x: 0 }, 1000);
pos.set({ x: 100 });
```

> Note: this update time is likely to change in the future

### `pos.set({ x: 10 })` Update the value

When we update a property **it is not updated instantaneously** (that's the whole point of this library), but instead it's set to update asynchronously:

```js
const pos = Ola({ x: 0 });
pos.set({ x: 100 });

// 0 - still hasn't updated
console.log(pos.x);

// 100 - after 300ms it's fully updated
setTimeout(() => console.log(pos.x), 1000);
```

You can see in this graph, the blue line is the value that is set though `.set()`, while the red line is the value that reading it returns:

<a href="https://jsfiddle.net/franciscop/oechmra8/">
  <img align="right" width="375" height="180" src="https://raw.githubusercontent.com/franciscop/ola/master/docs/line.gif">
</a>

### `pos.x` Read the value

You can read the value at any time:

```js
const pos = Ola({ x: 0 });
pos.set({ x: 100 });

setInterval(() => {
  // It will update every time it's read
  console.log(pos.x);
}, 10);
```

Every time it is read, it'll calculate it based in the current time. So there's _no need to update it_ manually.

## Smooth interpolation

If you use other libraries like TWEEN and try to update a value **while the previous transition is still ongoing** you are going to have a hard time. We are taking the position derivative (speed) at the update time so they happen smoothly:

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/franciscop/ola/master/docs/common_error_others.png">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/franciscop/ola/master/docs/common_error_ola.png">
    </td>
  </tr>
  <tr>
    <td>
      Broken interpolation **without Ola()**
    </td>
    <td>
      Smooth interpolation **with Ola()**
    </td>
  </tr>
</table>
