import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { template as packageTemplate } from "./templates/package.js";

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

    const setup = (feature_name) => {
        let dependencies = ["rollup"];
        // folders are keys, files are strings.
        var structure = {};

        structure[feature_name] = [
            { src: ["index.js"] },
            { test: [] },
            "package.json",
            "manifest.json",
            "rollup.config.mjs",
            "README.md",
        ];

        let templates = {
            "package.json": packageTemplate(
                feature_name,
                "1.0.0",
                "empty feature",
                "src/index.js",
                "polypoly",
                "MIT"
            ),
        };

        if (existsSync(`./${feature_name}`)) {
            console.log(
                chalk.red.bold.underline(
                    "🛑 Feature already exists in this folder. Aborting! 🛑"
                )
            );
            return;
        }

        createDirectoryStructure(structure, ".", templates);

        // execSync(
        //     `cd ${feature_name} && npm init -y && npm install ${dependencies.reduce(
        //         (a, b) => a + " " + b,
        //         ""
        //     )}`
        // );
    };

    const setup_questions = [
        {
            type: "input",
            name: "feature_name",
            message: "Feature Name:",
            default: "example",
        },
    ];

    inquirer
        .prompt(setup_questions)
        .then((answers) => {
            if (!"feature_name" in answers) {
                console.log(
                    chalk.red.bold.underline(
                        "🛑 Developer error: You need to get feature_name from the inquirer answers. 🛑"
                    )
                );
                return;
            }

            let feature_name = answers.feature_name;

            setup(feature_name);
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}

function handleCreatePreviewFeature() {}

function handleCreateImporterFeature() {}

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
                if (templates.hasOwnProperty(child)) {
                    content = templates[child];
                }
                writeFileSync(dir + "/" + child, content);
            }
        }
    }
}
