import { createUUID, isPolypodUri, PolyUri } from "../uri";

describe("createUUID tests", () => {
    it("should generate an UUID in the required format", () => {
        expect(createUUID()).toMatch(/^\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}$/);
    });

    it("should generate different subsequent UUIDs", () => {
        let lastUUID = createUUID();
        for (let i = 0; i < 100; i++) {
            const thisUUID = createUUID();
            expect(thisUUID).not.toEqual(lastUUID);
            lastUUID = thisUUID;
        }
    });
});

describe("isPolypodUri()", () => {
    it.each([
        [new PolyUri().toString(), true],
        [`${new PolyUri().toString()}12313313`, true],
        ["foobargaz", false],
        ["badURI", false],
        ["xxxx-xxxx-xxx-xxxxxx", false],
        ["", false],
    ])(`should return proper result when passed Uri is %s`, (x, result) => {
        expect(isPolypodUri(x)).toEqual(result);
    });
});
