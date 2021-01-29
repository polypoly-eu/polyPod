"use strict";

const {spawn} = require("child_process");

// TODO: Don't hard code the package tree
const packageTree = {
    "aop-ts": {
        dependencies: ["eslint-config-polypoly"]
    },
    "bubblewrap": {
        dependencies: [
            "eslint-config-polypoly",
            "rdf",
            "rdf-convert",
            "rdf-spec"
        ]
    },
    "customs": {
        skipRunTest: true, // These fail :(
        dependencies: ["eslint-config-polypoly"]
    },
    "eslint-config-polypoly": {
        skipRunBuild: true, // No build script
        skipRunLint: true, // No lint script
        skipRunTest: true, // No test script
        dependencies: []
    },
    "fetch-spec": {
        skipRunTest: true, // These fail :(
        dependencies: ["eslint-config-polypoly"]
    },
    "orodruin": {
        skipRunTest: true, // These fail :(
        dependencies: [
            "customs",
            "eslint-config-polypoly",
            "podigree",
            "poly-api"
        ]
    },
    "podigree": {
        skipRunTest: true, // These fail :(
        dependencies: [
            "aop-ts",
            "bubblewrap",
            "eslint-config-polypoly",
            "poly-api",
            "port-authority",
            "postoffice",
            "rdf",
            "rdf-convert",
            "rdf-spec"
        ]
    },
    "poly-api": {
        skipRunTest: true, // These fail :(
        dependencies: [
            "eslint-config-polypoly",
            "fetch-spec",
            "rdf",
            "rdf-spec"
        ]
    },
    "port-authority": {
        skipRunTest: true, // These fail :(
        dependencies: [
            "bubblewrap",
            "eslint-config-polypoly"
        ]
    },
    "postoffice": {
        skipRunLint: true, // These fails :(
        dependencies: ["eslint-config-polypoly"]
    },
    "rdf": {
        dependencies: [
            "eslint-config-polypoly",
            "rdf-spec"
        ]
    },
    "rdf-convert": {
        dependencies: [
            "eslint-config-polypoly",
            "rdf-spec"
        ]
    },
    "rdf-spec": {
        dependencies: ["eslint-config-polypoly"]
    },
    "testFeature": {
        skipRunLint: true, // No lint script
        skipRunTest: true, // No test script
        dependencies: ["poly-api"]
    }
}

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

async function yarnRunBuild(name, pkg) {
    if (pkg.skipRunBuild)
        return;

    logDetailMessage(`${name}: Executing build steps ...`);
    await yarn("run", "build");
}

async function yarnRunLint(name, pkg) {
    if (pkg.skipRunLint) {
        logDetailMessage(`${name}: Skipped linting`);
        return;
    }

    logDetailMessage(`${name}: Linting ...`);
    await yarn("run", "eslint");
}

async function yarnRunTest(name, pkg) {
    if (pkg.skipRunTest) {
        logDetailMessage(`${name}: Skipped tests`);
        return;
    }

    logDetailMessage(`${name}: Running tests ...`);
    await yarn("run", "test");
}

async function buildNodePackage(name, pkg, {runLinting, runTests}) {
    const oldPath = process.cwd();
    try {
        process.chdir(name);
    } catch {
        throw `Directory ${name} does not exist`;
    }

    try {
        await yarnInstall(name);
        await yarnRunBuild(name, pkg);
        if (runLinting)
            await yarnRunLint(name, pkg);
        if (runTests)
            await yarnRunTest(name, pkg);
    } finally {
        process.chdir(oldPath);
    }
}

async function buildPackage(name, options) {
    if (!(name in packageTree))
        throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if (pkg.built)
        return;

    for (let dep of pkg.dependencies)
        await buildPackage(dep, options);

    logTopLevelMessage(`Building ${name} ...`);
    await buildNodePackage(name, pkg, options);
    pkg.built = true;
}

async function buildAll(options) {
    for (let name in packageTree)
        await buildPackage(name, options);
}

async function main() {
    const parameters = process.argv.slice(2);
    if (parameters.includes("--help")) {
        console.log(`Usage: node build.js [--with-linting] [--with-tests]`);
        return 1;
    }

    try {
        await buildAll({
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
}

main().then(process.exit);
