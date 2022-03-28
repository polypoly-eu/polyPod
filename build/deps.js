const { logMain } = require("./log.js");
const { Pkg } = require("./pkg.js");

function createPackageTree(metaManifest) {
    return Object.fromEntries(
        metaManifest.packages
            .map((path) => new Pkg(path))
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
    createPackageTree,
    skipPackages,
};
