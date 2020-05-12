import * as tempy from "tempy";
import {promises as fs} from "fs";
import {join} from "path";
import {rootDir} from "../_dir";
import {spawnSync, SpawnSyncOptions} from "child_process";
import {DefaultPod, FeatureConstructor} from "@polypoly-eu/poly-api";
import {createContext, runInContext} from "vm";
import {tempBundle} from "./util";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";

function installAndBuild(cli: string, path: string): void {
    const opts: SpawnSyncOptions = {
        cwd: path,
        env: {
            ...process.env,
            NODE_PATH: join(rootDir, "node_modules")
        }
    };

    expect(spawnSync("node", [cli, "build"], opts)).toHaveProperty("status", 0);
}

describe("Build", () => {

    let cliPath: string;

    beforeAll(async () => {
        cliPath = await tempBundle("cli");
    });

    describe("Simple build", () => {

        const projectPath = join(rootDir, "data", "test-feature-build");
        const testProjectFiles = ["index.js", "package.json", "style.scss"];

        let path: string;

        beforeAll(async () => {
            path = tempy.directory();
            for (const file of testProjectFiles)
                await fs.copyFile(join(projectPath, file), join(path, file));
        });

        it("orodruin build", async () => {
            installAndBuild(cliPath, path);

            const distJS = await fs.readFile(join(path, "dist", "feature.js"), { encoding: "utf-8" });

            const context = createContext();
            runInContext(distJS, context);

            expect(context).toHaveProperty("Feature");

            const Feature: FeatureConstructor = context.Feature;

            const pod = new DefaultPod(dataset(), fs as any, fetch);

            new Feature().init(pod);

            expect(pod.store.size).toEqual(1);

            await fs.stat(join(path, "dist", "feature.css"));
        });
    });

});