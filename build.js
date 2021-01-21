"use strict";

const {spawn} = require("child_process");

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

function buildDepsFor(packages) {
    // TODO: Don't hard code, use packageTree above
    return npmCi("eslint-config-polypoly")
	.then(() => npmCiAndBuild("aop-ts"))
	.then(() => npmCiAndBuild("customs"))
	.then(() => npmCiAndBuild("fetch-spec"))
	.then(() => npmCiAndBuild("postoffice"))
	.then(() => npmCiAndBuild("rdf-spec"))
	.then(() => npmCiAndBuild("rdf"))
	.then(() => npmCiAndBuild("rdf-convert"))
	.then(() => npmCiAndBuild("bubblewrap"))
	.then(() => npmCiAndBuild("poly-api"))
	.then(() => npmCiAndBuild("port-authority"));
}

// TODO: Build podigree and orodruin as well, currently not possible,
//       probably due to: https://github.com/npm/cli/issues/1397

buildDepsFor(["podigree", "orodruin"])
    .then(() => {
	console.log("Done! Now manually build first podigree and then orodruin and/or polyPod-Android");
    })
    .catch((error) => {
	console.error(`Build failed: ${error}`);
    });
