const { logMain } = require("./log.js");
const { parseManifest } = require("./cli.js");

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

module.exports = {
    extractDependencies,
    createPackageData,
    createPackageTree,
    collectDependentPackages,
    skipPackages,
};
