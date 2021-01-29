"use strict";

const fs = require("fs");
const {spawn} = require("child_process");

const packageScope = "@polypoly-eu";

const packages = [
    "aop-ts",
    "bubblewrap",
    "customs",
    "eslint-config-polypoly",
    "fetch-spec",
    "orodruin",
    "podigree",
    "poly-api",
    "port-authority",
    "postoffice",
    "rdf",
    "rdf-convert",
    "rdf-spec",
    "testFeature"
];

const skipTestsFor = new Set(["customs", "fetch-spec", "podigree", "poly-api"]);

function parseManifest(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch {
        throw `Cannot read ${path}`;
    }
}

function extractLocalDependencies(manifest) {
    const prefix = `${packageScope}/`;
    return [
        ...Object.keys(manifest.dependencies || {}),
        ...Object.keys(manifest.devDependencies || {})
    ].filter(key => key.startsWith(prefix))
        .map(key => key.slice(prefix.length));
}

const extractCommands = manifest => new Set(Object.keys(manifest.scripts));

function createPackageData(name) {
    const manifest = parseManifest(`${name}/package.json`);
    return {
        name: name,
        dependencies: extractLocalDependencies(manifest),
        commands: extractCommands(manifest),
        skipCommands: new Set(skipTestsFor.has(name) ? ["test"] : [])
    };
}

const createPackageTree = () =>
      Object.fromEntries(packages.map(name => [name, createPackageData(name)]));

const logTopLevelMessage = (message) => console.log(`\n***** ${message}`);

const logDetailMessage = (message) => console.log(`\n*** ${message}`);

function execCommand(command, args) {
    const spawnedProcess = spawn(command, args);

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

const yarn = (...args) => execCommand("yarn", args);

async function yarnInstall(name) {
    logDetailMessage(`${name}: Installing dependencies ...`);
    await yarn("install", "--frozen-lockfile");
}

async function yarnRun(command, pkg) {
    if (!pkg.commands.has(command))
        return;

    if (pkg.skipCommands.has(command)) {
        logDetailMessage(`${name}: Skipping ${command} command`);
        return;
    }

    logDetailMessage(`${pkg.name}: Executing ${command} command ...`);
    await yarn("run", command);
}

async function buildNodePackage(name, pkg, {runLinting, runTests}) {
    const oldPath = process.cwd();
    try {
        process.chdir(name);
    } catch {
        throw `Directory ${name} does not exist`;
    }

    try {
        await yarnInstall(pkg.name);
        await yarnRun("build", pkg);
        if (runLinting)
            await yarnRun("eslint", pkg);
        if (runTests)
            await yarnRun("test", pkg);
    } finally {
        process.chdir(oldPath);
    }
}

async function buildPackage(packageTree, name, options) {
    if (!packageTree.hasOwnProperty(name))
        throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if (pkg.built)
        return;

    for (let dep of pkg.dependencies)
        await buildPackage(packageTree, dep, options);

    logTopLevelMessage(`Building ${name} ...`);
    await buildNodePackage(name, pkg, options);
    pkg.built = true;
}

async function buildAll(packageTree, options) {
    for (let name of Object.keys(packageTree))
        await buildPackage(packageTree, name, options);
}

(async function() {
    const parameters = process.argv.slice(2);
    if (parameters.includes("--help")) {
        console.log(`Usage: node build.js [--with-linting] [--with-tests]`);
        return 1;
    }

    try {
        const packageTree = createPackageTree();
        await buildAll(packageTree, {
            runLinting: parameters.includes("--with-linting"),
            runTests: parameters.includes("--with-tests")
        });
        logTopLevelMessage("Build succeeded!");
        logDetailMessage("Now you need to build polyPod-Android manually (sorry).");
        return 0;
    } catch(error) {
        logTopLevelMessage(`Build failed: ${error}\n`);
        return 1;
    }
})().then(process.exit);
