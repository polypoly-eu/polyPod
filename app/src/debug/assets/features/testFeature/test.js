function verifySimpleJavaScriptCall() {
    document.getElementById("results").innerText = "All OK";
}

function verifyPodObjectExists() {
    if (window.pod !== null) {
        document.getElementById("results").innerText = "All OK";
    } else {
        document.getElementById("results").innerText = "pod object missing";
    }
}
