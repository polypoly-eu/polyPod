"use strict";

const fs = require("fs");
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
	fullInstallNeeded: true,
	dependencies: [
	    "customs",
	    "eslint-config-polypoly",
	    "podigree",
	    "poly-api"
	]
    },
    "podigree": {
	fullInstallNeeded: true,
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

const npm = (...args) => execCommand("npm", args);

async function npmInstallDependencies(pkg) {
    // TODO: Some packages will currently only install their dependencies
    //       properly with the following workaround.
    //       Probably because of: https://github.com/npm/cli/issues/1397
    if (pkg.fullInstallNeeded) {
	console.log("Performing a full dependency reinstall - this might take a while");
	fs.rmdirSync("node_modules", { recursive: true });
	fs.unlinkSync("package-lock.json");
	await npm("install");
	return;
    }

    await npm("ci", "--ignore-scripts");
}

async function npmExecuteBuildSteps(pkg) {
    if (!pkg.skipRunBuild)
	await npm("run", "build");
}

const npmRunBuild = () => execCommand("npm", ["run", "build"]);

async function buildNpmPackage(name, pkg) {
    const oldPath = process.cwd();
    try {
	process.chdir(name);
    } catch {
	throw `Directory ${name} does not exist`;
    }

    try {
	await npmInstallDependencies(pkg);
	await npmExecuteBuildSteps(pkg);
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
    await buildNpmPackage(name, pkg);
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
