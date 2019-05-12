// Initial value for the position; center of the container
const angle = Ola(0, 1000);

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
  output.append(new Date(), angle.value);
  requestAnimationFrame(tick);
})();

// Add a random value to each line every 1-2 seconds
(function update() {
  const to = Math.random();
  angle.value = to;
  control.append(new Date(), to);
  setTimeout(update, 1300);
})();
