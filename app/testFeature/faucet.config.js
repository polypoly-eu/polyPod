module.exports = {
    js: [{
        source: "./src/test.js",
        target: "./dist/test.js",
        exports: "testFeature"
    }],
    static: [{
        source: "./src/index.html",
        target: "./dist/index.html",
    }],
}
