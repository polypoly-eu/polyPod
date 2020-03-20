import {MockPod, podSpec} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {LogPod, nullLogger} from "../pods/log-pod";
// @ts-ignore
import fetch from "node-fetch";

describe("Log pod", () => {

    podSpec(() => {
        const fs = new Volume().promises as any;
        const underlying = new MockPod(fs, fetch);
        const pod = new LogPod(underlying, nullLogger);
        return Object.assign(pod, { fs });
    });

});