import Ola from "./ola";

const delay = (time = 300) => new Promise(done => setTimeout(done, time));

// 10% of approximation by default
expect.extend({
  toApproximate: (a, b, perc = 0.1) => {
    const pass = Math.abs((a - b) / b) <= perc;
    return {
      pass,
      message: () => `"${a}" ${pass ? "should" : "does not"} approximate "${b}"`
    };
  }
});

describe("Ola", () => {
  it("is defined", () => {
    expect(Ola).toBeDefined();
  });
});

describe("Ola(0)", () => {
  it("can be initialized", () => {
    expect(Ola(0)).toBeDefined();
  });

  it("can read the value", async () => {
    const pos = Ola(0);
    expect(pos.value).toBe(0);
    expect(pos.get("value")).toBe(0);
    expect(pos).toEqual({ value: 0 });
    expect(JSON.stringify(pos)).toBe('{"value":0}');
  });

  it("can update the value", async () => {
    const pos = Ola(0);
    pos.value = 100;
    await delay();

    expect(pos.value).toBe(100);
    expect(pos.get("value")).toBe(100);
    expect(pos).toEqual({ value: 100 });
    expect(JSON.stringify(pos)).toBe('{"value":100}');
  });

  it("can use negative numbers", async () => {
    const pos = Ola(-10);
    pos.value = -100;
    await delay();

    expect(pos.value).toBe(-100);
    expect(pos.get("value")).toBe(-100);
    expect(pos).toEqual({ value: -100 });
    expect(JSON.stringify(pos)).toBe('{"value":-100}');
  });

  it("can update the value with .set()", async () => {
    const pos = Ola(0);
    pos.set(100);
    await delay();

    expect(pos.value).toBe(100);
    expect(pos.get("value")).toBe(100);
    expect(pos).toEqual({ value: 100 });
    expect(JSON.stringify(pos)).toBe('{"value":100}');
  });
});

describe("Ola({ x: 0 })", () => {
  it("can be initialized", () => {
    expect(Ola({ x: 0 })).toEqual({ x: 0 });
  });

  it("can read the value", () => {
    const pos = Ola({ x: 0 });
    expect(pos.x).toBe(0);
    expect(pos.get("x")).toBe(0);
    expect(pos).toEqual({ x: 0 });
    expect(JSON.stringify(pos)).toBe('{"x":0}');
  });

  it("can update the value", async () => {
    const pos = Ola({ x: 0 });
    pos.x = 100;
    await delay();

    expect(pos.x).toBe(100);
    expect(pos.get("x")).toBe(100);
    expect(pos).toEqual({ x: 100 });
    expect(JSON.stringify(pos)).toBe('{"x":100}');
  });

  it("can use negative numbers", async () => {
    const pos = Ola({ x: -10 });
    pos.x = -100;
    await delay();

    expect(pos.x).toBe(-100);
    expect(pos.get("x")).toBe(-100);
    expect(pos).toEqual({ x: -100 });
    expect(JSON.stringify(pos)).toBe('{"x":-100}');
  });

  it("can update the value with .set()", async () => {
    const pos = Ola({ x: 0 });
    pos.set({ x: 100 });
    await delay();

    expect(pos.x).toBe(100);
    expect(pos.get("x")).toBe(100);
    expect(pos).toEqual({ x: 100 });
    expect(JSON.stringify(pos)).toBe('{"x":100}');
  });
});
