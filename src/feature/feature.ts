import {Manifest} from "./manifest";
import {promises as fs} from "fs";
// @ts-ignore
import {bootstrapPath} from "../../build/paths.js";

export interface Feature {
    readonly name: string;
    bootstrap(): Promise<string>;
    css(): Promise<string[]>;
    js(): Promise<string>;
}

export interface Config {
    bootstrapPath: string;
}

export const defaultConfig: Config = {
    bootstrapPath
};

export type LoadingStrategy =
    (manifest: Manifest, config: Config) => Promise<Feature>;

export const lazyStrategy: LoadingStrategy = async (manifest, config) => ({
    name: manifest.name,
    bootstrap: () => fs.readFile(config.bootstrapPath, { encoding: "utf-8" }),
    css: () => Promise.all(manifest.cssPaths.map(path => fs.readFile(path, { encoding: "utf-8" }))),
    js: () => fs.readFile(manifest.jsPath, { encoding: "utf-8" })
});

export const eagerStrategy: LoadingStrategy = async (manifest, config) => {
    const {name, bootstrap, css, js} = await lazyStrategy(manifest, config);
    const _css = await css();
    const _js = await js();
    const _bootstrap = await bootstrap();
    return {
        name: name,
        bootstrap: async () => _bootstrap,
        css: async () => _css,
        js: async () => _js
    };
};