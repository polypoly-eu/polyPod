"use strict";

let quads = [];

export function simpleJavaScriptCall() {
    console.log("simpleJavaScriptCall()");
}

export function awaitPodObject() {
    console.log(`pod: ${window.pod}`);
}

export function simpleFetch() {
    console.log("simpleFetch()");
    window.pod.polyOut.fetch("https://httpbin.org/robots.txt");
}

export function callFetchWithNoMethod() {
    console.log("callFetchWithNoMethod()");
    window.pod.polyOut.fetch("https://httpbin.org/robots.txt");
}

export function callFetchWithPostMethod() {
    console.log("callFetchWithPostMethod()");
    window.pod.polyOut.fetch("http://httpbin.org/post", {method: "POST"});
}

export function callFetchWithSingleHeaderInStringForm() {
    console.log("callFetchWithSingleHeaderInStringForm()");
    let key = getInput(1);
    let value = getInput(2);
    let headers = {};
    headers[key] = value;
    window.pod.polyOut.fetch("http://httpbin.org/headers", {headers: headers});
}

export function callFetchWithMultipleHeadersInStringForm() {
    console.log("callFetchWithMultipleHeadersInStringForm()");
    let key1 = getInput(1);
    let value1 = getInput(2);
    let key2 = getInput(3);
    let value2 = getInput(4);
    let headers = {};
    headers[key1] = value1;
    headers[key2] = value2;
    window.pod.polyOut.fetch("http://httpbin.org/headers", {headers: headers});
}

export function verifyBodyOfFetchResponse() {
    console.log("verifyBodyOfFetchResponse()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response =>
            // TODO - how to handle/reject streams?
            response.text()
                .then(text => setResult(text)));
}

export function verifyResponseStatusOfFetchCall() {
    console.log("verifyResponseStatusOfFetchCall()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response => {
            if (typeof response.status === "number")
                setResult(response.status)
            else
                throw new TypeError(`response.ok is not a number, it is: '${typeof response.status}'`)
        });
}

export function verifyResponseOkOfFetchCall() {
    console.log("verifyResponseOkOfFetchCall()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response => {
            if (typeof response.ok === "boolean")
                setResult(response.ok)
            else
                throw new TypeError(`response.ok is not a boolean, it is: '${typeof response.ok}'`)
        });
}

export function callFetchWithPostMethodAndBody() {
    console.log("callFetchWithPostMethodAndBOdy()");
    let body = getInput(1);
    window.pod.polyOut.fetch("http://httpbin.org/post", {method: "POST", body: body});
}

export function canCallPolyInAddWithNoQuads() {
    console.log("canCallPolyInAddWithNoQuads()");
    window.pod.polyIn.add([]);
}

export function canCallPolyInAddWithSingleQuad() {
    console.log("canCallPolyInAddWithSingleQuad()");
    const quad = QuadBuilder.fromInputs().build();
    window.pod.polyIn.add([quad]);
}

export function canCallPolyInAddWithMultipleQuads() {
    console.log(`canCallPolyInAddWithMultipleQuads(), quads: '${quads}'`);
    window.pod.polyIn.add(quads);
}

export function addSupportsQuadsWithNamedNodeSubject() {
    console.log(`addSupportsQuadsWithNamedNodeSubject()`);
    const quad = QuadBuilder.fromInputs().build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithBlankNodeSubject() {
    console.log(`addSupportsQuadsWithBlankNodeSubject()`);
    let subject = getInput(1);
    const quad = QuadBuilder.fromInputs()
        .withSubject(window.pod.dataFactory.blankNode(subject))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithNamedNodeObject() {
    console.log(`addSupportsQuadsWithNamedNodeObject()`);
    let object = getInput(3);
    const quad = QuadBuilder.fromInputs()
        .withObject(window.pod.dataFactory.namedNode(object))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithBlankNodeObject() {
    console.log(`addSupportsQuadsWithBlankNodeObject()`);
    let object = getInput(3);
    const quad = QuadBuilder.fromInputs()
        .withObject(window.pod.dataFactory.blankNode(object))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithLiteralObject() {
    console.log(`addSupportsQuadsWithLiteralObject()`);
    let object = getInput(3);
    const quad = QuadBuilder.fromInputs()
        .withObject(window.pod.dataFactory.literal(object))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithNamedNodeGraph() {
    console.log(`addSupportsQuadsWithNamedNodeGraph()`);
    let graph = getInput(4);
    const quad = QuadBuilder.fromInputs()
        .withGraph(window.pod.dataFactory.namedNode(graph))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithBlankNodeGraph() {
    console.log(`addSupportsQuadsWithBlankNodeGraph()`);
    let graph = getInput(4);
    const quad = QuadBuilder.fromInputs()
        .withGraph(window.pod.dataFactory.blankNode(graph))
        .build();
    window.pod.polyIn.add([quad]);
}

export function addSupportsQuadsWithDefaultGraph() {
    console.log(`addSupportsQuadsWithDefaultGraph()`);
    const quad = QuadBuilder.fromInputs()
        .withGraph(window.pod.dataFactory.defaultGraph())
        .build();
    window.pod.polyIn.add([quad]);
}

export function canPassEmptyMatcherToPolyInSelect() {
    console.log("canPassEmptyMatcherToPolyInSelect()");
    window.pod.polyIn.select({});
}

export function canPassMatcherWithSubjectToPolyInSelect() {
    console.log("canPassMatcherWithSubjectToPolyInSelect()");
    const subject = getInput(1);
    let matcher = {subject: window.pod.dataFactory.namedNode(subject)};
    window.pod.polyIn.select(matcher);
}

export function canPassMatcherWithPredicateToPolyInSelect() {
    console.log("canPassMatcherWithPredicateToPolyInSelect()");
    const predicate = getInput(1);
    let matcher = {predicate: window.pod.dataFactory.namedNode(predicate)};
    window.pod.polyIn.select(matcher);
}

export function canPassMatcherWithObjectToPolyInSelect() {
    console.log("canPassMatcherWithObjectToPolyInSelect()");
    const object = getInput(1);
    let matcher = {object: window.pod.dataFactory.namedNode(object)};
    window.pod.polyIn.select(matcher);
}

export function canPassMatcherWithAllThreeFieldsToPolyInSelect() {
    console.log("canPassMatcherWithAllThreeFieldsToPolyInSelect()");
    const subject = getInput(1);
    const predicate = getInput(2);
    const object = getInput(3);
    let dataFactory = window.pod.dataFactory;
    let matcher = {subject: dataFactory.namedNode(subject), predicate: dataFactory.namedNode(predicate), object: dataFactory.namedNode(object)};
    window.pod.polyIn.select(matcher);
}

export function canGetEmptyArrayFromPolyInSelect() {
    console.log("canGetEmptyArrayFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

export function canGetArrayWithSingleQuadFromPolyInSelect() {
    console.log("canGetArrayWithSingleQuadFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

export function canGetArrayWithMultipleQuadsFromPolyInSelect() {
    console.log("canGetArrayWithMultipleQuadsFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

export function clearQuadCollection() {
    console.log(`clearQuadCollection()`);
    quads = [];
}

export function addQuadToCollection() {
    console.log(`addQuadToCollection(), current value: '${quads}'`);
    const quad = QuadBuilder.fromInputs().build();
    quads.push(quad);
}

export async function execute(test) {
    setStatus("Running...");
    await awaitPodApi();
    try {
        test();
        setStatus("All OK");
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
        setStatus(`Failed: ${e.message}`);
    }
}

function setStatus(status) {
    console.debug(`Setting status: '${status}'`);
    document.getElementById("status").innerText = status;
}

async function awaitPodApi() {
    return new Promise(resolve => {
        let timerId;
        timerId = setInterval(() => {
            if (window.pod !== null && window.pod !== undefined) {
                console.log("Got the Pod, clearing...");
                clearInterval(timerId);
                resolve(window.pod);
            }
        }, 100);
    });
}

function getInput(i) {
    return document.getElementById(`input.${i}`).value;
}

function setResult(result) {
    console.debug(`Setting result: '${result}'`);
    document.getElementById("result").innerText = result;
}

class QuadBuilder {
    constructor(subject, predicate, object, graph) {
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.graph = graph;
    }

    static fromInputs() {
        let dataFactory = window.pod.dataFactory;
        let subject = dataFactory.namedNode(getInput(1));
        let predicate = dataFactory.namedNode(getInput(2));
        let object = dataFactory.namedNode(getInput(3));
        let graph = dataFactory.namedNode(getInput(4));
        return new QuadBuilder(subject, predicate, object, graph);
    }

    withSubject(subject) {
        this.subject = subject;
        return this;
    }

    withObject(object) {
        this.object = object;
        return this;
    }

    withGraph(graph) {
        this.graph = graph;
        return this;
    }

    build() {
        return window.pod.dataFactory.quad(this.subject, this.predicate, this.object, this.graph);
    }
}
