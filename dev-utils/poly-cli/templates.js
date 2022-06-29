import { manifestTemplate } from "./src/templates/manifest.js";
import { packageTemplate } from "./src/templates/package.js";
import { readmeTemplate } from "./src/templates/readme.js";

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function emptyFeatureTemplates(
    feature_name,
    author,
    version,
    description,
    license
) {
    return {
        "manifest.json": () =>
            manifestTemplate(feature_name, author, version, "empty"),
        "index.html": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/index.html")
            ),
        "index.jsx": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/index.jsx")
            ),
        "styles.css": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/styles.css")
            ),
        "package.json": () =>
            packageTemplate(
                feature_name,
                version,
                description,
                "src/index.jsx",
                author,
                license
            ),
        "README.md": () => readmeTemplate(feature_name, description, "empty"),
        "rollup.config.mjs": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/rollup.config.mjs"
                )
            ),
        "common.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/common.json"
                )
            ),
        ".gitignore": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/.gitignore")
            ),
    };
}

// Note: You can also match templates by path. You don't need to pass the entire path.
// Example: Say you have 2 files with the same name: test.json. These 2 files have different parents.
// Say we have the following structure: locales/en/test.json and locales/de/test.json
// You can include the entire path in the key or you can include the first parent in the key: i.e set en/test.json as the key.

export function previewFeatureTemplates(
    feature_name,
    author,
    version,
    description,
    license
) {
    return {
        "manifest.json": () =>
            manifestTemplate(feature_name, author, version, "preview"),
        "index.html": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/index.html")
            ),
        "content.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/preview/content.json"
                )
            ),
        "index.jsx": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/preview/index.jsx"
                )
            ),
        "styles.css": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/preview/styles.css"
                )
            ),
        "package.json": () =>
            packageTemplate(
                feature_name,
                version,
                description,
                "src/index.jsx",
                author,
                license
            ),
        "README.md": () => readmeTemplate(feature_name, description, "preview"),
        "rollup.config.mjs": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/preview/rollup.config.mjs"
                )
            ),
        "common.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/common.json"
                )
            ),
        "preview.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/preview.json"
                )
            ),
        "en/progressInfo.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/en/progressInfo.json"
                )
            ),
        "de/progressInfo.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/de/progressInfo.json"
                )
            ),
        ".gitignore": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/.gitignore")
            ),
    };
}
