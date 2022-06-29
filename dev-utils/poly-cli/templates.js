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
        "progressInfo.json": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/locales/progressInfo.json"
                )
            ),
        ".gitignore": () =>
            readFileSync(
                path.resolve(__dirname, "./src/static/templates/.gitignore")
            ),
    };
}
