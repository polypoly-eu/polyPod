import {Pod} from "@polypoly-eu/poly-api";
import {Logger, LogPod} from "../pods/log-pod";
import {MockPod} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {promises as fs} from "fs";
import {rootDir} from "../_dir";
import {join} from "path";
import {rollup} from "rollup";
import {serve} from "../harness/server";
import {fetchWithBaseURI, rawPromise} from "../util";
import {once} from "events";
import {AddressInfo} from "net";
import {JSDOM} from "jsdom";
// @ts-ignore
import fetch from "node-fetch";
// @ts-ignore
import {configs} from "../../build/rollup-common.js";

interface JestMockLogger extends Logger {
    called: jest.Mock<void, [string, Record<string, any>]>;
    finished: jest.Mock<void, [string, any?]>;
}

function jestMockLogger(): JestMockLogger {
    return {
        called: jest.fn(),
        finished: jest.fn()
    };
}

describe("Harness", () => {

    jest.setTimeout(15000);

    let pod: Pod;
    let logger: JestMockLogger;
    let bootstrapJS: string;

    beforeAll(async () => {
        const { bootstrap } = configs;
        const rollupBuild = await rollup(bootstrap);
        const outputOptions = bootstrap.output;
        const { output } = await rollupBuild.generate(outputOptions);
        bootstrapJS = output[0].code;
    });

    beforeEach(() => {
        logger = jestMockLogger();
        pod = new LogPod(new MockPod(new Volume().promises as any, fetch), logger);
    });

    it("Feature can be bootstrapped", async () => {
        const feature = {
            name: "test",
            bootstrap: async () => bootstrapJS,
            css: async () => [],
            js: () => fs.readFile(join(rootDir, "data", "test-feature.js"), { encoding: "utf-8" })
        };

        const bootstrapped = rawPromise<void>();

        const server = await serve(0, pod, feature, () => bootstrapped.resolve());
        const port = (server.address() as AddressInfo).port;

        const baseURI = `http://localhost:${port}`;
        const jsdomFetch = fetchWithBaseURI(baseURI, fetch);

        const dom = await JSDOM.fromURL(baseURI, {
            runScripts: "dangerously",
            resources: "usable"
        });
        dom.window.fetch = jsdomFetch;

        await bootstrapped.promise;

        server.close();
        await once(server, "close");

        expect(logger.called).toHaveBeenCalledTimes(1);
        expect(logger.finished).toHaveBeenCalledTimes(1);
    });

});