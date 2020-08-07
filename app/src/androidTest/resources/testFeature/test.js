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
