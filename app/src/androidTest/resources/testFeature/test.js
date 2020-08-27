let quads = [];

function simpleJavaScriptCall() {
    console.log("simpleJavaScriptCall()");
}

function awaitPodObject() {
    console.log(`pod: ${window.pod}`);
}

function simpleFetch() {
    console.log("simpleFetch()");
    window.pod.polyOut.fetch("https://httpbin.org/robots.txt");
}

function callFetchWithNoMethod() {
    console.log("callFetchWithNoMethod()");
    window.pod.polyOut.fetch("https://httpbin.org/robots.txt");
}

function callFetchWithPostMethod() {
    console.log("callFetchWithPostMethod()");
    window.pod.polyOut.fetch("http://httpbin.org/post", {method: "POST"});
}

function callFetchWithSingleHeaderInStringForm() {
    console.log("callFetchWithSingleHeaderInStringForm()");
    let key = getInput(1);
    let value = getInput(2);
    let headers = {};
    headers[key] = value;
    window.pod.polyOut.fetch("http://httpbin.org/headers", {headers: headers});
}

function verifyBodyOfFetchResponse() {
    console.log("verifyBodyOfFetchResponse()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response =>
            // TODO - how to handle/reject streams?
            response.text()
                .then(text => setResult(text)));
}

function verifyResponseStatusOfFetchCall() {
    console.log("verifyResponseStatusOfFetchCall()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response => {
            if (typeof response.status === "number")
                setResult(response.status)
            else
                throw new TypeError(`response.ok is not a number, it is: '${typeof response.status}'`)
        });
}

function verifyResponseOkOfFetchCall() {
    console.log("verifyResponseOkOfFetchCall()");
    window.pod.polyOut.fetch("http://httpbin.org/robots.txt")
        .then(response => {
            if (typeof response.ok === "boolean")
                setResult(response.ok)
            else
                throw new TypeError(`response.ok is not a boolean, it is: '${typeof response.ok}'`)
        });
}

function callFetchWithPostMethodAndBody() {
    console.log("callFetchWithPostMethodAndBOdy()");
    let body = getInput(1);
    window.pod.polyOut.fetch("http://httpbin.org/post", {method: "POST", body: body});
}

function canCallPolyInAddWithNoQuads() {
    console.log("canCallPolyInAddWithNoQuads()");
    window.pod.polyIn.add([]);
}

function canCallPolyInAddWithSingleQuad() {
    console.log("canCallPolyInAddWithSingleQuad()");
    const quad = createQuadFromInputs();
    window.pod.polyIn.add([quad]);
}

function addQuadToCollection() {
    console.log(`addQuadToCollection(), current value: '${quads}'`);
    const quad = createQuadFromInputs();
    quads.push(quad);
}

function canCallPolyInAddWithMultipleQuads() {
    console.log(`canCallPolyInAddWithMultipleQuads(), quads: '${quads}'`);
    window.pod.polyIn.add(quads);
}

function addSupportsQuadsWithIRISubject() {
    console.log(`addSupportsQuadsWithIRISubject()`);
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let graph = getInput(4);
    let dataFactory = window.pod.dataFactory;
    const quad = dataFactory.quad(
        dataFactory.namedNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.namedNode(object),
        dataFactory.namedNode(graph)
    );
    window.pod.polyIn.add([quad]);
}

function addSupportsQuadsWithBlankNodeSubject() {
    console.log(`addSupportsQuadsWithBlankNodeSubject()`);
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let graph = getInput(4);
    let dataFactory = window.pod.dataFactory;
    const quad = dataFactory.quad(
        dataFactory.blankNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.namedNode(object),
        dataFactory.namedNode(graph)
    );
    window.pod.polyIn.add([quad]);
}

function addSupportsQuadsWithBlankNodeObject() {
    console.log(`addSupportsQuadsWithBlankNodeObject()`);
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let graph = getInput(4);
    let dataFactory = window.pod.dataFactory;
    const quad = dataFactory.quad(
        dataFactory.namedNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.blankNode(object),
        dataFactory.namedNode(graph)
    );
    window.pod.polyIn.add([quad]);
}

function addSupportsQuadsWithIRIGraph() {
    console.log(`addSupportsQuadsWithIRIGraph()`);
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let graph = getInput(4);
    let dataFactory = window.pod.dataFactory;
    const quad = dataFactory.quad(
        dataFactory.namedNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.namedNode(object),
        dataFactory.namedNode(graph)
    );
    window.pod.polyIn.add([quad]);
}

function addSupportsQuadsWithDefaultGraph() {
    console.log(`addSupportsQuadsWithDefaultGraph()`);
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let dataFactory = window.pod.dataFactory;
    const quad = dataFactory.quad(
        dataFactory.namedNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.namedNode(object),
        dataFactory.defaultGraph()
    );
    window.pod.polyIn.add([quad]);
}

function canPassEmptyMatcherToPolyInSelect() {
    console.log("canPassEmptyMatcherToPolyInSelect()");
    window.pod.polyIn.select({});
}

function canPassMatcherWithSubjectToPolyInSelect() {
    console.log("canPassMatcherWithSubjectToPolyInSelect()");
    const subject = getInput(1);
    let dataFactory = window.pod.dataFactory;
    let matcher = {subject: dataFactory.namedNode(subject)};
    window.pod.polyIn.select(matcher);
}

function canPassMatcherWithPredicateToPolyInSelect() {
    console.log("canPassMatcherWithPredicateToPolyInSelect()");
    const predicate = getInput(1);
    let dataFactory = window.pod.dataFactory;
    let matcher = {predicate: dataFactory.namedNode(predicate)};
    window.pod.polyIn.select(matcher);
}

function canPassMatcherWithObjectToPolyInSelect() {
    console.log("canPassMatcherWithObjectToPolyInSelect()");
    const object = getInput(1);
    let dataFactory = window.pod.dataFactory;
    let matcher = {object: dataFactory.namedNode(object)};
    window.pod.polyIn.select(matcher);
}

function canPassMatcherWithAllThreeFieldsToPolyInSelect() {
    console.log("canPassMatcherWithAllThreeFieldsToPolyInSelect()");
    const subject = getInput(1);
    const predicate = getInput(2);
    const object = getInput(3);
    let dataFactory = window.pod.dataFactory;
    let matcher = {subject: dataFactory.namedNode(subject), predicate: dataFactory.namedNode(predicate), object: dataFactory.namedNode(object)};
    window.pod.polyIn.select(matcher);
}

function canGetEmptyArrayFromPolyInSelect() {
    console.log("canGetEmptyArrayFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

function canGetArrayWithSingleQuadFromPolyInSelect() {
    console.log("canGetArrayWithSingleQuadFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

function canGetArrayWithMultipleQuadsFromPolyInSelect() {
    console.log("canGetArrayWithMultipleQuadsFromPolyInSelect()");
    window.pod.polyIn.select({})
        .then(result => {
            setResult(JSON.stringify(result));
        });
}

async function execute(test) {
    setStatus("Running...");
    await awaitPodApi();
    try {
        test();
        setStatus("All OK");
    } catch (e) {
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

function createQuadFromInputs() {
    let subject = getInput(1);
    let predicate = getInput(2);
    let object = getInput(3);
    let graph = getInput(4);
    let dataFactory = window.pod.dataFactory;
    return dataFactory.quad(
        dataFactory.namedNode(subject),
        dataFactory.namedNode(predicate),
        dataFactory.namedNode(object),
        dataFactory.namedNode(graph)
    );
}
