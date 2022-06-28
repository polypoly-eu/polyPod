#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs-extra";
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
import { metaGenerate } from "./src/generate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initial_version = "0.0.1";

if (fs.existsSync("../dev-utils/rollup-plugin-copy-watch")) {
    printInfoMsg("✓ Running from the right path!");
} else {
    printErrorMsg(`This directory ${__dirname} will make the script fail
Please change to «features»`);
    exit(1);
}

function interactiveSetup() {
    const setup_questions = [
        {
            type: "list",
            name: "type",
            message: "Feature Type:",
            choices: ["empty", "preview", "importer"],
            default: "empty",
        },
        {
            type: "input",
            name: "name",
            message: "Feature Name:",
            default: "example",
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
            ["type","name","author","description","license"].forEach( (value), {
                checkIfValueExists(value, answers);
            })

            if (answers.type === "empty") {
                handleCreateEmptyFeature(answers);
            } else if (answers.type === "preview") {
                handleCreatePreviewFeature(answers);
            } else if (answers.type === "importer") {
                handleCreateImporterFeature();
            } else {
                throw Error(
                    `Feature type ${answers.type} not recognized. Aborting!`
                );
            }
        })
        .catch((error) => {
            printErrorMsg(`Error: ${JSON.stringify(error, null, 4)}`);
        });
}

yargs(hideBin(process.argv))
    .scriptName("poly-cli")
    .command(
        'create <what> <name> [--type=empty] [--author="polypoly poly-cli"] [--license=MIT] [--description="Generated from poly-cli"]',
        "Creates features for now.",
        (yargs) => {
            yargs.positional("what", {
                type: "string",
                describe:
                    "→ The kind of thing you want poly-cli to create for you. Options: feature",
            });

            yargs.positional("name", {
                type: "string",
                describe: "→ The feature name. No reasonable default for this",
            });

            yargs.option("type", {
                type: "string",
                default: "empty",
                describe: "→ The type of feature: empty, preview, or importer",
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
                default:
                    "Generated from poly-cli; substitute for your own here",
                describe: "→ Description string for the package.json",
            });
        },
        handleCreate
    )
    .command("*", "Print with empty args", () => {}, interactiveSetup)
    .help().argv;

function handleCreate(arg) {
    try {
        if (arg.what === "feature") {
            handleCreateFeature(arg);
        } else {
            printWarningMsg(
                "Sorry, I can't create this for you. Try: «create feature» instead"
            );
        }
    } catch (error) {
        printErrorMsg(`${error}`);
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
        handleCreateImporterFeature();
    } else {
        throw Error(`Feature type ${arg.type} not recognized. Aborting!`);
    }
}

function handleCreateEmptyFeature(arg) {
    let feature_name = arg.name;
    let author = arg.author;
    let version = initial_version;
    let description = arg.description;
    let license = arg.license;

    // folders are objects, files are strings.
    var structure = {};

    // Remember "leaves" before subdirectories, or mkdir will fail
    structure[feature_name] = {
        src: {
            static: {
                "manifest.json": () =>
                    manifestTemplate(feature_name, author, version),
                "index.html": () =>
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
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
        "README.md": () => readmeTemplate(feature_name, description),
        "rollup.config.mjs": () =>
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/rollup.config.mjs"
                )
            ),
    };

    ["index.jsx", "styles.css"].forEach((file) => {
        structure[feature_name]["src"][file] = metaGenerate(
            file,
            __dirname,
            "empty"
        );
    });

    structure[feature_name]["src"]["locales"] = {};
    ["en", "de"].forEach((lang) => {
        structure[feature_name]["src"]["locales"][lang] = {
            "common.json": metaGenerate(
                `locales/${lang}/common.json`,
                __dirname,
                "empty"
            ),
        };
    });

    createDirectoryStructure(structure);
    execSync(`cd ${feature_name} && npm i && npm run build`);
}

function handleCreatePreviewFeature(arg) {
    let feature_name = arg.name;
    let author = arg.author;
    let version = initial_version;
    let description = arg.description;
    let license = arg.license;

    // folders are objects, files will point to a function.
    var structure = {};

    // Remember "leaves" before subdirectories, or mkdir will fail
    structure[feature_name] = {
        src: {
            static: {
                images: {},
                "manifest.json": () =>
                    manifestTemplate(feature_name, author, version, "preview"),
                "index.html": () =>
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
                            "./src/static/templates/index.html"
                        )
                    ),
                "content.json": () =>
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
                            "./src/static/templates/preview/content.json"
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
        "README.md": () => readmeTemplate(feature_name, description, "preview"),
        "rollup.config.mjs": () =>
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    "./src/static/templates/preview/rollup.config.mjs"
                )
            ),
    };

    ["index.jsx", "styles.css"].forEach((file) => {
        structure[feature_name]["src"][file] = metaGenerate(
            file,
            __dirname,
            "preview"
        );
    });

    structure[feature_name]["src"]["locales"] = {};
    ["en", "de"].forEach((lang) => {
        structure[feature_name]["src"]["locales"][lang] = {};
        ["common", "preview", "progressInfo"].forEach((file) => {
            const fileName = `${file}.json`;
            const filePath = `locales/${lang}/${fileName}`;
            structure[feature_name]["src"]["locales"][lang][fileName] =
                metaGenerate(
                    filePath,
                    __dirname,
                    "empty" // using this since it's not including "preview" in the template path
                );
        });
    });

    createDirectoryStructure(structure);
    execSync(
        `cd ${feature_name}/src/static && ln -s ../../../../assets/fonts . && cd ../../ && npm i && npm run build`
    );
}

function handleCreateImporterFeature() {
    printUnderConstruction();
}

function createDirectoryStructure(structure) {
    const recursiveCreate = (structure, parent = ".") => {
        for (const key in structure) {
            if (typeof structure[key] === "object") {
                let dir = parent + "/" + key;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                recursiveCreate(structure[key], dir);
            } else if (structure[key] instanceof Function) {
                fs.writeFileSync(parent + "/" + key, structure[key]());
            } else if (typeof structure[key] === "string") {
                fs.copySync(structure[key], parent + "/" + key);
            }
        }
    };

    let feature_name = Object.keys(structure)[0];

    if (fs.existsSync(`./${feature_name}`)) {
        throw Error("Feature already exists in this folder. Aborting!");
    }

    recursiveCreate(structure);
}

function checkIfValueExists(value, obj) {
    if (!(value in obj)) {
        throw Error(`Developer error: ${value} does not exist!`);
    }
}
