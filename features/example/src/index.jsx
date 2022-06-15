import * as React from "react";
import * as ReactDOM from "react-dom";

function Quad({ quad }) {
    return (
        <li>
            <table>
                <tbody>
                    <tr>
                        <th>Subject</th>
                        <td>{JSON.stringify(quad.subject)}</td>
                    </tr>
                    <tr>
                        <th>Predicate</th>
                        <td>{JSON.stringify(quad.predicate)}</td>
                    </tr>
                    <tr>
                        <th>Object</th>
                        <td>{JSON.stringify(quad.object)}</td>
                    </tr>
                </tbody>
            </table>
        </li>
    );
}

function Quads({ quads }) {
    return (
        <ul>
            {quads.map((quad, idx) => (
                <Quad quad={quad} key={idx} />
            ))}
        </ul>
    );
}

const { dataFactory, polyIn } = window.pod;
const quad = dataFactory.quad(
    dataFactory.namedNode("http://example.org/s"),
    dataFactory.namedNode("http://example.org/p"),
    dataFactory.namedNode("http://example.org/o")
);

(async () => {
    await polyIn.add(quad);
    const matching = await polyIn.match({});

    ReactDOM.render(
        <Quads quads={matching} />,
        document.getElementById("feature")
    );

    if (window.testCompleted)
        window.testCompleted({
            failures: matching.length === 1 ? 0 : 1,
        });
})();
