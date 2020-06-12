import {DefaultPod} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {VolatilePod} from "../volatile";
import {getHttpbinUrl, podSpec} from "@polypoly-eu/poly-api/dist/specs";

describe("Volatile pod", () => {

    const fs = new Volume().promises as any;
    const underlying = new DefaultPod(dataset(), fs, fetch);

    podSpec(new VolatilePod(underlying), "/", getHttpbinUrl());

});
