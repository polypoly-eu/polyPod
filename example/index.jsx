import * as React from "react";
import * as ReactDOM from "react-dom";

function Quad({ quad }) {
    return <li>{JSON.stringify(quad)}</li>;
}

function Quads({ quads }) {
    return <ul>{
        quads.map(quad => <Quad quad={quad} />)
    }</ul>;
}

export default class ExampleFeature {
    async init(pod) {
        const {polyIn} = pod;
        const quad = polyIn.factory.quad(
            polyIn.factory.namedNode("http://example.org/s"),
            polyIn.factory.namedNode("http://example.org/p"),
            polyIn.factory.namedNode("http://example.org/o")
        );
        await pod.polyIn.add(quad);
        const selected = await pod.polyIn.select({});

        ReactDOM.render(
            <Quads quads={selected} />,
            document.getElementById("feature")
        );
    }
}
