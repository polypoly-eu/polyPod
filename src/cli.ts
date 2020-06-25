import yargs from "yargs";
import {serveCommand} from "./cli/serve";
import {testCommand} from "./cli/test";

yargs
    .options({
        d: {
            type: "string",
            describe: "feature directory, defaults to current working directory",
            alias: "dir"
        }
    })
    .command(
        "serve [port]",
        "start the development server",
        yargs =>
            yargs
                .positional("port", {
                    describe: "port to bind on",
                    default: 4000
                })
                .options({
                    m: {
                        type: "boolean",
                        default: false,
                        alias: "memory",
                        describe: "use empty in-memory filesystem for polyOut"
                    },
                    l: {
                        type: "boolean",
                        default: false,
                        alias: "log",
                        describe: "log API actions"
                    },
                    o: {
                        type: "boolean",
                        default: true,
                        alias: "open",
                        describe: "open browser after server has started"
                    }
                }),
        argv => serveCommand({
            log: argv.l,
            dir: argv.d,
            port: argv.port,
            inmemory: argv.m,
            open: argv.o
        })
    )
    .command(
        "test [port]",
        "run feature in headless mode",
        yargs =>
            yargs
                .positional("port", {
                    describe: "port to bind on",
                    default: 4000
                }),
        argv => testCommand({
            dir: argv.d,
            port: argv.port,
        })
    )
    .help()
    .parse();
