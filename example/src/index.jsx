import * as React from "react";
import * as ReactDOM from "react-dom";

function Quad({ quad }) {
    return <li>{JSON.stringify(quad)}</li>;
}

function Quads({ quads }) {
    return <ul>{
        quads.map((quad, idx) => <Quad quad={quad} key={idx} />)
    }</ul>;
}

const {dataFactory, polyIn} = window.pod;
const quad = dataFactory.quad(
    dataFactory.namedNode("http://example.org/s"),
    dataFactory.namedNode("http://example.org/p"),
    dataFactory.namedNode("http://example.org/o")
);

(async () => {
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
})();
