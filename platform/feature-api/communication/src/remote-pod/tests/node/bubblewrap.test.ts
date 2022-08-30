import { podBubblewrapClasses, podBubblewrap } from "../../remote";
import {
    NamedNode,
    BlankNode,
    Literal,
    Variable,
    DefaultGraph,
} from "@polypoly-eu/api";

describe("Bubblewrap sanity check", () => {
    test("should have the right number of classes", () => {
        expect(Object.keys(podBubblewrapClasses).length).toBe(6);
    });
});

const testInstances = [
    [NamedNode, "https://example.org/n"],
    [BlankNode, "https://example.org/n"],
    [Literal, "Privacy rocks"],
    [Variable, "Privacy rocks invariably"],
    [DefaultGraph, "https://polypoly.coop/CDS"],
];

describe("Test different kind of nodes", () => {
    testInstances.forEach((instance) => {
        let aClass: any = instance[0];
        const arg = instance[1];
        const aNode = new aClass(arg);

        test(`should roundtrip ${aNode.constructor.name}`, () => {
            const encoded = podBubblewrap.encode(aNode);

            expect(encoded).toBeTruthy();

            const decoded = podBubblewrap.decode(encoded);

            expect(decoded).toBeInstanceOf(aClass);
            expect(decoded).toStrictEqual(aNode);
        });
    });
});
