import fc, { Arbitrary } from "fast-check";
import {
    gens,
    dataFactory,
    NamedNode,
    BlankNode,
    Literal,
    Variable,
    DefaultGraph,
    Quad as polyQuad,
} from "@polypoly-eu/api";
import { Bubblewrap, Class, Classes, deserialize, serialize } from "../index";

// TODO export spec
type TypeInfo<T> = [Class<T>, Arbitrary<T>];

type TypeInfos<T extends Record<string, unknown>> = {
    [P in keyof T]: TypeInfo<T[P]>;
};

class BubblewrapSpec<T extends Record<string, unknown>> {
    readonly bubblewrap: Bubblewrap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly gen: Arbitrary<[Class<any>, unknown]>;

    constructor(private readonly infos: TypeInfos<T>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gens: Arbitrary<[Class<any>, unknown]>[] = [];
        const constructors: Classes = {};

        for (const [key, [constructor, gen]] of Object.entries(this.infos)) {
            gens.push(gen.map((value: unknown) => [constructor, value]));
            constructors[key] = constructor;
        }

        this.bubblewrap = Bubblewrap.create(constructors, true);

        this.gen = fc.oneof(...gens);
    }

    run(): void {
        const { gen, bubblewrap } = this;

        it("decode/encode", () => {
            fc.assert(
                fc.property(gen, ([constructor, t]) => {
                    const encoded = bubblewrap.encode(t);
                    expect(encoded).toBeInstanceOf(Uint8Array);
                    const decoded = bubblewrap.decode(encoded);
                    expect(decoded).toStrictEqual(t);
                    expect(decoded).toBeInstanceOf(constructor);
                })
            );
        });
    }
}

class TestA {
    constructor(public a: string) {}
}

class TestB extends TestA {
    constructor(a: string, public b: string) {
        super(a);
    }
}

class MyError extends Error {
    constructor(private readonly mymsg: string) {
        super(`My message: ${mymsg}`);
    }

    static [deserialize](mymsg: string): MyError {
        return new MyError(mymsg);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [serialize](): any {
        return this.mymsg;
    }
}

type Types = {
    A: TestA;
    B: TestB;
    MyError: MyError;
    "@polypoly-eu/rdf.NamedNode": NamedNode;
    "@polypoly-eu/rdf.BlankNode": BlankNode;
    "@polypoly-eu/rdf.Literal": Literal;
    "@polypoly-eu/rdf.Variable": Variable;
    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph;
    "@polypoly-eu/rdf.Quad": polyQuad;
};

const gen = gens(dataFactory);

const infos: TypeInfos<Types> = {
    A: [TestA, fc.fullUnicodeString().map((a) => new TestA(a))],
    B: [
        TestB,
        fc
            .tuple(fc.fullUnicodeString(), fc.fullUnicodeString())
            .map(([a, b]) => new TestB(a, b)),
    ],
    MyError: [MyError, fc.hexaString().map((m) => new MyError(m))],
    "@polypoly-eu/rdf.NamedNode": [NamedNode, gen.namedNode],
    "@polypoly-eu/rdf.BlankNode": [BlankNode, gen.blankNode],
    "@polypoly-eu/rdf.Literal": [Literal, gen.literal],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    "@polypoly-eu/rdf.Variable": [Variable, gen.variable!],
    "@polypoly-eu/rdf.DefaultGraph": [
        DefaultGraph,
        fc.constant(dataFactory.defaultGraph()),
    ],
    "@polypoly-eu/rdf.Quad": [polyQuad, gen.quad],
};

describe("Bubblewrap", () => {
    describe("Spec", () => {
        new BubblewrapSpec(infos).run();
    });

    describe("RDF", () => {
        const { bubblewrap } = new BubblewrapSpec(infos);

        for (const [key, g] of Object.entries(gen))
            it(key, () => {
                fc.assert(
                    fc.property(g, (term) => {
                        const decoded = bubblewrap.decode(
                            bubblewrap.encode(term)
                        );
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        expect((term as any).equals(decoded)).toBe(true);
                        expect(decoded.equals(term)).toBe(true);
                    })
                );
            });
    });

    describe("Builtins", () => {
        it("Error", () => {
            const bubblewrap = Bubblewrap.create();

            fc.assert(
                fc.property(fc.string(), (msg) => {
                    const err = new Error(msg);
                    const decoded = bubblewrap.decode(bubblewrap.encode(err));
                    expect(decoded).toEqual(err);
                    expect(decoded).toBeInstanceOf(Error);
                })
            );
        });

        it("Error (non-strict)", () => {
            const bubblewrap = Bubblewrap.create();
            const err = new MyError("test");
            const decoded = bubblewrap.decode(bubblewrap.encode(err));
            expect(Object.getPrototypeOf(decoded)).toBe(Error.prototype);
        });

        it("Error (strict)", () => {
            const bubblewrap = Bubblewrap.create({}, true);
            const err = new MyError("test");
            expect(() => bubblewrap.encode(err)).toThrowError(
                /unknown prototype/
            );
        });
    });

    describe("Add class", () => {
        it("Adds classes, throws if duplicated", () => {
            const bubblewrap = Bubblewrap.create();
            const someClasses: Classes = { TestA: TestA, TestB: TestB };
            const bubblewrapPlus = bubblewrap.addClasses(someClasses);
            expect(bubblewrapPlus).not.toBeNull();
            const someOtherClasses: Classes = { TestB: TestB };
            expect(() =>
                bubblewrapPlus.addClasses(someOtherClasses)
            ).toThrowError(/Duplicate/);
        });
    });

    describe("Tests undefined", () => {
        it("Tries to encode/decode undefined/null", () => {
            const bw = Bubblewrap.create();
            let encodedUndefined = bw.encode(undefined);
            expect(encodedUndefined).not.toBeNull();
            expect(bw.decode(encodedUndefined)).toBeNull();
            encodedUndefined = bw.encode(null);
            expect(encodedUndefined).not.toBeNull();
            expect(bw.decode(encodedUndefined)).toBeNull();
        });
    });
});
