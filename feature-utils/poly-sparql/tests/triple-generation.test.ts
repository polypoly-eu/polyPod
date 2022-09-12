import {
    jsArrayToTriplesString,
    jsObjectToTriplesString,
} from "../src/triple-generation";

const simpleJsObj = {
    a: 1,
    b: "b",
    c: 3.5,
};

const nestedJsObj = {
    nested: simpleJsObj,
};

const simpleArray = [1, "a", 3.5];

const simpleObjArray = [simpleJsObj, "a", "b"];

const complexStructure = [{ array: simpleArray }, { obj: simpleJsObj }];

const arraysArray = [["a"]];

const uuidExp = ".{36}";

describe("Triple string generation", () => {
    it("works for simple non-nested js objects", () => {
        expect(
            jsObjectToTriplesString(
                "file://123",
                "poly:test",
                simpleJsObj,
                ":_b"
            )
        ).toBe(
            'file://123 poly:test :_b :_b poly:a 1 :_b poly:b "b" :_b poly:c 3.5 '
        );
    });

    it("works with nested objects", () => {
        const stringExp = new RegExp(
            `file://123 poly:test :_b :_b poly:nested _:${uuidExp} _:${uuidExp} poly:a 1 _:${uuidExp} poly:b "b" _:${uuidExp} poly:c 3.5`
        );
        expect(
            stringExp.test(
                jsObjectToTriplesString(
                    "file://123",
                    "poly:test",
                    nestedJsObj,
                    ":_b"
                )
            )
        ).toBeTruthy();
    });

    it("works for simple arrays", () => {
        expect(
            jsArrayToTriplesString("file://123", "poly:test", simpleArray)
        ).toBe('file://123 poly:test 1, "a", 3.5');
    });

    it("works for array of simple objects", () => {
        const stringExp = new RegExp(
            `file://123 poly:test "a", "b" file://123 poly:test _:${uuidExp} _:${uuidExp} poly:a 1 _:${uuidExp} poly:b "b" _:${uuidExp} poly:c 3.5`
        );
        expect(
            stringExp.test(
                jsArrayToTriplesString(
                    "file://123",
                    "poly:test",
                    simpleObjArray
                )
            )
        ).toBeTruthy();
    });

    it("works for complex nested array/object structures", () => {
        const stringExp = new RegExp(
            `file://123 poly:test _:${uuidExp} _:${uuidExp} poly:array 1, "a", 3.5 file://123 poly:test _:${uuidExp} _:${uuidExp} poly:obj _:${uuidExp} _:${uuidExp} poly:a 1 _:${uuidExp} poly:b "b" _:${uuidExp} poly:c 3.5`
        );
        expect(
            stringExp.test(
                jsArrayToTriplesString(
                    "file://123",
                    "poly:test",
                    complexStructure
                )
            )
        ).toBeTruthy();
    });

    it("catches Array[] as not supported action", () => {
        let error = null;
        try {
            jsArrayToTriplesString("file://123", "poly:test", arraysArray);
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy;
    });
});
