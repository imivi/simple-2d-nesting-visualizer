import { range } from "./range"


test("range(5) -> [0,1,2,3,4]", () => {
    expect(range(5)).toStrictEqual([0,1,2,3,4])
})
