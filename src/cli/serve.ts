import {serve} from "../serve";
import {detectFeature, Ops} from "./_common";
import {DefaultPod, FS} from "@polypoly-eu/poly-api";
import {promises as _fs} from "fs";
import {Volume} from "memfs";
import open from "open";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {Server} from "http";

export interface ServeCommandOps extends Ops {
    port: number;
    inmemory: boolean;
    log: boolean;
    open: boolean;
}

export async function serveCommand(options: ServeCommandOps): Promise<Server> {
    const [dir, manifest] = await detectFeature(options);
    const fs: FS =
        options.inmemory ?
            (new Volume().promises as any) :
            _fs;
    const pod = new DefaultPod(dataset(), fs, fetch);
    const server = await serve(options.port, pod, dir, manifest);
    const uri = `http://localhost:${options.port}/`;
    console.log(`Server booted: ${uri}`);
    if (options.open)
        await open(uri);
    return server;
}