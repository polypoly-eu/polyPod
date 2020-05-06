import {DefaultPod, podSpec} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {LogPod, nullLogger} from "../log";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";

describe("Log pod", () => {

    podSpec(() => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        return new LogPod(underlying, nullLogger);
    });

});