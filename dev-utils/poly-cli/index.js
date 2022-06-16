const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
    .scriptName("poly-cli")
    .command(
        "create <what>",
        "Creates features for now. Use create feature to start creating one.",
        (yargs) => {
            yargs.positional("what", {
                type: "string",
                default: "feature",
                describe:
                    "the kind of thing you want poly-cli to create for you.",
            });
        },
        handleCreate
    )
    .help().argv;

function handleCreate(arg) {
    console.log("Creating", arg.what);
}
