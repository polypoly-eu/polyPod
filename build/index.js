"use strict";

// Remember! Only core modules here. It's run before any package install.
const path = require("path");

const { performance } = require("perf_hooks");

const { checkVersions, ANSIBold } = require("./utils.js");

const { logMain, logDependencies, logSuccess } = require("./log.js");
const { parseCommandLine, showUsage, parseManifest } = require("./cli.js");
const { createPackageTree, skipPackages } = require("./deps.js");
const { npm, npx, npmInstall, npmRun, runCommand } = require("./npm.js");

const commands = {
    install: (pkg) => npmInstall(pkg.name),
    build: (pkg) => npmRun("build", pkg),
    test: (pkg) => npmRun("test", pkg),
    clean: (pkg) => pkg.clean(),
    "sync-deps": (pkg) => pkg.sync(),
};

async function executeCommand(pkg, command) {
    const oldPath = process.cwd();
    try {
        process.chdir(pkg.path);
    } catch {
        throw `Directory ${pkg.path} for package ${pkg.name} does not exist`;
    }

    try {
        await commands[command](pkg);
    } finally {
        process.chdir(oldPath);
    }
}

async function processPackage(name, packageTree, command) {
    if (!(name in packageTree)) throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if (pkg.processed) return;

    for (let dep of pkg.localDependencies)
        await processPackage(dep, packageTree, command);

    if (command === "list") {
        if (!Object.values(packageTree).some((pkg) => pkg.processed))
            logMain("Listing all packages in build order");
        console.log(`${name} (${pkg.path})`);
        pkg.processed = true;
        return;
    }

    const entries = Object.entries(packageTree);
    const total = entries.length;
    const current = entries.filter(([, pkg]) => pkg.processed).length + 1;
    logMain(
        `Executing ${command} for ${ANSIBold(
            pkg.path
        )} [${current}/${total}] ...`
    );
    await executeCommand(pkg, command);
    pkg.processed = true;
}

async function processAll(packageTree, command) {
    if (command === "list-deps") {
        logDependencies(packageTree);
        return;
    }

    for (let name of Object.keys(packageTree))
        await processPackage(name, packageTree, command);
}

async function main() {
    const { scriptPath, command, start } = parseCommandLine();
    if (!command) {
        showUsage(scriptPath);
        return 1;
    }

    process.chdir(path.dirname(scriptPath));
    const metaManifest = parseManifest("build/packages.json");
    const exitCode = checkVersions(metaManifest);
    if (exitCode !== 0) {
        return exitCode;
    }

    const eslintOptions = ["--ext", ".ts,.js,.tsx,.jsx", "."];

    if (command === "root-install") {
        await runCommand("root-install", "👷👷‍♀️", async () => {
            await npmInstall("/");
        });
        return 0;
    }

    if (command === "lint") {
        await runCommand("lint", "🧹", async () => {
            await npx(["eslint", ...eslintOptions]);
        });
        return 0;
    }

    if (command === "lintfix") {
        await runCommand("lintfix", "🚨", async () => {
            await npx(["eslint", "--fix", ...eslintOptions]);
        });
        return 0;
    }

    try {
        const startTime = performance.now();
        const packageTree = createPackageTree(metaManifest);
        if (start) skipPackages(packageTree, start);
        await processAll(packageTree, command);
        logSuccess(command, performance.now() - startTime);
        if (command === "clean") await npm("run", "clean");
        return 0;
    } catch (error) {
        logMain(`Command '${command}' failed: ${error}\n`);
        return 1;
    }
}

module.exports = () => main().then(process.exit);
