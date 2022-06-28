import { resolve } from "path";
import { readFileSync } from "fs";
import {
    packageTemplate,
    manifestTemplate,
    readmeTemplate,
} from "./templates/index.js";
import path from "path";

export function metaGenerate(file, dirName, featureName) {
    let templatePath = "";
    if (featureName != "empty") {
        templatePath = `${featureName}/`;
    }
    return () =>
        readFileSync(
            resolve(dirName, `./src/static/templates/${templatePath}${file}`)
        );
}

export function generateStructure(
    dirName,
    feature_name,
    author,
    version,
    description,
    license,
    featureType = "empty"
) {
    let pathFragment = "";
    if (featureType != "empty") {
        pathFragment = `${featureType}/`;
    }

    return {
        src: {
            static: {
                "manifest.json": () =>
                    manifestTemplate(
                        feature_name,
                        author,
                        version,
                        featureType
                    ),
                "index.html": () =>
                    readFileSync(
                        path.resolve(
                            dirName,
                            "./src/static/templates/index.html"
                        )
                    ),
            },
        },
        test: {},
        "package.json": () =>
            packageTemplate(
                feature_name,
                version,
                description,
                "src/index.jsx",
                author,
                license
            ),
        "README.md": () =>
            readmeTemplate(feature_name, description, featureType),
        "rollup.config.mjs": () =>
            readFileSync(
                path.resolve(
                    dirName,
                    `./src/static/templates/${pathFragment}rollup.config.mjs`
                )
            ),
    };
}
