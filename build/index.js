"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function parseCommandLine() {
    const [, scriptPath, ...parameters] = process.argv;
    if (parameters.includes("--help") || parameters.length > 1)
        return { scriptPath, command: null };

    const validCommands = ["build", "test", "lint", "list", "list-deps"];
    const command = parameters.length ? parameters[0] : "build";
    return {
        scriptPath,
        command: validCommands.includes(command) ? command : null,
    };
}

function showUsage(scriptPath) {
    console.error(
        `Usage: ${path.basename(scriptPath)} [lint | test | list | list-deps]`
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
    const { localDependencies, remoteDependencies } = extractDependencies(
        manifest
    );
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

const logMain = (message) => console.log(`\n***** ${message}`);

const logDetail = (message) => console.log(`\n*** ${message}`);

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
    const spawnedProcess = spawn(executable, args, { env: env });

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

const npm = (...args) =>
    executeProcess("npm", args, { ...process.env, FORCE_COLOR: 1 });

async function npmInstall(name) {
    logDetail(`${name}: Installing dependencies ...`);
    await npm("ci", "--no-update-notifier", "--no-fund");
}

async function npmRun(script, pkg) {
    if (!pkg.scripts.includes(script)) return;

    logDetail(`${pkg.name}: Executing ${script} script ...`);
    await npm("run", script);
}

const commands = {
    build: (pkg) => npmInstall(pkg.name).then(() => npmRun("build", pkg)),
    lint: (pkg) =>
        npmInstall("@polypoly-eu/eslint-config").then(() =>
            npmRun("lint", pkg)
        ),
    test: (pkg) => npmRun("test", pkg),
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
    logMain(`Executing ${command} for ${pkg.path} [${current}/${total}] ...`);
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
    const { scriptPath, command } = parseCommandLine();
    if (!command) {
        showUsage(scriptPath);
        return 1;
    }

    process.chdir(path.dirname(scriptPath));

    const metaManifest = parseManifest("build/packages.json");
    const nodeMajorVersion = parseInt(process.version.slice(1, 3), 10);
    if (nodeMajorVersion < metaManifest.requiredNodeMajorVersion) {
        console.error(
            `Node.js v${metaManifest.requiredNodeMajorVersion} or later ` +
                `required, you are on ${process.version}`
        );
        return 1;
    }

    try {
        const packageTree = createPackageTree(metaManifest);
        await processAll(packageTree, command);
        logMain(`Command '${command}' succeeded!`);
        return 0;
    } catch (error) {
        logMain(`Command '${command}' failed: ${error}\n`);
        return 1;
    }
}

module.exports = () => main().then(process.exit);
