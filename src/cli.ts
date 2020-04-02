import yargs from "yargs";
import {serveCommand} from "./cli/serve";
import {buildCommand} from "./cli/build";

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
                    }
                }),
        argv => serveCommand({
            log: argv.l,
            dir: argv.d,
            port: argv.port,
            inmemory: argv.m
        })
    )
    .command(
        "build",
        "build the feature",
        yargs =>
            yargs
                .options({
                    w: {
                        type: "boolean",
                        default: false,
                        alias: "watch",
                        describe: "watch sources and rebuild"
                    }
                }),
        argv => buildCommand({
            dir: argv.d,
            watch: argv.w
        })
    )
    .help()
    .parse();
