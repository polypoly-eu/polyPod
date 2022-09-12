import { podBubblewrapClasses, podBubblewrap } from "../../remote";
import {
    NamedNode,
    BlankNode,
    Literal,
    Variable,
    DefaultGraph,
    Quad,
} from "@polypoly-eu/api";

const testInstances = [
    [NamedNode, "https://example.org/n"],
    [BlankNode, "https://example.org/n"],
    [Literal, "Privacy rocks"],
    [Variable, "Privacy rocks invariably"],
    [DefaultGraph, "https://polypoly.coop/CDS"],
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertRoundtrip(anObject: any, aClass: any, msg: string): void {
    test(msg, () => {
        const encoded = podBubblewrap.encode(anObject);
        expect(encoded).toBeTruthy();
        const decoded = podBubblewrap.decode(encoded);
        expect(decoded).toBeInstanceOf(aClass);
        expect(decoded).toStrictEqual(anObject);
    });
}

describe("Test different kinds of nodes", () => {
    testInstances.forEach((instance) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aClass: any = instance[0];
        const arg = instance[1];
        const aNode = new aClass(arg);
        assertRoundtrip(
            aNode,
            aClass,
            `should roundtrip ${aNode.constructor.name}`
        );
    });
});

describe("Test roundtripping for a Quad", () => {
    const subject = new NamedNode("https://polypoly.coop/subject");
    const predicate = new NamedNode("https://polypoly.coop/predicate");
    const object = new Literal("A value");
    const graph = new BlankNode();
    const aQuad = new Quad(subject, predicate, object, graph);
    assertRoundtrip(aQuad, Quad, "should roundtrip");
});
