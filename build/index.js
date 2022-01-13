"use strict";

const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const { spawn, execSync } = require("child_process");

const { performance } = require("perf_hooks");
const validCommands = [
    "build",
    "clean",
    "test",
    "lint",
    "lintfix",
    "list",
    "list-deps",
];

function parseCommandLine() {
    const [, scriptPath, ...parameters] = process.argv;
    if (parameters.includes("--help")) return { scriptPath, command: null };

    const startIndex = parameters.indexOf("--start");
    if (startIndex > 0 && startIndex + 1 >= parameters.length)
        return { scriptPath, command: null };
    const start =
        startIndex !== -1 ? parameters.splice(startIndex, 2)[1] : null;

    if (parameters.length > 1) return { scriptPath, command: null };

    const command = parameters.length ? parameters[0] : "build";
    return {
        scriptPath,
        command: validCommands.includes(command) ? command : null,
        start,
    };
}

function showUsage(scriptPath) {
    const baseName = path.basename(scriptPath);
    const validCommandString = validCommands.join(" | ");
    console.error(
        `Usage: ${baseName} [ --start PACKAGE_NAME ] [ ${validCommandString} ]`
    );
    console.error("  Run without arguments to build all packages");
}

function parseManifest(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch {
        throw `Cannot read ${path}`;
    }
}

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

const logMain = (message) => console.log(`\n 🚧 ${message}`);

const logDetail = (message) => console.log(`\n 🏗️ ${message}`);

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

function logDependencies(packageTree) {
    const dependencyMap = {};
    for (let pkg of Object.values(packageTree)) {
        for (let dep of pkg.remoteDependencies) {
            dependencyMap[dep] = dependencyMap[dep] || [];
            dependencyMap[dep].push(pkg.name);
        }
    }

    const sorted = Object.entries(dependencyMap).sort((a, b) =>
        a[0].localeCompare(b[0])
    );

    logMain(`Listing dependencies of all packages ${sorted.length}`);
    for (let [dependency, users] of sorted) {
        logDetail(dependency);
        console.log(`Used by: ${users.join(", ")}`);
    }
}

function executeProcess(executable, args, env = process.env) {
    const cmd = process.platform === "win32" ? `${executable}.cmd` : executable;
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
    logDetail(`NPM finished in ${elapsed} ms`);
};

async function npmInstall(name) {
    logDetail(`${name}: Installing dependencies ...`);
    await npm("ci");
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

const commands = {
    build: (pkg) => npmInstall(pkg.name).then(() => npmRun("build", pkg)),
    test: (pkg) => npmRun("test", pkg),
    clean: (pkg) => cleanPackage(pkg),
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

function ANSIBold(string) {
    return `\x1b[1m${string}\x1b[0m`;
}

function logSuccess(command, timeLapsed) {
    let message = `✅ Command «${ANSIBold(command)}» succeeded`;
    const secondsLapsed = (timeLapsed / 1000).toFixed(2);
    if (timeLapsed) {
        message += ` in ⏰ ${ANSIBold(secondsLapsed)}s!`;
    }
    logMain(message);
}

function checkVersions(metaManifest) {
    const thisNPM = process.platform === "win32" ? "npm.cmd" : "npm";
    let exitCode = 0;
    const nodeMajorVersion = parseInt(process.version.slice(1, 3), 10);
    if (nodeMajorVersion < metaManifest.requiredNodeMajorVersion) {
        console.error(
            `⚠️ Node.js v${metaManifest.requiredNodeMajorVersion} or later ` +
                `required, you are on ${process.version}`
        );
        exitCode = 1;
    }
    const npmVersion = execSync(`${thisNPM} --version`, { encoding: 'utf-8' });
    const npmMajorVersion = npmVersion.match(/^(\d+)\.\d+/)[0];
    if (npmMajorVersion < metaManifest.requiredNPMMajorVersion) {
            console.error(
                `⚠️ NPM ${metaManifest.requiredNPMMajorVersion} or later ` +
                `required, you are on ${npmMajorVersion}`
            );
            exitCode = 1;
    }
    return exitCode;
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
    if (exitCode !== 0 ) {
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
