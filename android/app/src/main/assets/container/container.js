let featureName;

function loadFeature() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    featureName = urlParams.get("featureName");
    console.log(`Loading Feature: "${featureName}"`);
    const iFrame = document.getElementById("harness");
    iFrame.onload = ev => initIframe(ev.target);
    iFrame.src = `features/${featureName}/index.html`;
}

loadFeature();
