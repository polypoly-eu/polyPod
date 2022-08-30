import { podBubblewrapClasses, podBubblewrap } from "../../remote";
import { NamedNode, BlankNode } from "@polypoly-eu/api";

describe("Bubblewrap", () => {
    describe("when create()", () => {
        test("should have the right number of classes", () => {
            expect(Object.keys(podBubblewrapClasses).length).toBe(6);
        });
    });

    describe("when NamedNode() is called", () => {
        test("should generate roundtrip classes correctly", () => {
            const namedNode = new NamedNode("https://example.org/n");
            const encoded = podBubblewrap.encode(namedNode);

            expect(encoded).toBeTruthy();

            const decoded = podBubblewrap.decode(encoded);

            expect(decoded).toBeInstanceOf(NamedNode);
            expect(decoded).toStrictEqual(namedNode);
        });
    });

    describe("when BlankNode() is called", () => {
        test("should generate roundtrip classes correctly", () => {
            const blankNode = new BlankNode();
            const encoded = podBubblewrap.encode(blankNode);

            expect(encoded).toBeTruthy();

            const decoded = podBubblewrap.decode(encoded);

            expect(decoded).toBeInstanceOf(BlankNode);
            expect(decoded).toStrictEqual(blankNode);
        });
    });
});
