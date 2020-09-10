import yargs from "yargs";
import { serveCommand } from "./cli/serve";
import { testCommand } from "./cli/test";
import { packageCommand } from "./cli/package";

yargs
    .options({
        d: {
            type: "string",
            describe: "feature directory, defaults to current working directory",
            alias: "dir",
        },
    })
    .command(
        "serve [port]",
        "start the development server",
        (yargs) =>
            yargs
                .positional("port", {
                    describe: "port to bind on",
                    default: 4000,
                })
                .options({
                    b: {
                        type: "boolean",
                        default: false,
                        alias: "browser",
                        describe: "use browser-based API",
                    },
                    o: {
                        type: "boolean",
                        default: true,
                        alias: "open",
                        describe: "open browser after server has started",
                    },
                }),
        (argv) =>
            serveCommand({
                dir: argv.d,
                port: argv.port,
                browser: argv.b,
                open: argv.o,
            })
    )
    .command(
        "test [port]",
        "run feature in headless mode",
        (yargs) =>
            yargs
                .positional("port", {
                    describe: "port to bind on",
                    default: 4000,
                })
                .options({
                    b: {
                        type: "boolean",
                        default: false,
                        alias: "browser",
                        describe: "use browser-based API",
                    },
                }),
        (argv) =>
            testCommand({
                dir: argv.d,
                browser: argv.b,
                port: argv.port,
            })
    )
    .command(
        "package target",
        "package a static bundle of the feature",
        (yargs) =>
            yargs.positional("target", {
                describe: "target directory",
                type: "string",
                demandOption: true,
            }),
        (argv) =>
            packageCommand({
                dir: argv.d,
                target: argv.target,
            })
    )
    .help()
    .parse();
