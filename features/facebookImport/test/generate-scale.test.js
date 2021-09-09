import generateScale from "../src/model/generate-scale";

describe("Scale generator", function () {
    console.log(generateScale(1));
    it("Returns the correct scales", function () {
        expect(generateScale(1)).toStrictEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
        expect(generateScale(1.1)).toStrictEqual([0, 0.5, 1, 1.5]);
        expect(generateScale(1.6)).toStrictEqual([0, 0.5, 1, 1.5, 2]);
        expect(generateScale(2.1)).toStrictEqual([0, 1, 2, 3]);
        expect(generateScale(3)).toStrictEqual([0, 1, 2, 3, 4]);
        expect(generateScale(5)).toStrictEqual([0, 1, 2, 3, 4, 5]);
        expect(generateScale(7)).toStrictEqual([0, 2, 4, 6, 8]);
        expect(generateScale(8)).toStrictEqual([0, 2, 4, 6, 8]);
        expect(generateScale(9)).toStrictEqual([0, 2, 4, 6, 8, 10]);
        expect(generateScale(16)).toStrictEqual([0, 5, 10, 15, 20]);
        expect(generateScale(9000)).toStrictEqual([
            0, 2000, 4000, 6000, 8000, 10000,
        ]);
    });
});
