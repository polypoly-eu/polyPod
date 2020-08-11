import * as Decode from "io-ts/lib/Decoder";
import { iframeInnerPort } from "@polypoly-eu/port-authority";
import { DataFactory } from "@polypoly-eu/rdf";
import Cookies from "js-cookie";
import { RemoteClientPod } from "./remote";
import { AsyncPod } from "./async";
import { expect } from "./_util";

interface IframeInnerSpec {
    type: "iframe";
}

interface FetchSpec {
    type: "fetch";
    uri: string;
}

export type RemoteClientSpec = IframeInnerSpec | FetchSpec;

const iframeInnerDecoder = Decode.type<IframeInnerSpec>({
    type: Decode.literal("iframe"),
});

const fetchDecoder = Decode.type<FetchSpec>({
    type: Decode.literal("fetch"),
    uri: Decode.string,
});

const specDecoder = Decode.sum("type")({
    iframe: iframeInnerDecoder,
    fetch: fetchDecoder,
});

async function podOfSpec(spec: RemoteClientSpec): Promise<RemoteClientPod> {
    switch (spec.type) {
        case "fetch":
            return RemoteClientPod.fromFetch(spec.uri);
        case "iframe":
            return RemoteClientPod.fromRawPort(await iframeInnerPort(""));
    }
}

function detectSpec(): RemoteClientSpec {
    let cookie: string | undefined = undefined;
    try {
        cookie = Cookies.get("polypoly-bootstrap");
    } catch {
        // no cookie for us :(
    }

    if (cookie === undefined) return { type: "iframe" };

    return expect(JSON.parse(cookie), "Failed to parse spec", specDecoder);
}

window.pod = new AsyncPod(podOfSpec(detectSpec()), new DataFactory(false));
