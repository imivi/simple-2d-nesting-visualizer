import { Box2, Vector2 } from "three";
import { isHorizontal, isVertical, fits, fill, rotate } from "./fill";

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


test("rotating vector (2,5) should be result in vector (5,2)", () => {
    const inputVec  = new Vector2(2,5)
    const outputVec = new Vector2(5,2)
    expect(rotate(inputVec)).toStrictEqual(outputVec)
})


test("Box (0,0 -> 5,3) should be filled with 2 Vectors (2,2)", () => {
    const box = new Box2(new Vector2(0,0), new Vector2(5,3))
    const vec = new Vector2(2,2)

    const expectedResult = [
        [0,0,2,2],
        [2,0,4,2],
    ].map(([minx,miny,maxx,maxy]) => new Box2(new Vector2(minx,miny), new Vector2(maxx,maxy)))

    expect(fill(box, vec)).toStrictEqual(expectedResult)
})


test("Box (0,0 -> 3,5) should be filled with 2 Vectors (2,2)", () => {
    const box = new Box2(new Vector2(0,0), new Vector2(3,5))
    const vec = new Vector2(2,2)

    const expectedShapes = [
        [0,0,2,2],
        [0,2,2,4],
    ].map(([minx,miny,maxx,maxy]) => new Box2(new Vector2(minx,miny), new Vector2(maxx,maxy)))

    // expect(fill(box, vec)).toStrictEqual(expectedResult)
    
    for(const shape of expectedShapes) {
        expect(fill(box, vec)).toContainEqual(shape)
    }
})


test("Box (0,0 -> 5,5) should be filled with 4 Vectors (2,2)", () => {
    const box = new Box2(new Vector2(0,0), new Vector2(5,5))
    const vec = new Vector2(2,2)

    const expectedShapes = [
        [2,2,4,4],
        [0,2,2,4],
        [2,0,4,2],
        [0,0,2,2],
    ].map(([minx,miny,maxx,maxy]) => new Box2(new Vector2(minx,miny), new Vector2(maxx,maxy)))

    for(const shape of expectedShapes) {
        expect(fill(box, vec)).toContainEqual(shape)
    }
})