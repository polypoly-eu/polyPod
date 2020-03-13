const sucrase = require("@rollup/plugin-sucrase");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");
const {KarmaRPCPlugin} = require("./karma/dist/index");

process.env.CHROME_BIN = require("puppeteer").executablePath();
process.env.FIREFOX_BIN = require("puppeteer-firefox").executablePath();

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],

        plugins: [
            { "middleware:rpc": ["factory", KarmaRPCPlugin] },
            "karma-*"
        ],

        files: [
            "src/tests/browser/**/*.test.ts",
            { pattern: "src/tests/data/**", included: false }
        ],

        preprocessors: {
            "**/*.ts": ["rollup"]
        },

        rollupPreprocessor: {
            plugins: [
                globals(),
                builtins(),
                resolve(),
                commonjs(),
                // uses sucrase and checks TS compilation separately because @rollup/plugin-typescript apparently
                // doesn't work together with karma-rollup-preprocessor
                sucrase({
                    exclude: ["node_modules/**"],
                    transforms: ["typescript"]
                })
            ],
            output: {
                format: "iife",
                name: "postoffice",
                sourcemap: "inline"
            }
        },

        beforeMiddleware: ["rpc"],

        browsers: ["ChromeHeadless", "FirefoxHeadless"],

        reporters: ["spec"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,

        client: {
            captureConsole: true
        }
    })
};
