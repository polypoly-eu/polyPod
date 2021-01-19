import { serve } from "../serve";
import { detectFeature, Ops } from "./_common";
import { DefaultPod, Pod } from "@polypoly-eu/poly-api";
import { promises as fs } from "fs";
import open from "open";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { Server } from "http";

export interface ServeCommandOps extends Ops {
    port: number;
    browser: boolean;
    open: boolean;
}

export async function serveCommand(options: ServeCommandOps): Promise<Server> {
    const [dir, manifest] = await detectFeature(options);
    let pod: Pod | undefined;
    if (!options.browser) pod = new DefaultPod(dataset(), fs, fetch);
    const server = await serve(options.port, dir, manifest, pod);
    const uri = `http://localhost:${options.port}/`;
    console.log(`Server booted: ${uri}`);
    if (options.open) await open(uri);
    return server;
}
