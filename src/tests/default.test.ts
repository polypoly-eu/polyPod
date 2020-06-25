import {getHttpbinUrl, podSpec} from "../spec";
import {DefaultPod} from "../default";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {Volume} from "memfs";
import {Pod} from "../api";

describe("Mock pod", () => {

    podSpec(
        new DefaultPod(
            dataset(),
            new Volume().promises as any,
            fetch
        ),
        "/",
        getHttpbinUrl()
    );

});

// Compilation tests

// eslint-disable-next-line
function compile(): void {
    window.addEventListener("podReady", event => {
        // eslint-disable-next-line
        const pod1: Pod = event.detail;
        // eslint-disable-next-line
        const pod2: Pod | undefined = window.pod;
        // eslint-disable-next-line
        const _window: Window = event.target;
    });
}
