import {Manifest} from "./manifest";
import {promises as fs} from "fs";

export interface Feature {
    readonly name: string;
    css(): Promise<string[]>;
    js(): Promise<string>;
}

export type LoadingStrategy =
    (manifest: Manifest) => Promise<Feature>;

export const lazyStrategy: LoadingStrategy = async manifest => ({
    name: manifest.name,
    css: () => Promise.all(manifest.cssPaths.map(path => fs.readFile(path, { encoding: "utf-8" }))),
    js: () => fs.readFile(manifest.jsPath, { encoding: "utf-8" })
});

export const eagerStrategy: LoadingStrategy = async manifest => {
    const {name, css, js} = await lazyStrategy(manifest);
    const _css = await css();
    const _js = await js();
    return {
        name: name,
        css: async () => _css,
        js: async () => _js
    };
};