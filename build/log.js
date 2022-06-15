const { ANSIBold } = require("./utils.js");

const logMain = (message) => console.log(`\n 🚧 ${message}`);

const logDetail = (message) => console.log(`\n 🏗️ ${message}`);

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

function logSuccess(command, timeLapsed) {
    let message = `✅ Command «${ANSIBold(command)}» succeeded`;
    const secondsLapsed = (timeLapsed / 1000).toFixed(2);
    if (timeLapsed) {
        message += ` in ⏰ ${ANSIBold(secondsLapsed)}s!`;
    }
    logMain(message);
}

module.exports = { logMain, logDetail, logDependencies, logSuccess };
