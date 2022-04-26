const {dataFactory, polyIn} = window.pod;
const quad = dataFactory.quad(
    dataFactory.namedNode("http://example.org/s"),
    dataFactory.namedNode("http://example.org/p"),
    dataFactory.namedNode("http://example.org/o")
);

(async () => {
    await polyIn.add(quad);
    window.parent.postMessage("completed", "*");
})();
