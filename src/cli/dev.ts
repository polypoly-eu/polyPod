import {serve} from "../harness/server";
import {block, detectFeature} from "./_common";
import {MockPod} from "@polypoly-eu/poly-api";
import {promises as _fs} from "fs";
import {Volume} from "memfs";
import open from "open";
import {eagerStrategy, lazyStrategy, LoadingStrategy} from "../feature/feature";
import {Logger, LogPod, nullLogger} from "../pods/log-pod";
// @ts-ignore
import fetch from "node-fetch";

const allStrategies: Record<string, LoadingStrategy> = {
    "lazy": lazyStrategy,
    "eager": eagerStrategy
};

const defaultLogger: Logger = {
    called: (operation, args) =>
        console.log(`Operation ${operation} called with arguments: ${JSON.stringify(args)}`),
    finished: (operation, ret?) => {
        console.log(`Operation ${operation} finished.`);
        if (ret) {
            console.log(`Return value:`);
            console.dir(ret);
        }
    }
};

export interface DevCommandOptions {
    port: number;
    inmemory: boolean;
    strategy: string;
    log: boolean;
    dir?: string;
}

export async function devCommand(options: DevCommandOptions): Promise<void> {
    const manifest = await detectFeature(options.dir);
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
    const feature = await allStrategies[options.strategy](manifest);
    await serve(options.port, pod, feature);
    const uri = `http://localhost:${options.port}/`;
    console.log(`Server booted: ${uri}`);
    await open(uri);
    await block();
}