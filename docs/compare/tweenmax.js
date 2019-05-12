// Create a tween that modifies properties of obj
const obj = { x: 0 };
const angle = new TweenMax(obj, 2, { x: 100 });
//then later, update the destination x and y values, restarting the angle
angle.updateTo({ x: Math.random() }, true);
//or to update the values mid-tween without restarting, do this:
// angle.updateTo({x:300, y:0}, false);

// Double size and scale for better resolution
const canvas = document.querySelector("#graph");
canvas.width = window.innerWidth * 2;

const graph = new SmoothieChart({
  grid: { strokeStyle: "#fff", fillStyle: "#fff" },
  maxValue: 1,
  minValue: 0,
  // This makes it render a bit worse, but otherwise it's cheating
  interpolation: "step"
});
graph.streamTo(canvas, 1200);

const control = new TimeSeries();
const output = new TimeSeries();

// Add to SmoothieChart
graph.addTimeSeries(control, { strokeStyle: "rgba(0, 0, 255, 0.3)" });
graph.addTimeSeries(output, {
  strokeStyle: "rgba(255, 0, 0, 0.6)",
  lineWidth: 2
});
control.append(new Date(), 0);

(function tick() {
  output.append(new Date(), obj.x);
  requestAnimationFrame(tick);
})();

// Add a random value to each line every 1-2 seconds
(function update() {
  const to = Math.random();
  angle.updateTo({ x: to }, true);
  control.append(new Date(), to);
  setTimeout(update, 1300);
})();
