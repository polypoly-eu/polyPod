import generateScale from "../src/model/analyses/utils/generate-scale";

describe("Scale generator", function () {
    it("Returns the correct scales", function () {
        expect(generateScale(1)).toStrictEqual([0.2, 0.4, 0.6, 0.8, 1]);
        expect(generateScale(1.1)).toStrictEqual([0.5, 1, 1.5]);
        expect(generateScale(1.6)).toStrictEqual([0.5, 1, 1.5, 2]);
        expect(generateScale(2.1)).toStrictEqual([1, 2, 3]);
        expect(generateScale(3)).toStrictEqual([1, 2, 3, 4]);
        expect(generateScale(5)).toStrictEqual([1, 2, 3, 4, 5]);
        expect(generateScale(7)).toStrictEqual([2, 4, 6, 8]);
        expect(generateScale(8)).toStrictEqual([2, 4, 6, 8]);
        expect(generateScale(9)).toStrictEqual([2, 4, 6, 8, 10]);
        expect(generateScale(9.1)).toStrictEqual([2, 4, 6, 8, 10]);
        expect(generateScale(16)).toStrictEqual([5, 10, 15, 20]);
        expect(generateScale(9000)).toStrictEqual([
            2000, 4000, 6000, 8000, 10000,
        ]);
        expect(generateScale(0.0002)).toStrictEqual([
            0.00005, 0.0001, 0.00015, 0.0002,
        ]);
    });
});
