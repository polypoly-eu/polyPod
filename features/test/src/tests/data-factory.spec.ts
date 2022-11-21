import { DataFactory } from "rdf-js";

import { assert } from "../assert";

describe("dataFactory", function () {
    const dataFactory: DataFactory = window.pod.dataFactory;

    describe("blankNode", () => {
        it("should be a static method", () => {
            assert.equal(typeof dataFactory.blankNode, "function");
        });

        it('should create an object with a termType property that contains the value "BlankNode"', () => {
            const term = dataFactory.blankNode();

            assert.equal(term.termType, "BlankNode");
        });

        it("should create an object with a value property that contains a unique identifier", () => {
            const term1 = dataFactory.blankNode();
            const term2 = dataFactory.blankNode();

            assert.notEqual(term1.value, term2.value);
        });

        it("should create an object with a value property that contains the given identifier", () => {
            const id = "b1";
            const term = dataFactory.blankNode(id);

            assert.equal(term.value, id);
        });

        describe("equals", () => {
            it("should be a method", () => {
                const term = dataFactory.blankNode();

                assert.equal(typeof term.equals, "function");
            });

            it("should return true if termType and value are equal", () => {
                const id = "b1";
                const term = dataFactory.blankNode(id);

                const expectedMock: BlankNode = {
                    termType: "BlankNode",
                    value: id,
                    equals: () => true,
                };

                assert.equal(term.equals(expectedMock), true);
            });

            it("should return false if termType is not equal", () => {
                const id = "b1";
                const term = dataFactory.blankNode(id);

                const expectedMock: NamedNode = {
                    termType: "NamedNode",
                    value: id,
                    equals: () => true,
                };
                assert.equal(term.equals(expectedMock), false);
            });

            it("should return false if value is not equal", () => {
                const id = "b1";
                const term = dataFactory.blankNode(id);

                const expectedMock: BlankNode = {
                    termType: "BlankNode",
                    value: id + 1,
                    equals: () => true,
                };
                assert.equal(term.equals(expectedMock), false);
            });

            it("should return false if value is falsy", () => {
                const id = "b1";
                const term = dataFactory.blankNode(id);

                assert.equal(term.equals(null), false);
            });
        });
    });

    describe("defaultGraph", () => {
        it("should be a static method", () => {
            assert.equal(typeof dataFactory.defaultGraph, "function");
        });

        it('should create an object with a termType property that contains the value "DefaultGraph"', () => {
            const term = dataFactory.defaultGraph();

            assert.equal(term.termType, "DefaultGraph");
        });

        it("should create an object with a value property that contains an empty string", () => {
            const term = dataFactory.defaultGraph();

            assert.equal(term.value, "");
        });

        describe("equals", () => {
            it("should be a method", () => {
                const term = dataFactory.defaultGraph();

                assert.equal(typeof term.equals, "function");
            });

            it("should return true if termType and value are equal", () => {
                const term = dataFactory.defaultGraph();
                const mock: DefaultGraph = {
                    termType: "DefaultGraph",
                    value: "",
                    equals: () => true,
                };

                assert.equal(term.equals(mock), true);
            });

            it("should return false if termType is not equal", () => {
                const term = dataFactory.defaultGraph();
                const mock: NamedNode = {
                    termType: "NamedNode",
                    value: "",
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is falsy", () => {
                const term = dataFactory.defaultGraph();

                assert.equal(term.equals(null), false);
            });
        });
    });
    describe("literal", () => {
        it("should be a static method", () => {
            assert.equal(typeof dataFactory.literal, "function");
        });

        it('should create an object with a termType property that contains the value "Literal"', () => {
            const string = "example";
            const term = dataFactory.literal(string);

            assert.equal(term.termType, "Literal");
        });

        it("should create an object with a value property that contains the given string", () => {
            const string = "example";
            const term = dataFactory.literal(string);

            assert.equal(term.value, string);
        });

        it("should create an object with a language property that contains an empty string", () => {
            const string = "example";
            const term = dataFactory.literal(string);

            assert.equal(term.language, "");
        });

        it("should create an object with a language property that contains the given language string", () => {
            const string = "example";
            const language = "en";
            const term = dataFactory.literal(string, language);

            assert.equal(term.language, language);
        });

        it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/2001/XMLSchema#string"', () => {
            const string = "example";
            const term = dataFactory.literal(string);

            assert.equal(term.datatype.termType, "NamedNode");
            assert.equal(
                term.datatype.value,
                "http://www.w3.org/2001/XMLSchema#string"
            );
        });

        it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"', () => {
            const string = "example";
            const language = "en";
            const term = dataFactory.literal(string, language);

            assert.equal(term.datatype.termType, "NamedNode");
            assert.equal(
                term.datatype.value,
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
            );
        });

        it("should create an object with a datatype property that contains a NamedNode with the given IRI", () => {
            const string = "example";
            const datatypeIRI = "http://example.org";
            const datatypeNode = dataFactory.namedNode(datatypeIRI);
            const term = dataFactory.literal(string, datatypeNode);

            assert.equal(term.datatype.termType, "NamedNode");
            assert.equal(term.datatype.value, datatypeIRI);
        });

        it("should create an object with a datatype property that contains the given NamedNode", () => {
            const string = "example";
            const datatype = dataFactory.namedNode("http://example.org");
            const term = dataFactory.literal(string, datatype);

            assert.equal(term.datatype.termType, "NamedNode");
            assert.equal(term.datatype.value, datatype.value);
        });

        describe("equals", () => {
            it("should be a method", () => {
                const term = dataFactory.literal("");

                assert.equal(typeof term.equals, "function");
            });

            it("should return true if termType, value, language and datatype are equal", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);
                const mock: Literal = {
                    termType: "Literal",
                    value: string,
                    language: language,
                    datatype: dataFactory.namedNode(
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                    ),
                    equals: () => true,
                };

                assert.equal(term.equals(mock), true);
            });

            it("should return false if termType is not equal", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);
                const mock: NamedNode = {
                    termType: "NamedNode",
                    value: string,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is not equal", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);
                const mock: Literal = {
                    termType: "Literal",
                    value: string + "1",
                    language: language,
                    datatype: dataFactory.namedNode(
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                    ),
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if language is not equal", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);
                const mock: Literal = {
                    termType: "Literal",
                    value: string,
                    language: "de",
                    datatype: dataFactory.namedNode(
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                    ),
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if datatype is not equal", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);
                const mock: Literal = {
                    termType: "Literal",
                    value: string,
                    language: language,
                    datatype: dataFactory.namedNode("http://example.org"),
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is falsy", () => {
                const string = "example";
                const language = "en";
                const term = dataFactory.literal(string, language);

                assert.equal(term.equals(null), false);
            });
        });
    });
    describe("namedNode", () => {
        it("should be a static method", () => {
            assert.equal(typeof dataFactory.namedNode, "function");
        });

        it('should create an object with a termType property that contains the value "NamedNode"', () => {
            const iri = "http://example.org";
            const term = dataFactory.namedNode(iri);

            assert.equal(term.termType, "NamedNode");
        });

        it("should create an object with a value property that contains the given IRI", () => {
            const iri = "http://example.org";
            const term = dataFactory.namedNode(iri);

            assert.equal(term.value, iri);
        });

        describe("equals", () => {
            it("should be a method", () => {
                const iri = "http://example.org";
                const term = dataFactory.namedNode(iri);

                assert.equal(typeof term.equals, "function");
            });

            it("should return true if termType and value are equal", () => {
                const iri = "http://example.org";
                const term = dataFactory.namedNode(iri);
                const mock: NamedNode = {
                    termType: "NamedNode",
                    value: iri,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), true);
            });

            it("should return false if termType is not equal", () => {
                const iri = "http://example.org";
                const term = dataFactory.namedNode(iri);
                const mock: BlankNode = {
                    termType: "BlankNode",
                    value: iri,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is not equal", () => {
                const iri = "http://example.org";
                const term = dataFactory.namedNode(iri);
                const mock: NamedNode = {
                    termType: "NamedNode",
                    value: iri + 1,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is falsy", () => {
                const iri = "http://example.org";
                const term = dataFactory.namedNode(iri);

                assert.equal(term.equals(null), false);
            });
        });
    });
    describe("quad", () => {
        it("should be a static method", () => {
            assert.equal(typeof dataFactory.quad, "function");
        });

        it("should create an object with .subject, .predicate, .object and .graph with the given values", () => {
            const subject = dataFactory.namedNode("http://example.org/subject");
            const predicate = dataFactory.namedNode(
                "http://example.org/predicate"
            );
            const object = dataFactory.namedNode("http://example.org/object");
            const graph = dataFactory.namedNode("http://example.org/graph");
            const quad = dataFactory.quad(subject, predicate, object, graph);

            assert.equal(subject.equals(quad.subject), true);
            assert.equal(predicate.equals(quad.predicate), true);
            assert.equal(object.equals(quad.object), true);
            assert.equal(graph.equals(quad.graph), true);

            assert.equal(quad.termType, "Quad");
            assert.equal(quad.value, "");
        });

        it("should create an object .graph set to DefaultGraph if the argument isn't given", () => {
            const subject = dataFactory.namedNode("http://example.org/subject");
            const predicate = dataFactory.namedNode(
                "http://example.org/predicate"
            );
            const object = dataFactory.namedNode("http://example.org/object");
            const graph = dataFactory.defaultGraph();
            const quad = dataFactory.quad(subject, predicate, object);

            assert.equal(quad.graph.equals(graph), true);

            assert.equal(quad.termType, "Quad");
            assert.equal(quad.value, "");
        });

        describe("equals", () => {
            it("should return true if the other quad contains the same subject, predicate, object and graph", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );
                const quad2 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );

                assert.equal(quad1.equals(quad2), true);
            });

            it("should return true even if the other equal quad is from a non-RDF* factory", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );
                const quad2 = { subject, predicate, object, graph };

                // @ts-ignore just a test, ignore not assignable error
                assert.equal(quad1.equals(quad2), true);
            });

            it("should return false if the subject of the other quad is not the same", () => {
                const subject1 = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const subject2 = dataFactory.namedNode(
                    "http://example.com/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject1,
                    predicate,
                    object,
                    graph
                );
                const quad2 = dataFactory.quad(
                    subject2,
                    predicate,
                    object,
                    graph
                );

                assert.equal(quad1.equals(quad2), false);
            });

            it("should return false even if the other non-equal quad is from a non-RDF* factory", () => {
                const subject1 = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const subject2 = dataFactory.namedNode(
                    "http://example.com/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject1,
                    predicate,
                    object,
                    graph
                );
                const quad2 = {
                    subject: subject2,
                    predicate,
                    object,
                    graph,
                };

                // @ts-ignore this is just a test, no need to complete types
                assert.equal(quad1.equals(quad2), false);
            });

            it("should return false if the predicate of the other quad is not the same", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate1 = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const predicate2 = dataFactory.namedNode(
                    "http://example.com/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject,
                    predicate1,
                    object,
                    graph
                );
                const quad2 = dataFactory.quad(
                    subject,
                    predicate2,
                    object,
                    graph
                );

                assert.equal(quad1.equals(quad2), false);
            });

            it("should return false if the object of the other quad is not the same", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object1 = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const object2 = dataFactory.namedNode(
                    "http://example.com/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject,
                    predicate,
                    object1,
                    graph
                );
                const quad2 = dataFactory.quad(
                    subject,
                    predicate,
                    object2,
                    graph
                );

                assert.equal(quad1.equals(quad2), false);
            });

            it("should return false if the graph of the other quad is not the same", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph1 = dataFactory.namedNode(
                    "http://example.org/graph"
                );
                const graph2 = dataFactory.namedNode(
                    "http://example.com/graph"
                );
                const quad1 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph1
                );
                const quad2 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph2
                );

                assert.equal(quad1.equals(quad2), false);
            });

            // TODO: recheck correctness of this test - what is a false value of a Term?
            it("should return false if value is falsy", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                assert.equal(quad.equals(null!), false);
            });

            it("should return false if value is another term", () => {
                const subject = dataFactory.namedNode(
                    "http://example.org/subject"
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.namedNode(
                    "http://example.org/object"
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );

                assert.equal(
                    quad.equals(
                        dataFactory.namedNode("http://example.org/subject")
                    ),
                    false
                );
                assert.equal(quad.equals(dataFactory.literal("abc")), false);
                if (dataFactory.variable)
                    assert.equal(
                        quad.equals(dataFactory.variable("var")),
                        false
                    );
                assert.equal(
                    quad.equals(dataFactory.blankNode("bnode")),
                    false
                );
                assert.equal(quad.equals(dataFactory.defaultGraph()), false);
            });

            it("should return true for an equal nested quad", () => {
                const subject = dataFactory.quad(
                    dataFactory.namedNode("http://example.org/subjectInner1"),
                    dataFactory.namedNode("http://example.org/predicateInner1"),
                    dataFactory.namedNode("http://example.org/objectInner1")
                );
                const predicate = dataFactory.namedNode(
                    "http://example.org/predicate"
                );
                const object = dataFactory.quad(
                    dataFactory.namedNode("http://example.org/subjectInner2"),
                    dataFactory.namedNode("http://example.org/predicateInner2"),
                    dataFactory.namedNode("http://example.org/objectInner2"),
                    dataFactory.namedNode("http://example.org/graphInner2")
                );
                const graph = dataFactory.namedNode("http://example.org/graph");
                const quad1 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );
                const quad2 = dataFactory.quad(
                    subject,
                    predicate,
                    object,
                    graph
                );

                assert.equal(quad1.equals(quad2), true);
            });
        });
    });

    describe("variable", () => {
        let dataFactoryVariable: (name: string) => Variable;

        if (dataFactory.variable === undefined) return;
        else dataFactoryVariable = dataFactory.variable.bind(dataFactory);

        it("should be a static method", () => {
            assert.equal(typeof dataFactoryVariable, "function");
        });

        it('should create an object with a termType property that contains the value "Variable"', () => {
            const name = "v";
            const term = dataFactoryVariable(name);

            assert.equal(term.termType, "Variable");
        });

        it("should create an object with a value property that contains the given name", () => {
            const name = "v";
            const term = dataFactoryVariable(name);

            assert.equal(term.value, name);
        });

        describe("equals", () => {
            it("should be a method", () => {
                const name = "v";
                const term = dataFactoryVariable(name);

                assert.equal(typeof term.equals, "function");
            });

            it("should return true if termType and value are equal", () => {
                const name = "v";
                const term = dataFactoryVariable(name);
                const mock: Variable = {
                    termType: "Variable",
                    value: name,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), true);
            });

            it("should return false if termType is not equal", () => {
                const name = "v";
                const term = dataFactoryVariable(name);
                const mock: NamedNode = {
                    termType: "NamedNode",
                    value: name,
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is not equal", () => {
                const name = "v";
                const term = dataFactoryVariable(name);
                const mock: Variable = {
                    termType: "Variable",
                    value: name + "1",
                    equals: () => true,
                };

                assert.equal(term.equals(mock), false);
            });

            it("should return false if value is falsy", () => {
                const name = "v";
                const term = dataFactoryVariable(name);

                assert.equal(term.equals(null), false);
            });
        });
    });
});
