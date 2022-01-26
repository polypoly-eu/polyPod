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

function extractDependencies(manifest) {
    const allDependencies = {
        ...manifest.dependencies,
        ...manifest.devDependencies,
    };
    const localDependencies = [];
    const remoteDependencies = [];
    for (let [name, url] of Object.entries(allDependencies)) {
        const group = url.startsWith("file:")
            ? localDependencies
            : remoteDependencies;
        group.push(name);
    }
    return { localDependencies, remoteDependencies };
}

function createPackageData(path) {
    const manifest = parseManifest(`${path}/package.json`);
    const { localDependencies, remoteDependencies } =
        extractDependencies(manifest);
    return {
        path,
        name: manifest.name,
        localDependencies,
        remoteDependencies,
        scripts: Object.keys(manifest.scripts || {}),
    };
}

function createPackageTree(metaManifest) {
    return Object.fromEntries(
        metaManifest.packages
            .map((path) => createPackageData(path))
            .map((data) => [data.name, data])
    );
}

function collectDependentPackages(name, packageTree) {
    const dependents = Object.keys(packageTree).filter((key) =>
        packageTree[key].localDependencies.includes(name)
    );
    let transitiveDependents = [];
    for (let dependent of dependents)
        transitiveDependents = transitiveDependents.concat(
            collectDependentPackages(dependent, packageTree)
        );
    return dependents.concat(transitiveDependents);
}

function skipPackages(packageTree, start) {
    if (!Object.keys(packageTree).includes(start))
        throw `Start package with name '${start}' not found - did you use the path?`;

    logMain(`Starting at package '${start}'`);

    const packagesToKeep = new Set([
        start,
        ...collectDependentPackages(start, packageTree),
    ]);
    for (let [name, pkg] of Object.entries(packageTree))
        if (!packagesToKeep.has(name)) pkg.processed = true;
}

function executeProcess(executable, args, env = process.env) {
    const cmd = platformize(executable);
    const spawnedProcess = spawn(cmd, args, { env: env });
    spawnedProcess.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    spawnedProcess.stderr.on("data", (data) => {
        console.error(data.toString());
    });

    return new Promise((resolve, reject) => {
        spawnedProcess.on("exit", (code) => {
            if (code === 0) resolve();
            else reject(`Process exited with ${code}`);
        });
    });
}

const npm = async (...args) => {
    const start = new Date();
    await executeProcess(
        "npm",
        ["--no-update-notifier", "--no-fund", ...args],
        { ...process.env, FORCE_COLOR: 1 }
    );
    const elapsed = new Date() - start;
    const realCommand = args[args.length - 1];
    logDetail(` ${ANSIInvert("npm " + realCommand)} finished in ${elapsed} ms`);
};

async function npmInstall(name) {
    logDetail(`${name}: Installing dependencies ...`);
    await npm("--no-audit", "--prefer-offline", "ci");
}

async function npmRun(script, pkg) {
    if (!pkg.scripts.includes(script)) return false;

    logDetail(`${pkg.name}: Executing ${script} script ...`);
    await npm("run", script);
    return true;
}

async function cleanPackage(pkg) {
    if (await npmRun("clean", pkg)) return;

    // Just so that we don't have to add a 'clean' script to every single
    // package, we cover the conventional case as a fallback - but it's
    // arguably a bit dangerous.
    logDetail(`${pkg.name}: Executing fallback clean logic ...`);
    for (let path of ["node_modules", "dist", "build"])
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
