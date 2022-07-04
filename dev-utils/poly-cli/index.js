#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    printErrorMsg,
    printUnderConstruction,
    printHeadlineMsg,
    printFeatureInfoMsg,
    printInfoMsg,
} from "./src/msg.js";
import { exit } from "process";
import { emptyFeatureTemplates, previewFeatureTemplates } from "./templates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initial_version = "0.0.1";

if (existsSync("../dev-utils/rollup-plugin-copy-watch")) {
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
            ["type", "name", "author", "description", "license"].forEach(
                (value) => {
                    checkIfValueExists(value, answers);
                }
            );

            handleCreateFeature(answers);
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
            throw Error(
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
    structure[feature_name] = [
        {
            src: [
                { static: ["manifest.json", "index.html"] },
                { locales: [{ en: ["common.json"] }, { de: ["common.json"] }] },
                "index.jsx",
                "styles.css",
            ],
        },
        { test: [] },
        "package.json",
        "README.md",
        "rollup.config.mjs",
        ".gitignore",
    ];

    let templates = emptyFeatureTemplates(
        feature_name,
        author,
        version,
        description,
        license
    );

    createDirectoryStructure(structure, templates);
    execSync(`cd ${feature_name} && npm i && npm run build`);
}

function handleCreatePreviewFeature(arg) {
    let feature_name = arg.name;
    let author = arg.author;
    let version = initial_version;
    let description = arg.description;
    let license = arg.license;

    let common_locales = ["common.json", "preview.json", "progressInfo.json"];

    var structure = {};
    structure[feature_name] = [
        {
            src: [
                {
                    static: [
                        "manifest.json",
                        "index.html",
                        "content.json",
                        { images: [] },
                    ],
                },
                {
                    locales: [
                        {
                            en: common_locales,
                        },
                        {
                            de: common_locales,
                        },
                    ],
                },
                "index.jsx",
                "styles.css",
            ],
        },
        { test: [] },
        "package.json",
        "README.md",
        "rollup.config.mjs",
        ".gitignore",
    ];

    let templates = previewFeatureTemplates(
        feature_name,
        author,
        version,
        description,
        license
    );

    createDirectoryStructure(structure, templates);
    execSync(
        `cd ${feature_name}/src/static && ln -s ../../../../assets/fonts . && cd ../../ && npm i && npm run build`
    );
}

function handleCreateImporterFeature() {
    printUnderConstruction();
}

function createDirectoryStructure(structure, templates) {
    const recursiveCreate = (structure, templates, parent = ".") => {
        for (let key of Object.keys(structure)) {
            let dir = parent + "/" + key;

            if (!existsSync(dir)) {
                mkdirSync(dir);
            }

            for (let child of structure[key]) {
                if (typeof child === "object") {
                    recursiveCreate(child, templates, dir);
                } else if (typeof child === "string") {
                    var content = "";
                    var matches = keysIncludedIn(
                        [`${dir}/${child}`, child],
                        templates
                    );
                    if (matches.length > 0) {
                        content = templates[matches[0]]();
                    }
                    writeFileSync(dir + "/" + child, content);
                }
            }
        }
    };

    let feature_name = Object.keys(structure)[0];

    if (existsSync(`./${feature_name}`)) {
        throw Error("Feature already exists in this folder. Aborting!");
    }

    recursiveCreate(structure, templates);
}

// checks if any of the keys are included as substrings in the strings.
function keysIncludedIn(strings, object) {
    return Object.keys(object).filter((key) =>
        strings.some((s) => s.includes(key))
    );
}

function checkIfValueExists(value, obj) {
    if (!(value in obj)) {
        throw Error(`Developer error: ${value} does not exist!`);
    }
}
