import {serve} from "../harness/server";
import {block, detectFeature, Ops} from "./_common";
import {MockPod} from "@polypoly-eu/poly-api";
import {promises as _fs} from "fs";
import {Volume} from "memfs";
import open from "open";
import {defaultConfig, eagerStrategy, lazyStrategy, LoadingStrategy} from "../feature/feature";
import {LogPod, nullLogger, defaultLogger} from "../pods/log-pod";
import {getManifest} from "../feature/manifest";
// @ts-ignore
import fetch from "node-fetch";

const allStrategies: Record<string, LoadingStrategy> = {
    "lazy": lazyStrategy,
    "eager": eagerStrategy
};

export interface ServeCommandOps extends Ops {
    port: number;
    inmemory: boolean;
    strategy: string;
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
            new MockPod(
                fs,
                fetch
            ),
            options.log ? defaultLogger : nullLogger
        );
    const feature = await allStrategies[options.strategy](manifest, defaultConfig);
    await serve(options.port, pod, feature);
    const uri = `http://localhost:${options.port}/`;
    console.log(`Server booted: ${uri}`);
    await open(uri);
    await block();
}