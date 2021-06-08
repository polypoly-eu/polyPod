const typescript = require("@rollup/plugin-typescript");
const {nodeResolve} = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["mocha"],

        files: [
            { pattern: "src/tests/universal/**/*.test.ts", type: "module" },
            { pattern: "src/tests/browser/**/*.test.ts", type: "module" },
            { pattern: "src/tests/data/**", included: false }
        ],

        preprocessors: {
            "**/*.ts": ["rollup"]
        },

        rollupPreprocessor: {
            plugins: [
                nodeResolve(),
                commonjs(),
                typescript({
                    tsconfig: "./tsconfig.base.json"
                })
            ],
            output: {
                format: "esm",
                sourcemap: "inline"
            }
        },

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
    });
};
