import { podBubblewrapClasses, podBubblewrap } from "../../remote";
import { NamedNode } from "@polypoly-eu/api";

describe("Classes are accounted for", () => {
    it("has the right number of classes", () => {
        expect(Object.keys(podBubblewrapClasses).length).toBe(6);
    });
});

describe("Classes roundtrip correctly", () => {
    it("works for NamedNode", () => {
        const namedNode = new NamedNode("https://example.org/n");
        const encoded = podBubblewrap.encode(namedNode);
        expect(encoded).toBeTruthy();
        const decoded = podBubblewrap.decode(encoded);
        expect(decoded).toBeInstanceOf(NamedNode);
        expect(decoded).toStrictEqual(namedNode);
    });
});
