import { values, assoc, dissoc } from "../src/poor-man-ramda";

describe("values", () => {
  it("returns the object values", () => {
    expect(values({})).toEqual([]);
    expect(values({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3]);
  });
});

describe("assoc", () => {
  it("adds a key to an object", () => {
    const o = { a: 1, b: 2 };
    const a1 = assoc("b", 3, o);
    const a2 = assoc("c", 3, o);

    expect(a1).not.toBe(o);
    expect(a2).not.toBe(o);

    expect(o).toEqual({ a: 1, b: 2 });
    expect(a1).toEqual({ a: 1, b: 3 });
    expect(a2).toEqual({ a: 1, b: 2, c: 3 });
  });
});

describe("dissoc", () => {
  it("removes a key from an object", () => {
    const o = { a: 1, b: 2, c: 3 };
    const d1 = dissoc("a", o);
    const d2 = dissoc("d", o);

    expect(d1).not.toBe(o);
    expect(d2).not.toBe(o);

    expect(o).toEqual({ a: 1, b: 2, c: 3 });
    expect(d1).toEqual({ b: 2, c: 3 });
    expect(d2).toEqual(o);
  });
});
