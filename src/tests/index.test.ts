import fc from "fast-check";
import {bubblewrap, builtin, Handlers, Typeson} from "../index";
import {typesonSpec} from "../specs/typeson";
import {gens} from "@polypoly-eu/rdf-spec";
import * as RDF from "@polypoly-eu/rdf";

class TestA {
    constructor(
        public a: string
    ) {}
}

class TestB extends TestA {
    constructor(
        a: string,
        public b: string
    ) {
        super(a);
    }
}

const handlers: Handlers = [
    bubblewrap("test", TestA, TestB),
    bubblewrap("eu.polypoly.rdf",
        RDF.NamedNode,
        RDF.BlankNode,
        RDF.Literal,
        RDF.Variable,
        RDF.DefaultGraph,
        RDF.Quad
    )
];

const typeson = new Typeson()
    .register(builtin)
    .register(handlers);

describe("Bubblewrap", () => {
    describe("Custom", () => {
        typesonSpec("TestA", fc.fullUnicodeString().map(a => new TestA(a)), typeson, TestA);
        typesonSpec("TestB", fc.tuple(fc.fullUnicodeString(), fc.fullUnicodeString()).map(([a, b]) => new TestB(a, b)), typeson, TestB);
    });

    describe("RDF", () => {
        const gen = gens(RDF.dataFactory);
        typesonSpec("Quad", gen.quad, typeson, RDF.Quad);

        describe("Post-revival equality", () => {
            for (const [key, g] of Object.entries(gen))
                it(key, () => {
                    fc.assert(fc.property(g, term => {
                        const revived = typeson.revive(typeson.encapsulate(term));
                        expect((term as any).equals(revived)).toBe(true);
                        expect(revived.equals(term)).toBe(true);
                    }));
                });
        });

        it("Bug", () => {
            const s = RDF.dataFactory.namedNode("http://example.org");
            const l1 = RDF.dataFactory.literal("hi1");
            const l2 = RDF.dataFactory.literal("hi2");
            const quads = [
                RDF.dataFactory.triple(s, s, l1),
                RDF.dataFactory.triple(s, s, l2)
            ];
            expect(typeson.revive(typeson.encapsulate(quads))).toEqual(quads);
        });
    });
});
