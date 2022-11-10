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

describe("API object", function () {
    it("resolves", async function () {
        assert.isDefined(await window.pod);
    });
});

describe("polyIn", function () {
    /*
      TODO: These tests were migrated from some early experiments, but most of
      them never passed, presumably due to a lack of correct test data. The ones
      that still need fixing are disabled for now.
    */

    class QuadBuilder {
        private subject: RDF.Quad_Subject;
        private readonly predicate: RDF.Quad_Predicate;
        private object: RDF.Quad_Object;
        private graph: RDF.Quad_Graph;

        constructor(
            subject: RDF.Quad_Subject,
            predicate: RDF.Quad_Predicate,
            object: RDF.Quad_Object,
            graph: RDF.Quad_Graph
        ) {
            this.subject = subject;
            this.predicate = predicate;
            this.object = object;
            this.graph = graph;
        }

        static fromInputs(): QuadBuilder {
            const dataFactory = window.pod.dataFactory;
            const subject = dataFactory.namedNode(inputs.s);
            const predicate = dataFactory.namedNode(inputs.p);
            const object = dataFactory.namedNode(inputs.o);
            const graph = dataFactory.namedNode(inputs.g);
            return new QuadBuilder(subject, predicate, object, graph);
        }

        static fromQuad(quad: RDF.Quad): QuadBuilder {
            const subject = quad.subject;
            const predicate = quad.predicate;
            const object = quad.object;
            const graph = quad.graph;
            return new QuadBuilder(subject, predicate, object, graph);
        }

        withSubject(subject: RDF.Quad_Subject): QuadBuilder {
            this.subject = subject;
            return this;
        }

        withObject(object: RDF.Quad_Object): QuadBuilder {
            this.object = object;
            return this;
        }

        withGraph(graph: RDF.Quad_Graph): QuadBuilder {
            this.graph = graph;
            return this;
        }

        build(): RDF.Quad {
            return window.pod.dataFactory.quad(
                this.subject,
                this.predicate,
                this.object,
                this.graph
            );
        }
    }

    // Historically, there were input fields with this data, hence the name.
    const inputs = {
        s: "http://example.com/subject",
        p: "http://example.com/predicate",
        o: "http://example.com/object",
        g: "http://example.com/graph",
    };

    // This was probably being used to set up test data, but it's unclear how.
    const quads: Array<RDF.Quad> = [];

    const polyIn: PolyIn = window.pod.polyIn;

    describe("add", function () {
        it.skip("can be called with single quad", async function () {
            const quad = QuadBuilder.fromInputs().build();
            await polyIn.add(quad);
        });

        it.skip("can be called with multiple quads", async function () {
            await polyIn.add(...quads);
        });

        it.skip("supports quads with named node subject", async function () {
            const quad = QuadBuilder.fromInputs().build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with blank node subject", async function () {
            const subject = inputs.s;
            const quad = QuadBuilder.fromInputs()
                .withSubject(window.pod.dataFactory.blankNode(subject))
                .build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with named node object", async function () {
            const object = inputs.o;
            const quad = QuadBuilder.fromInputs()
                .withObject(window.pod.dataFactory.namedNode(object))
                .build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with blank node object", async function () {
            const object = input[3];
            const quad = QuadBuilder.fromInputs()
                .withObject(window.pod.dataFactory.blankNode(object))
                .build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with literal object", async function () {
            const object = input[3];
            const quad = QuadBuilder.fromInputs()
                .withObject(window.pod.dataFactory.literal(object))
                .build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with named node graph", async function () {
            const graph = input[4];
            const quad = QuadBuilder.fromInputs()
                .withGraph(window.pod.dataFactory.namedNode(graph))
                .build();
            await polyIn.add(quad);
        });

        it.skip("supports quads with blank node graph", async function () {
            const graph = input[4];
            const quad = QuadBuilder.fromInputs()
                .withGraph(window.pod.dataFactory.blankNode(graph))
                .build();
            await polyIn.add(quad);
        });

        it("supports quads with default graph", async function () {
            const quad = QuadBuilder.fromInputs()
                .withGraph(window.pod.dataFactory.defaultGraph())
                .build();
            await polyIn.add(quad);
        });
    });

    describe("match", function () {
        it("accepts empty matcher", async function () {
            await polyIn.match({});
        });

        it("accepts matcher with subject", async function () {
            const subject = inputs.s;
            const matcher = {
                subject: window.pod.dataFactory.namedNode(subject),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with predicate", async function () {
            const predicate = inputs.s;
            const matcher = {
                predicate: window.pod.dataFactory.namedNode(predicate),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with object", async function () {
            const object = inputs.s;
            const matcher = {
                object: window.pod.dataFactory.namedNode(object),
            };
            await polyIn.match(matcher);
        });

        it("accepts matcher with all three fields", async function () {
            const subject = inputs.s;
            const predicate = inputs.p;
            const object = inputs.o;
            const dataFactory = window.pod.dataFactory;
            const matcher = {
                subject: dataFactory.namedNode(subject),
                predicate: dataFactory.namedNode(predicate),
                object: dataFactory.namedNode(object),
            };
            await polyIn.match(matcher);
        });

        it.skip("can return empty array", async function () {
            const result = await polyIn.match({});
            assert.isArray(result);
            assert.lengthOf(result, 0);
        });

        it.skip("can return array with single squad", async function () {
            const expectedResult = [QuadBuilder.fromQuad(quads[0]).build()];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("can return array with single quad with named node subject", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withSubject(
                        pod.dataFactory.namedNode(quads[0].subject.value)
                    )
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithBlankNodeSubjectFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withSubject(
                        pod.dataFactory.blankNode(quads[0].subject.value)
                    )
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithNamedNodeObjectFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withObject(
                        pod.dataFactory.namedNode(quads[0].object.value)
                    )
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithBlankNodeObjectFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withObject(
                        pod.dataFactory.blankNode(quads[0].object.value)
                    )
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithLiteralObjectFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withObject(pod.dataFactory.literal(quads[0].object.value))
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithNamedNodeGraphFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withGraph(pod.dataFactory.namedNode(quads[0].graph.value))
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithBlankNodeGraphFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withGraph(pod.dataFactory.blankNode(quads[0].graph.value))
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithSingleQuadWithDefaultGraphFromPolyInMatch", async function () {
            const expectedResult = [
                QuadBuilder.fromQuad(quads[0])
                    .withGraph(pod.dataFactory.defaultGraph())
                    .build(),
            ];
            const result = await polyIn.match({});
            assert.deepEqual(result, expectedResult);
        });

        it.skip("canGetArrayWithMultipleQuadsFromPolyInMatch", async function () {
            const result = await polyIn.match({});
            assert.lengthOf(result, 2);
            assert.include(result, quads[0]);
            assert.include(result, quads[1]);
        });
    });
});
