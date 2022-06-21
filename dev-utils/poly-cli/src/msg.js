import chalk from "chalk";

export function printErrorMsg(msg) {
    console.error(chalk.red.bold.underline(`🛑 ${msg} 🛑`));
}

export function printWarningMsg(msg) {
    console.warn(chalk.yellow.bold(`🚧 ${msg} 🚧`));
}

export function printUnderConstruction() {
    printWarningMsg("UNDER CONSTRUCTION ");
}

export function printHeadlineMsg(msg) {
    console.log(chalk.bold.blue(`🚧 ${msg} 🚧`));
}

export function printInfoMsg(msg) {
    console.log(chalk.white("🏗 ${msg} 🏗"));
}

export function printFeatureInfoMsg(featureType) {
    printInfoMsg(` Feature Type: ${chalk.red.italic.underline(featureType)}`);
}
