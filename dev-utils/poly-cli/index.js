import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
}
