import { DatasetCore, DatasetCoreFactory, Quad } from "rdf-js";
import { DatasetSpec } from "../dataset";
import RDFJSDatasetCoreFactory from "@rdfjs/dataset";
import RDFJSDataFactory from "@rdfjs/data-model";
// @ts-ignore
import GraphyDataset from "@graphy/memory.dataset.fast";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";

describe("@rdfjs/dataset", () => {
    new DatasetSpec(RDFJSDatasetCoreFactory, RDFJSDataFactory).run();
});

describe("@graphy/memory.dataset.fast", () => {
    const graphyFactory: DatasetCoreFactory = {
        dataset(quads?: Quad[]): DatasetCore {
            const set = GraphyDataset();
            set.addAll(quads || []);
            return set;
        },
    };

    new DatasetSpec(graphyFactory, Graphy).run();
});
