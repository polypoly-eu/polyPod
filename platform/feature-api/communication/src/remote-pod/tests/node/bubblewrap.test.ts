import { podBubblewrapClasses, podBubblewrap } from "../../remote";
import { NamedNode, BlankNode } from "@polypoly-eu/api";

describe("Bubblewrap sanity check", () => {
    test("should have the right number of classes", () => {
        expect(Object.keys(podBubblewrapClasses).length).toBe(6);
    });
});

const testInstances = [
    [NamedNode, "https://example.org/n"],
    [BlankNode, "https://example.org/n"],
];

describe("Test different kind of nodes", () => {
    testInstances.forEach((instance) => {
        let aClass: any = instance[0];
        const arg = instance[1];
        describe(`round-tripping ${aClass.constructor.name}`, () => {
            test("should roundtrip ${aClass.constructor.name}", () => {
                if (aClass.hasOwnProperty("new")) {
                    const aNode = new aClass(arg);
                    const encoded = podBubblewrap.encode(aNode);

                    expect(encoded).toBeTruthy();

                    const decoded = podBubblewrap.decode(encoded);

                    expect(decoded).toBeInstanceOf(aClass);
                    expect(decoded).toStrictEqual(aNode);
                }
            });
        });
    });
});
