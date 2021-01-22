"use strict";

const {spawn} = require("child_process");

// TODO: Don't hard code the package tree
const packageTree = {
    "aop-ts": {
	buildStep: true,
	dependencies: ["eslint-config-polypoly"]
    },
    "bubblewrap": {
	buildStep: true,
	dependencies: [
	    "eslint-config-polypoly",
	    "rdf",
	    "rdf-convert",
	    "rdf-spec"
	]
    },
    "customs": {
	buildStep: true,
	dependencies: ["eslint-config-polypoly"]
    },
    "eslint-config-polypoly": {
	buildStep: false,
	dependencies: []
    },
    "fetch-spec": {
	buildStep: true,
	dependencies: ["eslint-config-polypoly"]
    },
    "orodruin": {
	buildStep: true,
	dependencies: [
	    "customs",
	    "eslint-config-polypoly",
	    "podigree",
	    "poly-api"
	]
    },
    "podigree": {
	buildStep: true,
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
	buildStep: true,
	dependencies: [
	    "eslint-config-polypoly",
	    "fetch-spec",
	    "rdf",
	    "rdf-spec"
	]
    },
    "port-authority": {
	buildStep: true,
	dependencies: [
	    "bubblewrap",
	    "eslint-config-polypoly"
	]
    },
    "postoffice": {
	buildStep: true,
	dependencies: ["eslint-config-polypoly"]
    },
    "rdf": {
	buildStep: true,
	dependencies: [
	    "eslint-config-polypoly",
	    "rdf-spec"
	]
    },
    "rdf-convert": {
	buildStep: true,
	dependencies: [
	    "eslint-config-polypoly",
	    "rdf-spec"
	]
    },
    "rdf-spec": {
	buildStep: true,
	dependencies: ["eslint-config-polypoly"]
    }
}

function execCommand(command, args, workingDir) {
    const oldWorkingDir = process.cwd();
    try {
	process.chdir(workingDir);
    } catch {
	return Promise.reject(`Directory ${workingDir} does not exist`);
    }

    const spawnedProcess = spawn(command, args);

    spawnedProcess.stdout.on("data", function(data) {
	console.log(data.toString());
    });

    spawnedProcess.stderr.on("data", function(data) {
	console.error(data.toString());
    });

    return new Promise((resolve, reject) => {
	spawnedProcess.on("exit", function(code) {
	    process.chdir(oldWorkingDir);
	    if (code === 0)
		resolve();
	    else
		reject(`Process exited with {code}`);
	});
    });
}

const npmCi = path => execCommand("npm", ["ci", "--ignore-scripts"], path);
const npmBuild = path => execCommand("npm", ["run", "build"], path);
const npmCiAndBuild = path => npmCi(path).then(() => npmBuild(path));
const logMessage = (message) => console.log(`\n***** ${message}`);

async function buildPackage(name) {
    if (!(name in packageTree))
	throw `Unable to find package ${name}`;

    const pkg = packageTree[name];
    if ("built" in pkg || pkg.built)
	return;

    for (let dep of pkg.dependencies)
	await buildPackage(dep);

    logMessage(`Building ${name} ...`);
    await npmCi(name);
    if (pkg.buildStep)
	await npmBuild(name);
    pkg.built = true;
}

async function buildAllExcept(excludedNames) {
    for (let name in packageTree)
	if (!excludedNames.includes(name))
	    await buildPackage(name);
}

// TODO: Build podigree and orodruin as well, currently not possible,
//       probably due to: https://github.com/npm/cli/issues/1397

buildAllExcept(["podigree", "orodruin"])
    .then(() => {
	logMessage("Build succeeded!\n\nNow manually build first podigree and then orodruin and/or polyPod-Android.\n");
    })
    .catch((error) => {
	logMessage(`Build failed: ${error}\n`);
	process.exit(1);
    });
