/**
 * Executable specification for data factories. See [[DataFactorySpec]] for details.
 *
 * @packageDocumentation
 */

import fc from "fast-check";
import { gens } from "./gen";
import { BaseQuad, DataFactory, Quad, Variable } from "rdf-js";
import { assert } from "chai";

/**
 * Class containing test cases for data factories. Use [[DataFactorySpec.run]] to execute all tests.
 *
 * The tests are composed of simple unit tests originating from the
 * [reference implementation](https://github.com/rdfjs-base/data-model) and custom property tests.
 *
 * Tests dealing with variables are only executed if the data factory supports variables.
 *
 * Equality of quads is tested against `null` which goes against the types but must be supported according to the
 * textual specification.
 *
 * The tests use [Chai](https://www.chaijs.com/) for assertions that are independent from any one test framework. Tests
 * are written using the standard functions `describe` and `it`. This allows them to run under different frameworks,
 * such as:
 *
 * - [Mocha](https://mochajs.org/)
 * - [Jest](https://jestjs.io/)
 * - [Jasmine](https://jasmine.github.io/)
 *
 * Cross-factory interoperability can be tested using [[ConvertSpec]].
 */
export class DataFactorySpec<OutQuad extends BaseQuad = Quad> {
    constructor(private readonly dataFactory: DataFactory<OutQuad>) {}

    blankNode(): void {
        describe(".blankNode", () => {
            it("should be a static method", () => {
                assert.equal(typeof this.dataFactory.blankNode, "function");
            });

            it('should create an object with a termType property that contains the value "BlankNode"', () => {
                const term = this.dataFactory.blankNode();

                assert.equal(term.termType, "BlankNode");
            });

            it("should create an object with a value property that contains a unique identifier", () => {
                const term1 = this.dataFactory.blankNode();
                const term2 = this.dataFactory.blankNode();

                assert.notEqual(term1.value, term2.value);
            });

            it("should create an object with a value property that contains the given identifier", () => {
                const id = "b1";
                const term = this.dataFactory.blankNode(id);

                assert.equal(term.value, id);
            });

            describe(".equals", () => {
                it("should be a method", () => {
                    const term = this.dataFactory.blankNode();

                    assert.equal(typeof term.equals, "function");
                });

                it("should return true if termType and value are equal", () => {
                    const id = "b1";
                    const term = this.dataFactory.blankNode(id);
                    const mock: any = { termType: "BlankNode", value: id };

                    assert.equal(term.equals(mock), true);
                });

                it("should return false if termType is not equal", () => {
                    const id = "b1";
                    const term = this.dataFactory.blankNode(id);
                    const mock: any = { termType: "NamedNode", value: id };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is not equal", () => {
                    const id = "b1";
                    const term = this.dataFactory.blankNode(id);
                    const mock: any = { termType: "BlankNode", value: id + "1" };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is falsy", () => {
                    const id = "b1";
                    const term = this.dataFactory.blankNode(id);

                    assert.equal(term.equals(null), false);
                });
            });
        });
    }

    defaultGraph(): void {
        describe(".defaultGraph", () => {
            it("should be a static method", () => {
                assert.equal(typeof this.dataFactory.defaultGraph, "function");
            });

            it('should create an object with a termType property that contains the value "DefaultGraph"', () => {
                const term = this.dataFactory.defaultGraph();

                assert.equal(term.termType, "DefaultGraph");
            });

            it("should create an object with a value property that contains an empty string", () => {
                const term = this.dataFactory.defaultGraph();

                assert.equal(term.value, "");
            });

            describe(".equals", () => {
                it("should be a method", () => {
                    const term = this.dataFactory.defaultGraph();

                    assert.equal(typeof term.equals, "function");
                });

                it("should return true if termType and value are equal", () => {
                    const term = this.dataFactory.defaultGraph();
                    const mock: any = { termType: "DefaultGraph", value: "" };

                    assert.equal(term.equals(mock), true);
                });

                it("should return false if termType is not equal", () => {
                    const term = this.dataFactory.defaultGraph();
                    const mock: any = { termType: "NamedNode", value: "" };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is falsy", () => {
                    const term = this.dataFactory.defaultGraph();

                    assert.equal(term.equals(null), false);
                });
            });
        });
    }

    literal(): void {
        describe(".literal", () => {
            it("should be a static method", () => {
                assert.equal(typeof this.dataFactory.literal, "function");
            });

            it('should create an object with a termType property that contains the value "Literal"', () => {
                const string = "example";
                const term = this.dataFactory.literal(string);

                assert.equal(term.termType, "Literal");
            });

            it("should create an object with a value property that contains the given string", () => {
                const string = "example";
                const term = this.dataFactory.literal(string);

                assert.equal(term.value, string);
            });

            it("should create an object with a language property that contains an empty string", () => {
                const string = "example";
                const term = this.dataFactory.literal(string);

                assert.equal(term.language, "");
            });

            it("should create an object with a language property that contains the given language string", () => {
                const string = "example";
                const language = "en";
                const term = this.dataFactory.literal(string, language);

                assert.equal(term.language, language);
            });

            it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/2001/XMLSchema#string"', () => {
                const string = "example";
                const term = this.dataFactory.literal(string);

                assert.equal(term.datatype.termType, "NamedNode");
                assert.equal(term.datatype.value, "http://www.w3.org/2001/XMLSchema#string");
            });

            it('should create an object with a datatype property that contains a NamedNode with the value "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"', () => {
                const string = "example";
                const language = "en";
                const term = this.dataFactory.literal(string, language);

                assert.equal(term.datatype.termType, "NamedNode");
                assert.equal(
                    term.datatype.value,
                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                );
            });

            it("should create an object with a datatype property that contains a NamedNode with the given IRI", () => {
                const string = "example";
                const datatypeIRI = "http://example.org";
                const datatypeNode = this.dataFactory.namedNode(datatypeIRI);
                const term = this.dataFactory.literal(string, datatypeNode);

                assert.equal(term.datatype.termType, "NamedNode");
                assert.equal(term.datatype.value, datatypeIRI);
            });

            it("should create an object with a datatype property that contains the given NamedNode", () => {
                const string = "example";
                const datatype = this.dataFactory.namedNode("http://example.org");
                const term = this.dataFactory.literal(string, datatype);

                assert.equal(term.datatype.termType, "NamedNode");
                assert.equal(term.datatype.value, datatype.value);
            });

            describe(".equals", () => {
                it("should be a method", () => {
                    const term = this.dataFactory.literal("");

                    assert.equal(typeof term.equals, "function");
                });

                it("should return true if termType, value, language and datatype are equal", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);
                    const mock: any = {
                        termType: "Literal",
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode(
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                        ),
                    };

                    assert.equal(term.equals(mock), true);
                });

                it("should return false if termType is not equal", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);
                    const mock: any = {
                        termType: "NamedNode",
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode(
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                        ),
                    };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is not equal", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);
                    const mock: any = {
                        termType: "Literal",
                        value: string + "1",
                        language: language,
                        datatype: this.dataFactory.namedNode(
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                        ),
                    };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if language is not equal", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);
                    const mock: any = {
                        termType: "Literal",
                        value: string,
                        language: "de",
                        datatype: this.dataFactory.namedNode(
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
                        ),
                    };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if datatype is not equal", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);
                    const mock: any = {
                        termType: "Literal",
                        value: string,
                        language: language,
                        datatype: this.dataFactory.namedNode("http://example.org"),
                    };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is falsy", () => {
                    const string = "example";
                    const language = "en";
                    const term = this.dataFactory.literal(string, language);

                    assert.equal(term.equals(null), false);
                });
            });
        });
    }

    namedNode(): void {
        describe(".namedNode", () => {
            it("should be a static method", () => {
                assert.equal(typeof this.dataFactory.namedNode, "function");
            });

            it('should create an object with a termType property that contains the value "NamedNode"', () => {
                const iri = "http://example.org";
                const term = this.dataFactory.namedNode(iri);

                assert.equal(term.termType, "NamedNode");
            });

            it("should create an object with a value property that contains the given IRI", () => {
                const iri = "http://example.org";
                const term = this.dataFactory.namedNode(iri);

                assert.equal(term.value, iri);
            });

            describe(".equals", () => {
                it("should be a method", () => {
                    const iri = "http://example.org";
                    const term = this.dataFactory.namedNode(iri);

                    assert.equal(typeof term.equals, "function");
                });

                it("should return true if termType and value are equal", () => {
                    const iri = "http://example.org";
                    const term = this.dataFactory.namedNode(iri);
                    const mock: any = { termType: "NamedNode", value: iri };

                    assert.equal(term.equals(mock), true);
                });

                it("should return false if termType is not equal", () => {
                    const iri = "http://example.org";
                    const term = this.dataFactory.namedNode(iri);
                    const mock: any = { termType: "BlankNode", value: iri };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is not equal", () => {
                    const iri = "http://example.org";
                    const term = this.dataFactory.namedNode(iri);
                    const mock: any = { termType: "NamedNode", value: iri + "1" };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is falsy", () => {
                    const iri = "http://example.org";
                    const term = this.dataFactory.namedNode(iri);

                    assert.equal(term.equals(null), false);
                });
            });
        });
    }

    quad(): void {
        describe(".quad", () => {
            it("should be a static method", () => {
                assert.equal(typeof this.dataFactory.quad, "function");
            });

            it("should create an object with .subject, .predicate, .object and .graph with the given values", () => {
                const subject = this.dataFactory.namedNode("http://example.org/subject");
                const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                const object = this.dataFactory.namedNode("http://example.org/object");
                const graph = this.dataFactory.namedNode("http://example.org/graph");
                const quad = this.dataFactory.quad(subject, predicate, object, graph);

                assert.equal(subject.equals(quad.subject), true);
                assert.equal(predicate.equals(quad.predicate), true);
                assert.equal(object.equals(quad.object), true);
                assert.equal(graph.equals(quad.graph), true);

                assert.equal(quad.termType, "Quad");
                assert.equal(quad.value, "");
            });

            it("should create an object .graph set to DefaultGraph if the argument isn't given", () => {
                const subject = this.dataFactory.namedNode("http://example.org/subject");
                const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                const object = this.dataFactory.namedNode("http://example.org/object");
                const graph = this.dataFactory.defaultGraph();
                const quad = this.dataFactory.quad(subject, predicate, object);

                assert.equal(quad.graph.equals(graph), true);

                assert.equal(quad.termType, "Quad");
                assert.equal(quad.value, "");
            });

            describe(".equals", () => {
                it("should return true if the other quad contains the same subject, predicate, object and graph", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate, object, graph);

                    assert.equal(quad1.equals(quad2), true);
                });

                it("should return true even if the other equal quad is from a non-RDF* factory", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph);
                    const quad2 = { subject, predicate, object, graph };

                    // @ts-ignore just a test, ignore not assignable error
                    assert.equal(quad1.equals(quad2), true);
                });

                it("should return false if the subject of the other quad is not the same", () => {
                    const subject1 = this.dataFactory.namedNode("http://example.org/subject");
                    const subject2 = this.dataFactory.namedNode("http://example.com/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject1, predicate, object, graph);
                    const quad2 = this.dataFactory.quad(subject2, predicate, object, graph);

                    assert.equal(quad1.equals(quad2), false);
                });

                it("should return false even if the other non-equal quad is from a non-RDF* factory", () => {
                    const subject1 = this.dataFactory.namedNode("http://example.org/subject");
                    const subject2 = this.dataFactory.namedNode("http://example.com/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject1, predicate, object, graph);
                    const quad2 = { subject: subject2, predicate, object, graph };

                    // @ts-ignore this is just a test, no need to complete types
                    assert.equal(quad1.equals(quad2), false);
                });

                it("should return false if the predicate of the other quad is not the same", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate1 = this.dataFactory.namedNode("http://example.org/predicate");
                    const predicate2 = this.dataFactory.namedNode("http://example.com/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate1, object, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate2, object, graph);

                    assert.equal(quad1.equals(quad2), false);
                });

                it("should return false if the object of the other quad is not the same", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object1 = this.dataFactory.namedNode("http://example.org/object");
                    const object2 = this.dataFactory.namedNode("http://example.com/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate, object1, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate, object2, graph);

                    assert.equal(quad1.equals(quad2), false);
                });

                it("should return false if the graph of the other quad is not the same", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph1 = this.dataFactory.namedNode("http://example.org/graph");
                    const graph2 = this.dataFactory.namedNode("http://example.com/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph1);
                    const quad2 = this.dataFactory.quad(subject, predicate, object, graph2);

                    assert.equal(quad1.equals(quad2), false);
                });

                it("should return false if value is falsy", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad = this.dataFactory.quad(subject, predicate, object, graph);

                    assert.equal(quad.equals(null!), false);
                });

                it("should return false if value is another term", () => {
                    const subject = this.dataFactory.namedNode("http://example.org/subject");
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.namedNode("http://example.org/object");
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad = this.dataFactory.quad(subject, predicate, object, graph);

                    assert.equal(
                        quad.equals(this.dataFactory.namedNode("http://example.org/subject")),
                        false
                    );
                    assert.equal(quad.equals(this.dataFactory.literal("abc")), false);
                    if (this.dataFactory.variable)
                        assert.equal(quad.equals(this.dataFactory.variable("var")), false);
                    assert.equal(quad.equals(this.dataFactory.blankNode("bnode")), false);
                    assert.equal(quad.equals(this.dataFactory.defaultGraph()), false);
                });

                it("should return true for an equal nested quad", () => {
                    const subject = this.dataFactory.quad(
                        this.dataFactory.namedNode("http://example.org/subjectInner1"),
                        this.dataFactory.namedNode("http://example.org/predicateInner1"),
                        this.dataFactory.namedNode("http://example.org/objectInner1")
                    );
                    const predicate = this.dataFactory.namedNode("http://example.org/predicate");
                    const object = this.dataFactory.quad(
                        this.dataFactory.namedNode("http://example.org/subjectInner2"),
                        this.dataFactory.namedNode("http://example.org/predicateInner2"),
                        this.dataFactory.namedNode("http://example.org/objectInner2"),
                        this.dataFactory.namedNode("http://example.org/graphInner2")
                    );
                    const graph = this.dataFactory.namedNode("http://example.org/graph");
                    const quad1 = this.dataFactory.quad(subject, predicate, object, graph);
                    const quad2 = this.dataFactory.quad(subject, predicate, object, graph);

                    assert.equal(quad1.equals(quad2), true);
                });
            });
        });
    }

    variable(): void {
        let dataFactoryVariable: (name: string) => Variable;

        if (this.dataFactory.variable === undefined) return;
        else dataFactoryVariable = this.dataFactory.variable.bind(this.dataFactory);

        describe(".variable", () => {
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

            describe(".equals", () => {
                it("should be a method", () => {
                    const name = "v";
                    const term = dataFactoryVariable(name);

                    assert.equal(typeof term.equals, "function");
                });

                it("should return true if termType and value are equal", () => {
                    const name = "v";
                    const term = dataFactoryVariable(name);
                    const mock: any = { termType: "Variable", value: name };

                    assert.equal(term.equals(mock), true);
                });

                it("should return false if termType is not equal", () => {
                    const name = "v";
                    const term = dataFactoryVariable(name);
                    const mock: any = { termType: "NamedNode", value: name };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is not equal", () => {
                    const name = "v";
                    const term = dataFactoryVariable(name);
                    const mock: any = { termType: "Variable", value: name + "1" };

                    assert.equal(term.equals(mock), false);
                });

                it("should return false if value is falsy", () => {
                    const name = "v";
                    const term = dataFactoryVariable(name);

                    assert.equal(term.equals(null), false);
                });
            });
        });
    }

    gen(): void {
        const gen = gens(this.dataFactory);
        describe("Gens", () => {
            describe("self-equals", () => {
                for (const [key, g] of Object.entries(gen))
                    if (g !== undefined)
                        it(key, () => {
                            fc.assert(
                                fc.property(g, (term) => {
                                    assert((term as any).equals(term));
                                })
                            );
                        });
            });
            describe("not equal (terms)", () => {
                const keys = ["namedNode", "blankNode", "literal", "variable"];
                for (const key1 of keys)
                    for (const key2 of keys)
                        if (key1 !== key2)
                            it(`${key1}/${key2}`, () => {
                                const gen1 = (gen as any)[key1];
                                const gen2 = (gen as any)[key2];
                                if (gen1 === undefined || gen2 === undefined) return;
                                fc.assert(
                                    fc.property(gen1, gen2, (term1, term2) => {
                                        assert.equal((term1 as any).equals(term2), false);
                                    })
                                );
                            });
            });
        });
    }

    run(): void {
        this.blankNode();
        this.defaultGraph();
        this.literal();
        this.namedNode();
        this.quad();
        this.variable();
        this.gen();
    }
}
