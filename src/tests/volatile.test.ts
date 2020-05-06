import {DefaultPod, podSpec} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {VolatilePod} from "../volatile";

describe("Volatile pod", () => {

    podSpec(() => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        return new VolatilePod(underlying);
    });

});
