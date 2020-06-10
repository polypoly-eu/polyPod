import {Pod} from "@polypoly-eu/poly-api";
import {Logger, LogPod} from "@polypoly-eu/podigree";
import {DefaultPod} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {promises as fs} from "fs";
import {rootDir} from "../_dir";
import {join} from "path";
import {serve} from "../harness/server";
import {fetchWithBaseURI, rawPromise} from "../util";
import {once} from "events";
import {AddressInfo} from "net";
import {JSDOM} from "jsdom";
import tempy from "tempy";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {parse, Range} from "semver";

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

    jest.setTimeout(20000);

    let pod: Pod;
    let logger: JestMockLogger;

    beforeEach(() => {
        logger = jestMockLogger();
        pod = new LogPod(new DefaultPod(dataset(), new Volume().promises as any, fetch), logger);
    });

    it("Feature can be bootstrapped", async () => {
        const cssPath = tempy.file({ extension: "css" });
        await fs.writeFile(cssPath, Buffer.of(), { flag: "w" });

        const manifest = {
            cssPath,
            version: parse("0.0.0")!,
            api: new Range("0.0.0"),
            name: "test",
            assetBasePath: ".",
            jsPath: join(rootDir, "data", "test-feature.js")
        };

        const completed = rawPromise<void>();

        const server = await serve(0, pod, "/", manifest, {
            reactPath: join(rootDir, "node_modules/react/umd/react.development.js"),
            reactDomPath: join(rootDir, "node_modules/react-dom/umd/react-dom.development.js")
        });
        const port = (server.address() as AddressInfo).port;

        const baseURI = `http://localhost:${port}`;
        const jsdomFetch = fetchWithBaseURI(baseURI, fetch as any);

        const dom = await JSDOM.fromURL(baseURI, {
            runScripts: "dangerously",
            resources: "usable"
        });
        dom.window.document.addEventListener("completed", () => completed.resolve());
        dom.window.fetch = jsdomFetch;

        await completed.promise;

        server.close();
        await once(server, "close");

        expect(logger.called).toHaveBeenCalledTimes(1);
        expect(logger.finished).toHaveBeenCalledTimes(1);
    });

});