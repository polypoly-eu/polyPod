#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");

function showUsage(scriptPath) {
    console.error(`Usage: ${path.basename(scriptPath)} [lint | test]`);
    console.error("  Run without arguments to build all packages");
}

function parseManifest(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch {
        throw `Cannot read ${path}`;
    }
}

function extractLocalDependencies(manifest, scope) {
    const prefix = `${scope}/`;
    return [
        ...Object.keys(manifest.dependencies || {}),
        ...Object.keys(manifest.devDependencies || {})
    ].filter(key => key.startsWith(prefix))
        .map(key => key.slice(prefix.length));
}

function createPackageData(name, metaManifest) {
    const manifest = parseManifest(`${name}/package.json`);
    return {
        name: name,
        dependencies: extractLocalDependencies(manifest, metaManifest.scope),
        scripts: Object.keys(manifest.scripts),
        skipScripts: metaManifest.skipTestsFor.includes(name) ? ["test"] : []
    };
}

function createPackageTree() {
    const metaManifest = parseManifest("packages.json");
    return Object.fromEntries(
        metaManifest.packages.map(
            name => [name, createPackageData(name, metaManifest)]));
}

const logMain = (message) => console.log(`\n***** ${message}`);

const logDetail = (message) => console.log(`\n*** ${message}`);

function executeProcess(executable, args) {
    const spawnedProcess = spawn(executable, args);

    spawnedProcess.stdout.on("data", function(data) {
        console.log(data.toString());
    });

    spawnedProcess.stderr.on("data", function(data) {
        console.error(data.toString());
    });

    return new Promise((resolve, reject) => {
        spawnedProcess.on("exit", function(code) {
            if (code === 0)
                resolve();
            else
                reject(`Process exited with {code}`);
        });
    });
}

const yarn = (...args) => executeProcess("yarn", args);

async function yarnInstall(name) {
    logDetail(`${name}: Installing dependencies ...`);
    await yarn("install", "--frozen-lockfile");
}

async function yarnRun(script, pkg) {
    if (!pkg.scripts.includes(script))
        return;

    if (pkg.skipScripts.includes(script)) {
        logDetail(`${pkg.name}: Skipping ${script} script`);
        return;
    }

    logDetail(`${pkg.name}: Executing ${script} script ...`);
    await yarn("run", script);
}

const commands = {
    build: pkg => yarnInstall(pkg.name).then(() => yarnRun("build", pkg)),
    lint: pkg => yarnRun("eslint", pkg),
    test: pkg => yarnRun("test", pkg)
};

async function executeCommand(pkg, command) {
    const oldPath = process.cwd();
    try {
        process.chdir(pkg.name);
    } catch {
        throw `Directory ${pkg.name} does not exist`;
    }

    try {
        await commands[command](pkg);
    } finally {
        process.chdir(oldPath);
    }
}

async function processPackage(name, packageTree, command) {
    if (!packageTree.hasOwnProperty(name))
        throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if (pkg.built)
        return;

    for (let dep of pkg.dependencies)
        await processPackage(dep, packageTree, command);

    const entries = Object.entries(packageTree);
    const total = entries.length;
    const current = entries.filter(([_, pkg]) => pkg.built).length + 1;
    logMain(`Executing ${command} for ${name} [${current}/${total}] ...`);
    await executeCommand(pkg, command);
    pkg.built = true;
}

async function processAll(packageTree, command) {
    for (let name of Object.keys(packageTree))
        await processPackage(name, packageTree, command);
}

(async () => {
    const [, scriptPath, ...parameters] = process.argv;
    if (parameters.includes("--help") || parameters.length > 1) {
        showUsage(scriptPath);
        return 1;
    }

    const command = parameters.length ? parameters[0] : "build";
    if (!["build", "test", "lint"].includes(command)) {
        showUsage(scriptPath);
        return 1;
    }

    process.chdir(path.dirname(scriptPath));
    try {
        const packageTree = createPackageTree();
        await processAll(packageTree, command);
        logMain("Build succeeded!");
        return 0;
    } catch(error) {
        logMain(`Build failed: ${error}\n`);
        return 1;
    }
})().then(process.exit);
