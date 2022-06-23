#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { execSync } from "child_process";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import {
    packageTemplate,
    manifestTemplate,
    readmeTemplate,
} from "./src/templates/index.js";
import {
    printErrorMsg,
    printWarningMsg,
    printUnderConstruction,
    printHeadlineMsg,
    printFeatureInfoMsg,
    printInfoMsg,
} from "./src/msg.js";
import { exit } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (existsSync("../dev-utils/rollup-plugin-copy-watch")) {
    printInfoMsg("✓ Running from the right path!");
} else {
    printErrorMsg(`This directory ${__dirname} will make the script fail
Please change to «features»`);
    exit(1);
}

function setup(structure) {
    let feature_name = Object.keys(structure)[0];

    if (existsSync(`./${feature_name}`)) {
        printErrorMsg("Feature already exists in this folder. Aborting!");
        return;
    }

    createDirectoryStructure(structure);

    execSync(`cd ${feature_name} && npm i && npm run build`);
}

function interactiveSetup() {
    const setup_questions = [
        {
            type: "input",
            name: "feature_name",
            message: "Feature Name:",
            default: "example",
        },
        {
            type: "input",
            name: "version",
            message: "Version:",
            default: "0.0.1",
        },
        {
            type: "input",
            name: "description",
            message: "Description:",
            default: (answers) => `Generated ${answers.feature_name} feature`,
        },
        {
            type: "input",
            name: "author",
            message: "Author:",
            default: "polypoly interactive",
        },
        {
            type: "input",
            name: "license",
            message: "License:",
            default: "MIT",
        },
    ];

    inquirer
        .prompt(setup_questions)
        .then((answers) => {
            checkIfValueExists("feature_name", answers);
            checkIfValueExists("author", answers);
            checkIfValueExists("version", answers);
            checkIfValueExists("description", answers);
            checkIfValueExists("license", answers);
            setup(
                answers.feature_name,
                answers.author,
                answers.version,
                answers.description,
                answers.license
            );
        })
        .catch((error) => {
            printErrorMsg(`Error: ${JSON.stringify(error, null, 4)}`);
        });
}
yargs(hideBin(process.argv))
    .scriptName("poly-cli")
    .command(
        'create <what> <name> [--type=empty] [--version=0.0.1] [--author="polypoly poly-cli"] [--license=MIT] [--description="Generated from poly-cli"]',
        "Creates features for now.",
        (yargs) => {
            yargs.positional("what", {
                type: "string",
                describe:
                    "→ the kind of thing you want poly-cli to create for you. Options: feature",
            });

            yargs.positional("name", {
                type: "string",
                describe: "→ The feature name. No reasonable default for this",
            });

            yargs.option("type", {
                type: "string",
                default: "empty",
                describe: "→ the type of feature: empty, preview, or importer",
            });

            yargs.option("feature-version", {
                type: "string",
                default: "0.0.1",
                describe: "→ Version string for the package.json",
            });

            yargs.option("author", {
                type: "string",
                default: "polypoly poly-cli",
                describe: "→ Author for package.json",
            });

            yargs.option("license", {
                type: "string",
                default: "MIT",
                describe: "→ License for package.json",
            });

            yargs.option("description", {
                type: "string",
                default: "Generated from poly-cli; use your own here",
                describe: "→ Version string for the package.json",
            });
        },
        handleCreate
    )
    .command("*", "Print with empty args", () => {}, interactiveSetup)
    .help().argv;

function handleCreate(arg) {
    if (arg.what === "feature") {
        handleCreateFeature(arg);
    } else {
        printWarningMsg(
            "Sorry, I can't create this for you. Try: create feature instead"
        );
    }
}

function handleCreateFeature(arg) {
    printHeadlineMsg("Creating Feature");
    printFeatureInfoMsg(arg.type);

    if (arg.type === "empty") {
        handleCreateEmptyFeature(arg);
    } else if (arg.type === "preview") {
        handleCreatePreviewFeature(arg);
    } else if (arg.type === "importer") {
        handleCreateImporterFeature(arg);
    } else {
        printErrorMsg(`Feature type ${arg.type} not recognized. Aborting!`);
    }
}

function handleCreateEmptyFeature(arg) {
    let feature_name = arg.name;
    let author = arg.author;
    let version = arg.featureVersion;
    let description = arg.description;
    let license = arg.license;

    // folders are objects, files are strings.
    var structure = {};

    // Remember "leaves" before subdirectories, or mkdir will fail
    structure[feature_name] = {
        src: {
            "index.jsx": () =>
                readFileSync(
                    path.resolve(__dirname, "./src/static/templates/index.jsx")
                ),
            "styles.css": () =>
                readFileSync(
                    path.resolve(__dirname, "./src/static/templates/styles.css")
                ),
            locales: {
                en: {
                    "common.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/en/common.json"
                            )
                        ),
                },
                de: {
                    "common.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/de/common.json"
                            )
                        ),
                },
            },
            static: {
                "manifest.json": () => manifestTemplate(feature_name, author),
                "index.html": () =>
                    readFileSync(
                        path.resolve(
                            __dirname,
                            "./src/static/templates/index.html"
                        )
                    ),
            },
        },
        test: [],
        "package.json": () =>
            packageTemplate(
                feature_name,
                version,
                description,
                "src/index.jsx",
                author,
                license
            ),
        "README.md": () => readmeTemplate(feature_name, description),
        "rollup.config.mjs": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/rollup.config.mjs"
                )
            ),
    };

    setup(structure);
}

function handleCreatePreviewFeature(arg) {
    // TODO:
    // 1. New translations - preview.json
    // 2. Add content file - content.json
    // 3. New index file with the logic.

    let feature_name = arg.name;
    let author = arg.author;
    let version = arg.featureVersion;
    let description = arg.description;
    let license = arg.license;

    // folders are objects, files are strings.
    var structure = {};

    // Remember "leaves" before subdirectories, or mkdir will fail
    structure[feature_name] = {
        src: {
            "index.jsx": () =>
                readFileSync(
                    path.resolve(__dirname, "./src/static/templates/index.jsx")
                ),
            "styles.css": () =>
                readFileSync(
                    path.resolve(__dirname, "./src/static/templates/styles.css")
                ),
            locales: {
                en: {
                    "common.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/en/common.json"
                            )
                        ),
                    "preview.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/en/preview.json"
                            )
                        ),
                },
                de: {
                    "common.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/de/common.json"
                            )
                        ),
                    "preview.json": () =>
                        readFileSync(
                            path.resolve(
                                __dirname,
                                "./src/static/templates/locales/de/preview.json"
                            )
                        ),
                },
            },
            static: {
                "manifest.json": () => manifestTemplate(feature_name, author),
                "index.html": () =>
                    readFileSync(
                        path.resolve(
                            __dirname,
                            "./src/static/templates/index.html"
                        )
                    ),
            },
        },
        test: [],
        "package.json": () =>
            packageTemplate(
                feature_name,
                version,
                description,
                "src/index.jsx",
                author,
                license
            ),
        "README.md": () => readmeTemplate(feature_name, description),
        "rollup.config.mjs": () =>
            readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/rollup.config.mjs"
                )
            ),
    };

    setup(structure);
}

function handleCreateImporterFeature(arg) {
    printUnderConstruction();
}

function createDirectoryStructure(structure, parent = ".") {
    for (const key in structure) {
        if (typeof structure[key] === "object") {
            let dir = parent + "/" + key;
            if (!existsSync(dir)) {
                mkdirSync(dir);
            }
            createDirectoryStructure(structure[key], dir);
        } else if (structure[key] instanceof Function) {
            writeFileSync(parent + "/" + key, structure[key]());
        }
    }
}

function checkIfValueExists(value, obj) {
    if (!(value in obj)) {
        printErrorMsg(`Developer error: ${value} does not exist!`);
        throw Error("Dev error");
    }
}
