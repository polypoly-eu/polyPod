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

function setup(feature_name, author, version, description, license) {
    // folders are objects, files are strings.
    var structure = {};

    structure[feature_name] = [
        {
            src: [
                { static: ["manifest.json", "index.html"] },
                "index.js",
                "styles.css",
            ],
        },
        { test: [] },
        "package.json",
        "README.md",
        "rollup.config.mjs",
    ];

    let templates = {
        "package.json": packageTemplate(
            feature_name,
            version,
            description,
            "src/index.js",
            author,
            license
        ),
        "manifest.json": manifestTemplate(feature_name, author),
        "README.md": readmeTemplate(feature_name, description),
        "rollup.config.mjs": readFileSync(
            path.resolve(__dirname, "./src/static/templates/rollup.config.mjs")
        ),
        "index.html": readFileSync(
            path.resolve(__dirname, "./src/static/templates/index.html")
        ),
        "index.js": readFileSync(
            path.resolve(__dirname, "./src/static/templates/index.js")
        ),
        "styles.css": readFileSync(
            path.resolve(__dirname, "./src/static/templates/styles.css")
        ),
        "locales/en/common.js": readFileSync(
            path.resolve(
                __dirname,
                "./src/static/templates/locales/en/common.json"
            )
        ),
        "locales/de/common.js": readFileSync(
            path.resolve(
                __dirname,
                "./src/static/templates/locales/de/common.json"
            )
        ),
    };

    if (existsSync(`./${feature_name}`)) {
        printErrorMsg("Feature already exists in this folder. Aborting!");
        return;
    }

    createDirectoryStructure(structure, ".", templates);

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
        handleCreatePreviewFeature();
    } else if (arg.type === "importer") {
        handleCreateImporterFeature();
    } else {
        printErrorMsg(`Feature type ${arg.type} not recognized. Aborting!`);
    }
}

function handleCreateEmptyFeature(arg) {
    setup(
        arg.name,
        arg.author,
        arg.featureVersion,
        arg.description,
        arg.license
    );
}

function handleCreatePreviewFeature() {
    printUnderConstruction();
}

function handleCreateImporterFeature() {
    printUnderConstruction();
}

function createDirectoryStructure(structure, parent, templates) {
    for (let key of Object.keys(structure)) {
        let dir = parent + "/" + key;

        if (!existsSync(dir)) {
            mkdirSync(dir);
        }

        for (let child of structure[key]) {
            if (typeof child === "object") {
                createDirectoryStructure(child, dir, templates);
            } else if (typeof child === "string") {
                var content = "";
                if (child in templates) {
                    content = templates[child];
                }
                writeFileSync(dir + "/" + child, content);
            }
        }
    }
}

function checkIfValueExists(value, obj) {
    if (!(value in obj)) {
        printErrorMsg(`Developer error: ${value} does not exist!`);
        throw Error("Dev error");
    }
}
