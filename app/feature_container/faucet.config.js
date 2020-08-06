module.exports = {
    static: [{
        source: "./src/container.html",
        target: "./dist/container/container.html",
    }, {
        source: "./src/bootstrap.js",
        target: "./dist/container/bootstrap.js",
    }, {
        source: "./src/polyPod.css",
        target: "./dist/container/polyPod.css",
    }, {
        source: "./node_modules/@polypoly-eu/feature-bootstrap/dist/index.js",
        target: "./dist/container/pod.js",
    }],
}
