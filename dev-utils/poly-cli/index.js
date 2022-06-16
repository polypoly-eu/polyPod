import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";

yargs(hideBin(process.argv))
    .scriptName("poly-cli")
    .command(
        "create <what> [type]",
        "Creates features for now. Use create feature to start creating one.",
        (yargs) => {
            yargs.positional("what", {
                type: "string",
                default: "feature",
                describe:
                    "-> the kind of thing you want poly-cli to create for you. Options: feature",
            });

            yargs.positional("type", {
                type: "string",
                default: "empty",
                describe: "-> the type of feature: empty, preview, or importer",
            });
        },
        handleCreate
    )
    .help().argv;

function handleCreate(arg) {
    if (arg.what === "feature") {
        handleCreateFeature(arg.type);
    }
}

function handleCreateFeature(type) {
    console.log(chalk.bold.blue("🚧 Creating Feature 🚧"));
    console.log(
        chalk.white("🏗  Feature Type:", chalk.red.italic.underline(type), "🏗")
    );

    if (type === "empty") {
        handleCreateEmptyFeature();
    } else if (type === "preview") {
        handleCreatePreviewFeature();
    } else if (type === "importer") {
        handleCreateImporterFeature();
    } else {
        console.log(
            chalk.red.bold.underline(
                "🛑 Feature type not recognized. Aborting! 🛑"
            )
        );
    }
}

function handleCreateEmptyFeature() {
    // TODO
    // Create project structure: src, test
    // Create files: index.js, package.json, rollup, manifest.json.

    // TEMPLATES
    // package.json needs to use rollup -c for the build script.
    // author will be passed as input, as well as the license.

    let dependencies = ["rollup"];

    let feature_name = "test_feature";

    // folders are keys, strings are files.
    var structure = {};

    structure[feature_name] = [
        { src: ["index.js"] },
        { test: [] },
        //"package.json",
        "manifest.json",
        "rollup.config.mjs",
        "README.md",
    ];

    if (existsSync(`./${feature_name}`)) {
        console.log(
            chalk.red.bold.underline(
                "🛑 Feature already exists in this folder. Aborting! 🛑"
            )
        );
        return;
    }

    createDirectoryStructure(structure, ".");
    execSync(
        `cd ${feature_name} && npm init -y && npm install ${dependencies.reduce(
            (a, b) => a + " " + b,
            ""
        )}`
    );
}

function handleCreatePreviewFeature() {}

function handleCreateImporterFeature() {}

function createDirectoryStructure(structure, parent) {
    for (let key of Object.keys(structure)) {
        let dir = parent + "/" + key;

        if (!existsSync(dir)) {
            mkdirSync(dir);
        }

        for (let child of structure[key]) {
            if (typeof child === "object") {
                createDirectoryStructure(child, dir);
            } else if (typeof child === "string") {
                writeFileSync(dir + "/" + child, "");
            }
        }
    }
}
