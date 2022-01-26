"use strict";

// Remember! Only core modules here. It's run before any package install.
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

const { performance } = require("perf_hooks");

const {
    platformize,
    checkVersions,
    ANSIBold,
    ANSIInvert,
} = require("./utils.js");

const { logMain, logDetail, logDependencies, logSuccess } = require("./log.js");
const { parseCommandLine, showUsage, parseManifest } = require("./cli.js");
const { createPackageTree, skipPackages } = require("./deps.js");
const { executeProcess, npm, npmInstall, npmRun } = require("./npm.js");

async function cleanPackage(pkg) {
    if (await npmRun("clean", pkg)) return;

    // Just so that we don't have to add a 'clean' script to every single
    // package, we cover the conventional case as a fallback - but it's
    // arguably a bit dangerous.
    logDetail(`${pkg.name}: Executing fallback clean logic ...`);
    for (let path of ["node_modules", "dist"])
        await fsPromises.rm(path, { recursive: true, force: true });
}

async function syncPackage(pkg) {
    logDetail(`🕑 ${pkg.name} ...`);
    if (fs.existsSync("package-lock.json")) {
        fs.rmSync("package-lock.json");
    }
    await npm("i");
}

const commands = {
    install: (pkg) => npmInstall(pkg.name),
    build: (pkg) => npmRun("build", pkg),
    test: (pkg) => npmRun("test", pkg),
    clean: (pkg) => cleanPackage(pkg),
    "sync-deps": (pkg) => syncPackage(pkg),
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

    if (!["list", "list-deps"].includes(command)) {
        logDetail(`👷👷‍♀️ ...`);
        await npmInstall("/");
    }

    if (command === "lint") {
        logDetail(`🧹 ...`);
        await executeProcess("npx", ["eslint", ...eslintOptions]);
        logSuccess(command);
        return 0;
    }

    if (command === "lintfix") {
        logDetail(`🚨 ...`);
        await executeProcess("npx", ["eslint", "--fix", ...eslintOptions]);
        logSuccess(command);
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
