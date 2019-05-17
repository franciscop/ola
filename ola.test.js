import Ola from "./ola";

const delay = (time = 400) => new Promise(done => setTimeout(done, time));

// 10% of approximation by default
expect.extend({
  toApproximate: (a, b, perc = 0.1) => {
    const pass = a === 0 || b === 0 ? a === b : Math.abs((a - b) / b) <= perc;
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

  it("can read the future", () => {
    const pos = Ola(0);
    pos.value = 100;
    const now = new Date().getTime();
    expect(Math.round(pos.get("value", now))).toBe(0);
    expect(pos.get("value", now + 150)).toApproximate(50);
    expect(pos.get("value", now + 400)).toApproximate(100);
  });

  it("cannot read the past", () => {
    const pos = Ola(0);
    const now = new Date().getTime();
    expect(() => pos.get("value", now - 100)).toThrowError(/past/);
  });

  it("unfortunately has inconsistencies", async () => {
    const pos = Ola(0);
    const now = new Date().getTime();
    await delay(200);
    expect(() => pos.get("value", now)).not.toThrowError(/past/);
  });
});

describe("Ola(0)", () => {
  it("can be initialized", () => {
    expect(Ola(0)).toBeDefined();
  });

  it("can read the value", async () => {
    const pos = Ola(0);
    expect(pos.value).toBe(0);
    expect(pos.get()).toBe(0);
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

  it("can update the value after long time with speed 0", async () => {
    const pos = Ola(0);
    pos.value = 100;
    await delay(1000);
    pos.value = 0;
    expect(pos.value).toApproximate(100);
    await delay(150);
    expect(pos.value).toApproximate(50);
  });

  it("can update the value in several spots", async () => {
    const pos = Ola(0);
    pos.value = 100;
    await delay(150); // value ~= 50
    pos.value = 0;
    expect(pos.value).toApproximate(50);
    await delay(150); // value SHOULD NOT ~= 25 because of initial speed
    expect(pos.value).not.toApproximate(25);
  });

  it("will have speed when approximated midway", async () => {
    const pos = Ola(0);
    pos.value = 100;
    await delay(150); // value ~= 50
    pos.value = 0;
    expect(pos.value).toApproximate(50);
    await delay(150); // value SHOULD NOT ~= 25 because of initial speed
    expect(pos.value).not.toApproximate(25);
  });

  it("can update the time it takes", async () => {
    const pos = Ola({ value: 0 });
    pos.value = 100;
    await delay();
    expect(pos.value).toApproximate(100);
    pos.set({ value: 200 }, 100);
    await delay(100);
    expect(pos.value).toApproximate(200);
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

  it("can update multiple values", async () => {
    const pos = Ola({ x: 0, y: 0, z: 0 });
    pos.set({ x: 0, y: 10, z: 100 });
    await delay();

    expect(pos).toEqual({ x: 0, y: 10, z: 100 });
    expect(JSON.stringify(pos)).toBe(`{"x":0,"y":10,"z":100}`);
  });
});

describe("Ola([0])", () => {
  it("can be initialized", () => {
    expect(Ola([0])).toEqual([0]);
  });

  it("can read the value", () => {
    const pos = Ola([0]);
    expect(pos[0]).toBe(0);
    expect(pos.get(0)).toBe(0);
    expect(pos.get("0")).toBe(0);
    expect(pos).toEqual([0]);
    expect(JSON.stringify(pos)).toBe("[0]");
  });

  it("can loop it", async () => {
    const pos = Ola([0, 0, 0]);
    pos.forEach((val, i) => {
      expect(val).toBe(0);
      pos[i] = 100;
    });

    await delay();
    pos.forEach(val => {
      expect(val).toBe(100);
    });
  });

  it("can create it from Array(N).fill(0)", async () => {
    // Generates 1000 instances seamlessly
    const dots = Ola(Array(1000).fill(0));

    // Everything updates every 600ms
    dots.forEach((dot, i) => {
      expect(dot).toBe(0);
      dots[i] = 100;
    });

    await delay();
    dots.forEach(dot => {
      expect(dot).toBe(100);
    });
  });

  it("can update the value", async () => {
    const pos = Ola([0]);
    pos[0] = 100;
    await delay();

    expect(pos[0]).toBe(100);
    expect(pos.get(0)).toBe(100);
    expect(pos).toEqual([100]);
    expect(JSON.stringify(pos)).toBe("[100]");
  });

  it("can use negative numbers", async () => {
    const pos = Ola([-10]);
    pos[0] = -100;
    await delay();

    expect(pos[0]).toBe(-100);
    expect(pos.get(0)).toBe(-100);
    expect(pos.get("0")).toBe(-100);
    expect(pos).toEqual([-100]);
    expect(JSON.stringify(pos)).toBe("[-100]");
  });

  it("can update the value with .set()", async () => {
    const pos = Ola([0]);
    pos.set([100]);
    await delay();

    expect(pos[0]).toBe(100);
    expect(pos.get(0)).toBe(100);
    expect(pos.get("0")).toBe(100);
    expect(pos).toEqual([100]);
    expect(JSON.stringify(pos)).toBe("[100]");
  });

  it("can update multiple values", async () => {
    const pos = Ola([0, 0, 0]);
    pos.set([0, 10, 100]);
    await delay();

    expect(pos).toEqual([0, 10, 100]);
    expect(JSON.stringify(pos)).toBe("[0,10,100]");
  });

  it("can update multiple values", async () => {
    const pos = Ola(Array(3).fill(0));
    pos.set([0, 10, 100]);
    await delay();

    expect(pos).toEqual([0, 10, 100]);
    expect(JSON.stringify(pos)).toBe("[0,10,100]");
  });
});
