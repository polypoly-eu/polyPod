import * as React from "react";
import * as ReactDOM from "react-dom";
import {pod} from "@polypoly-eu/feature-bootstrap";

function Quad({ quad }) {
    return <li>{JSON.stringify(quad)}</li>;
}

function Quads({ quads }) {
    return <ul>{
        quads.map(quad => <Quad quad={quad} />)
    }</ul>;
}

pod.then(async pod => {
    const {dataFactory, polyIn} = pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode("http://example.org/s"),
        dataFactory.namedNode("http://example.org/p"),
        dataFactory.namedNode("http://example.org/o")
    );
    await polyIn.add(quad);
    const selected = await polyIn.select({});

    ReactDOM.render(
        <Quads quads={selected} />,
        document.getElementById("feature")
    );

    if (window.testCompleted)
        window.testCompleted({
            failures: selected.length === 1 ? 0 : 1
        });
});
