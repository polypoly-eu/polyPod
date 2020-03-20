import yargs from "yargs";
import {devCommand} from "./cli/dev";

yargs
    .options({
        d: {
            type: "string",
            describe: "feature directory, defaults to current working directory",
            alias: "dir"
        }
    })
    .command(
        "dev [port]",
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
                    s: {
                        alias: "strategy",
                        default: "lazy",
                        describe: "asset loading strategy",
                        choices: ["lazy", "eager"]
                    }
                }),
        argv => devCommand({
            log: argv.l,
            dir: argv.d,
            port: argv.port,
            inmemory: argv.m,
            strategy: argv.s
        })
    )
    .argv;
