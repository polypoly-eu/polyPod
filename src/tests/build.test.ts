import * as tempy from "tempy";
import {promises as fs} from "fs";
import {join} from "path";
import {rootDir} from "../_dir";
import {DefaultPod, FeatureConstructor} from "@polypoly-eu/poly-api";
import {createContext, runInContext} from "vm";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {buildCommand} from "../cli/build";

describe("Build", () => {

    describe("Simple build", () => {

        const projectPath = join(rootDir, "data", "test-feature-build");
        const testProjectFiles = ["index.js", "package.json", "style.scss", "orodruin.config.json"];

        let path: string;

        beforeAll(async () => {
            path = tempy.directory();
            for (const file of testProjectFiles)
                await fs.copyFile(join(projectPath, file), join(path, file));
        });

        it("orodruin build", async () => {
            await buildCommand({ dir: path });

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