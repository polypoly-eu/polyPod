import { Pod, PolyIn } from "@polypoly-eu/pod-api";
import * as RDF from "rdf-js";

let quads: Array<RDF.Quad> = [];
let pod: Pod;
let polyIn: PolyIn;

// TODO: Workaround for missing console.debug on iOS
console.debug = console.debug || console.log;

const tests = {
    /*
      Tests prefixed with _ are disabled, and will not be exposed.  Most of
      those are disabled because they test functionality we would like to have
      one day, but don't actually need (and thus, support) yet.
     */

    simpleJavaScriptCall(): void {
        console.log("simpleJavaScriptCall()");
        return;
    },

    async podApiResolves(): void {
        console.log("podApiResolves()");
        await pod;
    },

    async canCallPolyInAddWithNoQuads(): Promise<void> {
        console.log("canCallPolyInAddWithNoQuads()");
        await polyIn.add();
    },

    async _canCallPolyInAddWithSingleQuad(): Promise<void> {
        console.log("canCallPolyInAddWithSingleQuad()");
        const quad = QuadBuilder.fromInputs().build();
        await polyIn.add(quad);
    },

    async _canCallPolyInAddWithMultipleQuads(): Promise<void> {
        console.log(`canCallPolyInAddWithMultipleQuads(), quads: '${quads}'`);
        await polyIn.add(...quads);
    },

    async _addSupportsQuadsWithNamedNodeSubject(): Promise<void> {
        console.log(`addSupportsQuadsWithNamedNodeSubject()`);
        const quad = QuadBuilder.fromInputs().build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithBlankNodeSubject(): Promise<void> {
        console.log(`addSupportsQuadsWithBlankNodeSubject()`);
        const subject = getInput(1);
        const quad = QuadBuilder.fromInputs()
            .withSubject(window.pod.dataFactory.blankNode(subject))
            .build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithNamedNodeObject(): Promise<void> {
        console.log(`addSupportsQuadsWithNamedNodeObject()`);
        const object = getInput(3);
        const quad = QuadBuilder.fromInputs()
            .withObject(window.pod.dataFactory.namedNode(object))
            .build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithBlankNodeObject(): Promise<void> {
        console.log(`addSupportsQuadsWithBlankNodeObject()`);
        const object = getInput(3);
        const quad = QuadBuilder.fromInputs()
            .withObject(window.pod.dataFactory.blankNode(object))
            .build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithLiteralObject(): Promise<void> {
        console.log(`addSupportsQuadsWithLiteralObject()`);
        const object = getInput(3);
        const quad = QuadBuilder.fromInputs()
            .withObject(window.pod.dataFactory.literal(object))
            .build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithNamedNodeGraph(): Promise<void> {
        console.log(`addSupportsQuadsWithNamedNodeGraph()`);
        const graph = getInput(4);
        const quad = QuadBuilder.fromInputs()
            .withGraph(window.pod.dataFactory.namedNode(graph))
            .build();
        await polyIn.add(quad);
    },

    async _addSupportsQuadsWithBlankNodeGraph(): Promise<void> {
        console.log(`addSupportsQuadsWithBlankNodeGraph()`);
        const graph = getInput(4);
        const quad = QuadBuilder.fromInputs()
            .withGraph(window.pod.dataFactory.blankNode(graph))
            .build();
        await polyIn.add(quad);
    },

    async addSupportsQuadsWithDefaultGraph(): Promise<void> {
        console.log(`addSupportsQuadsWithDefaultGraph()`);
        const quad = QuadBuilder.fromInputs()
            .withGraph(window.pod.dataFactory.defaultGraph())
            .build();
        await polyIn.add(quad);
    },

    async canPassEmptyMatcherToPolyInMatch(): Promise<void> {
        console.log("canPassEmptyMatcherToPolyInMatch()");
        await polyIn.match({});
    },

    async canPassMatcherWithSubjectToPolyInMatch(): Promise<void> {
        console.log("canPassMatcherWithSubjectToPolyInMatch()");
        const subject = getInput(1);
        const matcher = { subject: window.pod.dataFactory.namedNode(subject) };
        await polyIn.match(matcher);
    },

    async canPassMatcherWithPredicateToPolyInMatch(): Promise<void> {
        console.log("canPassMatcherWithPredicateToPolyInMatch()");
        const predicate = getInput(1);
        const matcher = {
            predicate: window.pod.dataFactory.namedNode(predicate),
        };
        await polyIn.match(matcher);
    },

    async canPassMatcherWithObjectToPolyInMatch(): Promise<void> {
        console.log("canPassMatcherWithObjectToPolyInMatch()");
        const object = getInput(1);
        const matcher = { object: window.pod.dataFactory.namedNode(object) };
        await polyIn.match(matcher);
    },

    async canPassMatcherWithAllThreeFieldsToPolyInMatch(): Promise<void> {
        console.log("canPassMatcherWithAllThreeFieldsToPolyInMatch()");
        const subject = getInput(1);
        const predicate = getInput(2);
        const object = getInput(3);
        const dataFactory = window.pod.dataFactory;
        const matcher = {
            subject: dataFactory.namedNode(subject),
            predicate: dataFactory.namedNode(predicate),
            object: dataFactory.namedNode(object),
        };
        await polyIn.match(matcher);
    },

    async _canGetEmptyArrayFromPolyInMatch(): Promise<void> {
        console.log("canGetEmptyArrayFromPolyInMatch()");
        const result = await polyIn.match({});
        if (!Array.isArray(result) || result.length !== 0)
            throw Error(
                `Expected empty array, got '${JSON.stringify(result)}'`
            );
    },

    async _canGetArrayWithSingleQuadFromPolyInMatch(): Promise<void> {
        console.log("canGetArrayWithSingleQuadFromPolyInMatch()");
        const expectedResult = QuadBuilder.fromQuad(quads[0]).build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithNamedNodeSubjectFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithNamedNodeSubjectFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withSubject(pod.dataFactory.namedNode(quads[0].subject.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithBlankNodeSubjectFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithBlankNodeSubjectFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withSubject(pod.dataFactory.blankNode(quads[0].subject.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithNamedNodeObjectFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithNamedNodeObjectFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withObject(pod.dataFactory.namedNode(quads[0].object.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithBlankNodeObjectFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithBlankNodeObjectFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withObject(pod.dataFactory.blankNode(quads[0].object.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithLiteralObjectFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithLiteralObjectFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withObject(pod.dataFactory.literal(quads[0].object.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithNamedNodeGraphFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithNamedNodeGraphFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withGraph(pod.dataFactory.namedNode(quads[0].graph.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithBlankNodeGraphFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithBlankNodeGraphFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withGraph(pod.dataFactory.blankNode(quads[0].graph.value))
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithSingleQuadWithDefaultGraphFromPolyInMatch(): Promise<void> {
        console.log(
            "canGetArrayWithSingleQuadWithDefaultGraphFromPolyInMatch()"
        );
        const expectedResult = QuadBuilder.fromQuad(quads[0])
            .withGraph(pod.dataFactory.defaultGraph())
            .build();
        const result = await polyIn.match({});
        if (result.length !== 1)
            throw Error(
                `Expected array with 1 element, got ${result.length} elements`
            );
        if (!result[0].equals(expectedResult))
            throw Error(
                `Expected element equal to '${JSON.stringify(
                    expectedResult
                )}', got '${JSON.stringify(result[0])}'`
            );
    },

    async _canGetArrayWithMultipleQuadsFromPolyInMatch(): Promise<void> {
        console.log("canGetArrayWithMultipleQuadsFromPolyInMatch()");
        const result = await polyIn.match({});
        if (result.length !== 2)
            throw Error(
                `Expected array with 2 elements, got ${result.length} elements`
            );
        if (!result[0].equals(quads[0]) && !result[1].equals(quads[0]))
            throw Error(
                `Expected one element equal to '${JSON.stringify(
                    quads[0]
                )}', none found, whole result: '${JSON.stringify(result)}'`
            );
        if (!result[0].equals(quads[1]) && !result[1].equals(quads[1]))
            throw Error(
                `Expected one element equal to '${JSON.stringify(
                    quads[1]
                )}', none found, whole result: '${JSON.stringify(result)}'`
            );
    },

    clearQuadCollection(): void {
        console.log(`clearQuadCollection()`);
        quads = [];
    },

    addQuadToCollection(): void {
        console.log(`addQuadToCollection(), current value: '${quads}'`);
        const quad = QuadBuilder.fromInputs().build();
        quads.push(quad);
    },
};

async function execute(test: () => void): Promise<void> {
    setStatus("Running...");
    pod = await awaitPodApi();
    polyIn = pod.polyIn;
    try {
        await test();
        setStatus("All OK");
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
        setStatus(`Failed: ${e.message}`);
    }
}

function setStatus(status): void {
    console.debug(`Setting status: '${status}'`);
    document.getElementById("status").innerText = status;
}

async function awaitPodApi(): Promise<Pod> {
    return new Promise((resolve) => {
        const timerId = setInterval(() => {
            if (window.pod !== null && window.pod !== undefined) {
                console.log("Got the Pod, clearing...");
                clearInterval(timerId);
                resolve(window.pod);
            }
        }, 100);
    });
}

export function generateButtons(container: HTMLElement): void {
    for (const [name, test] of Object.entries(tests)) {
        if (name.startsWith("_")) continue;
        const button = document.createElement("button");
        button.id = button.textContent = name;
        button.addEventListener("click", () => execute(test));
        container.appendChild(button);
    }
}

function getInput(i): string {
    return (document.getElementById(`input.${i}`) as HTMLInputElement).value;
}

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
        const subject = dataFactory.namedNode(getInput(1));
        const predicate = dataFactory.namedNode(getInput(2));
        const object = dataFactory.namedNode(getInput(3));
        const graph = dataFactory.namedNode(getInput(4));
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
