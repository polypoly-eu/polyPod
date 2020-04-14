import {defaultConfig, serve} from "../harness/server";
import {block, detectFeature, Ops} from "./_common";
import {DefaultPod} from "@polypoly-eu/poly-api";
import {promises as _fs} from "fs";
import {Volume} from "memfs";
import open from "open";
import {LogPod, nullLogger, defaultLogger} from "../pods/log-pod";
import {getManifest} from "../feature/manifest";
import {dataset} from "@rdfjs/dataset";
// @ts-ignore
import fetch from "node-fetch";

export interface ServeCommandOps extends Ops {
    port: number;
    inmemory: boolean;
    log: boolean;
}

export async function serveCommand(options: ServeCommandOps): Promise<void> {
    const manifest = getManifest(await detectFeature(options));
    const fs: typeof _fs =
        options.inmemory ?
            (new Volume().promises as any) :
            _fs;
    const pod =
        new LogPod(
            new DefaultPod(
                dataset(),
                fs,
                fetch
            ),
            options.log ? defaultLogger : nullLogger
        );
    await serve(options.port, pod, manifest, defaultConfig);
    const uri = `http://localhost:${options.port}/`;
    console.log(`Server booted: ${uri}`);
    await open(uri);
    await block();
}