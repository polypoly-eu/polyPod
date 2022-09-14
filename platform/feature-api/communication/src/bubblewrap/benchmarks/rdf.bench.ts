import { Event, Suite } from "benchmark";
import { Parser } from "n3";
import { join } from "path";
import { Quad } from "rdf-js";
import { promises as fs } from "fs";
import { Bubblewrap, Classes } from "../index";
import {
    convert,
    dataFactory,
    NamedNode,
    BlankNode,
    Literal,
    Variable,
    DefaultGraph,
    Quad as polyQuad,
} from "@polypoly-eu/api";
import * as assert from "assert";

const suite = new Suite();

const classes: Classes = {
    "@polypoly-eu/rdf.NamedNode": NamedNode,
    "@polypoly-eu/rdf.BlankNode": BlankNode,
    "@polypoly-eu/rdf.Literal": Literal,
    "@polypoly-eu/rdf.Variable": Variable,
    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph,
    "@polypoly-eu/rdf.Quad": polyQuad,
};

const bubblewrap = Bubblewrap.create(classes);
const bubblewrapStrict = Bubblewrap.create(classes, true);
const bubblewrapRaw = Bubblewrap.create();

async function loadDataset(): Promise<Quad[]> {
    const path = join(
        __dirname,
        "..",
        "..",
        "bubblewrap",
        "resources",
        "dataset.nt"
    );
    const content = await fs.readFile(path, { encoding: "utf-8" });
    const parser = new Parser();
    return parser.parse(content);
}

function convertDataset(quads: Quad[]): polyQuad[] {
    return quads.map((quad) => convert(quad, dataFactory));
}

async function runBench(): Promise<void> {
    const dataset = convertDataset(await loadDataset());
    const encoded = bubblewrap.encode(dataset);
    const encodedStrict = bubblewrapStrict.encode(dataset);
    assert.deepStrictEqual(encoded, encodedStrict);
    const encodedRaw = bubblewrapRaw.encode(dataset);
    assert.notDeepStrictEqual(encoded, encodedRaw);

    assert.deepStrictEqual(
        convertDataset(bubblewrapRaw.decode(encodedRaw)),
        dataset
    );

    console.log(`Measuring ${dataset.length} quads`);

    suite
        .add("encoding", () => {
            bubblewrap.encode(dataset);
        })
        .add("encoding (strict)", () => {
            bubblewrapStrict.encode(dataset);
        })
        .add("encoding (raw)", () => {
            bubblewrapRaw.encode(dataset);
        })
        .add("decoding", () => {
            bubblewrap.decode(encoded);
        })
        .add("decoding (strict)", () => {
            bubblewrapStrict.decode(encodedStrict);
        })
        .add("decoding (raw)", () => {
            bubblewrapRaw.decode(encodedRaw);
        })
        .add("decoding (raw-then-convert)", () => {
            convertDataset(bubblewrapRaw.decode(encodedRaw));
        })
        .add("roundtrip", () => {
            bubblewrap.decode(bubblewrap.encode(dataset));
        })
        .add("roundtrip (strict)", () => {
            bubblewrapStrict.decode(bubblewrapStrict.encode(dataset));
        })
        .add("roundtrip (raw-then-convert)", () => {
            convertDataset(bubblewrapRaw.decode(bubblewrapRaw.encode(dataset)));
        })
        .on("cycle", (event: Event) => {
            console.log(event.target.toString());
        })
        .run();
}

await runBench();
