import { Box2, Vector2 } from "three";
import { isHorizontal, isVertical, fits, fill } from "./fill";

test("Vector2 (10,5) should be horizontal", () => {
    expect(isHorizontal(new Vector2(10,5))).toBe(true)
})

test("Vector2 (5,10) should be vertical", () => {
    expect(isVertical(new Vector2(5,10))).toBe(true)
})

test("Box (5,5 -> 10,10) should fit Vector (4,4)", () => {
    const box = new Box2(new Vector2(5,5), new Vector2(10,10))
    const vec = new Vector2(4,4)
    expect(fits(box, vec)).toBe(true)
})

test("Box (3,3 -> 8,8) should not fit Vector (3,6)", () => {
    const box = new Box2(new Vector2(3,3), new Vector2(8,8))
    const vec = new Vector2(3,6)
    expect(fits(box, vec)).toBe(false)
})

test("Box (0,0 -> 10,10) should be filled with 10 Vectors (2,5)", () => {
    const box = new Box2(new Vector2(0,0), new Vector2(10,10))
    const vec = new Vector2(2,5)
    expect(fill(box, vec)).toHaveLength(10)
})