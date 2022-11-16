import { PolyIn } from "@polypoly-eu/api";
import * as RDF from "rdf-js";

export function initControls(container: HTMLElement): void {
    const runAllButton = document.getElementById("runAll");
    runAllButton.addEventListener("click", function () {
        const output = container.querySelector("span");
        output.textContent = "Running all...";
        runAllButton.disabled = true;
        mocha.run((failures) => {
            output.textContent = failures > 0 ? "Failed" : "All OK";
            runAllButton.textContent = "Reset";
            runAllButton.addEventListener("click", function () {
                location.reload();
            });
            runAllButton.disabled = false;
        });
    });
}

const assert = chai.assert;

// Workaround for iOS not supporting console.warn
console.warn = console.warn || console.log;

describe("API object", function () {
    it("resolves", async function () {
        assert.isDefined(await window.pod);
    });
});

describe("polyIn", function () {
    async function assertAsyncThrows(fn, errorLike): Promise<void> {
        try {
            await fn();
            throw "No error raised";
        } catch (e) {
            assert.throws(() => {
                throw e;
            }, errorLike);
        }
    }

    function findQuadIndex(quads: RDF.Quad[], quad: RDF.Quad): number {
        for (let i = 0; i < quads.length; i++)
            if (quad.equals(quads[i])) return i;
        return -1;
    }

    function assertQuadsEqual(expected: RDF.Quad[], actual: RDF.Quad[]): void {
        assert.equal(expected.length, actual.length);
        for (const expectedQuad of expected) {
            const index = findQuadIndex(actual, expectedQuad);
            assert.notEqual(
                index,
                -1,
                `expected '${actual}' to include '${expectedQuad}'`
            );
            actual.splice(index, 1);
        }
    }

    const dataFactory: RDF.DataFactory = window.pod.dataFactory;
    const polyIn: PolyIn = window.pod.polyIn;

    const testQuads = {
        allNamedNodes: dataFactory.quad(
            dataFactory.namedNode("http://example.com/s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.namedNode("http://example.com/o")
        ),
        blankNodeSubject: dataFactory.quad(
            dataFactory.blankNode("s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.namedNode("http://example.com/o")
        ),
        blankNodeObject: dataFactory.quad(
            dataFactory.namedNode("http://example.com/s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.blankNode("o")
        ),
        literalObject: dataFactory.quad(
            dataFactory.namedNode("http://example.com/s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.literal("o")
        ),
        defaultGraph: dataFactory.quad(
            dataFactory.namedNode("http://example.com/s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.namedNode("http://example.com/o"),
            dataFactory.defaultGraph()
        ),
        nonDefaultGraph: dataFactory.quad(
            dataFactory.namedNode("http://example.com/s"),
            dataFactory.namedNode("http://example.com/p"),
            dataFactory.namedNode("http://example.com/o"),
            dataFactory.namedNode("http://example.com/g")
        ),
    };

    const quadBackupTimeout = 10000;
    let savedQuads: RDF.Quad[];

    // @ts-ignore - seems we're missing some types for Mocha
    before(async function () {
        this.timeout(quadBackupTimeout);
        savedQuads = await polyIn.match({});
        if (savedQuads.length)
            console.warn(`Backing up ${savedQuads.length} quads`);
        for (const quad of savedQuads) await polyIn.delete(quad);
    });

    // @ts-ignore - seems we're missing some types for Mocha
    after(async function () {
        this.timeout(quadBackupTimeout);
        if (savedQuads.length)
            console.warn(`Restoring ${savedQuads.length} quads`);
        for (const quad of savedQuads) await polyIn.add(quad);
    });

    describe("add", function () {
        it("can be called with single quad", async function () {
            await polyIn.add(testQuads.allNamedNodes);
        });

        it("supports quads with blank node subject", async function () {
            await polyIn.add(testQuads.blankNodeSubject);
        });

        it("supports quads with blank node object", async function () {
            await polyIn.add(testQuads.blankNodeObject);
        });

        it("supports quads with literal object", async function () {
            await polyIn.add(testQuads.literalObject);
        });

        it("supports quads with default graph", async function () {
            await polyIn.add(testQuads.defaultGraph);
        });

        // Some platforms currently don't reject quads with non-default graphs
        it.skip("does not support quads with non-default graph", async function () {
            await assertAsyncThrows(
                () => polyIn.add(testQuads.nonDefaultGraph),
                /^Only default graph allowed/
            );
        });

        it.skip("can be called with multiple quads", async function () {
            // @ts-ignore - the variant of add() called here doesn't exist yet
            await polyIn.add([
                testQuads.allNamedNodes,
                testQuads.blankNodeSubject,
            ]);
        });
    });

    describe("match", function () {
        async function clearQuads(): void {
            for (const quad of await polyIn.match({}))
                await polyIn.delete(quad);
        }

        beforeEach(clearQuads);

        // @ts-ignore - seems we're missing some types for Mocha
        after(clearQuads);

        it("accepts empty matcher", async function () {
            await polyIn.match({});
        });

        it("accepts matcher with subject", async function () {
            const subject = testQuads.allNamedNodes.subject.value;
            const matcher = {
                subject: dataFactory.namedNode(subject),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with predicate", async function () {
            const predicate = testQuads.allNamedNodes.predicate.value;
            const matcher = {
                predicate: dataFactory.namedNode(predicate),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with object", async function () {
            const object = testQuads.allNamedNodes.object.value;
            const matcher = {
                object: dataFactory.namedNode(object),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with all three fields", async function () {
            const quad = testQuads.allNamedNodes;
            const matcher = {
                subject: dataFactory.namedNode(quad.subject.value),
                predicate: dataFactory.namedNode(quad.predicate.value),
                object: dataFactory.namedNode(quad.object.value),
            };
            await polyIn.match(matcher);
        });

        it("returns empty array", async function () {
            const result = await polyIn.match({});
            assert.isArray(result);
            assert.lengthOf(result, 0);
        });

        it("returns single quad", async function () {
            const quad = testQuads.allNamedNodes;
            await polyIn.add(quad);
            const result = await polyIn.match({});
            assertQuadsEqual(result, [quad]);
        });

        it("returns single quad with blank node subject", async function () {
            const quad = testQuads.blankNodeSubject;
            await polyIn.add(quad);
            const result = await polyIn.match({});
            assertQuadsEqual(result, [quad]);
        });

        it("returns single quad with blank node object", async function () {
            const quad = testQuads.blankNodeObject;
            await polyIn.add(quad);
            const result = await polyIn.match({});
            assertQuadsEqual(result, [quad]);
        });

        it("returns single quad with literal object", async function () {
            const quad = testQuads.literalObject;
            await polyIn.add(quad);
            const result = await polyIn.match({});
            assertQuadsEqual(result, [quad]);
        });

        it("supports matcher with default graph", async function () {
            const quad = testQuads.defaultGraph;
            const matcher = {
                subject: dataFactory.namedNode(quad.subject.value),
                predicate: dataFactory.namedNode(quad.predicate.value),
                object: dataFactory.namedNode(quad.object.value),
                graph: dataFactory.defaultGraph(),
            };
            await polyIn.match(matcher);
        });

        it("supports matcher with non-default graph", async function () {
            const quad = testQuads.nonDefaultGraph;
            const matcher = {
                subject: dataFactory.namedNode(quad.subject.value),
                predicate: dataFactory.namedNode(quad.predicate.value),
                object: dataFactory.namedNode(quad.object.value),
                graph: dataFactory.namedNode(quad.graph.value),
            };
            await polyIn.match(matcher);
        });

        it("returns multiple quads", async function () {
            const quads = [testQuads.allNamedNodes, testQuads.blankNodeSubject];
            for (const quad of quads) await polyIn.add(quad);
            const result = await polyIn.match({});
            assertQuadsEqual(result, quads);
        });
    });
});
