export default class ExampleFeature {
    async init(pod) {
        const {polyIn} = pod;
        const quad = polyIn.factory.triple(
            polyIn.factory.namedNode("http://example.org/s"),
            polyIn.factory.namedNode("http://example.org/p"),
            polyIn.factory.namedNode("http://example.org/o")
        );
        await pod.polyIn.add(quad);
    }
}
