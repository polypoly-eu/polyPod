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
        dependencies: ["eslint-config-polypoly"]
    },
    "eslint-config-polypoly": {
        skipRunBuild: true,
        dependencies: []
    },
    "fetch-spec": {
        dependencies: ["eslint-config-polypoly"]
    },
    "orodruin": {
        dependencies: [
            "customs",
            "eslint-config-polypoly",
            "podigree",
            "poly-api"
        ]
    },
    "podigree": {
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
        dependencies: [
            "eslint-config-polypoly",
            "fetch-spec",
            "rdf",
            "rdf-spec"
        ]
    },
    "port-authority": {
        dependencies: [
            "bubblewrap",
            "eslint-config-polypoly"
        ]
    },
    "postoffice": {
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
        dependencies: ["poly-api"]
    }
}

const logMessage = (message) => console.log(`\n***** ${message}`);

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

async function buildNodePackage(name, pkg) {
    const oldPath = process.cwd();
    try {
        process.chdir(name);
    } catch {
        throw `Directory ${name} does not exist`;
    }

    try {
        await yarn("install", "--frozen-lockfile");
        if (!pkg.skipRunBuild)
            await yarn("run", "build");
    } finally {
        process.chdir(oldPath);
    }
}

async function buildPackage(name) {
    if (!(name in packageTree))
        throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if (pkg.built)
        return;

    for (let dep of pkg.dependencies)
        await buildPackage(dep);

    logMessage(`Building ${name} ...`);
    await buildNodePackage(name, pkg);
    pkg.built = true;
}

async function buildAll() {
    for (let name in packageTree)
        await buildPackage(name);
}

buildAll()
    .then(() => {
        logMessage("Build succeeded!\n\nNow you need to build polyPod-Android manually (sorry).\n");
    })
    .catch((error) => {
        logMessage(`Build failed: ${error}\n`);
        process.exit(1);
    });
