const fs = require("fs");
const { spawn } = require("child_process");

const { platformize, ANSIInvert } = require("./utils.js");
const { logDetail, logSuccess } = require("./log.js");

function executeProcess(executable, args, env = process.env) {
    const cmd = platformize(executable);
    const spawnedProcess = spawn(cmd, args, { env: env });
    spawnedProcess.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    spawnedProcess.stderr.on("data", (data) => {
        console.error(data.toString());
    });

    return new Promise((resolve, reject) => {
        spawnedProcess.on("exit", (code) => {
            if (code === 0) resolve();
            else reject(`Process exited with ${code}`);
        });
    });
}

const npm = async (...args) => {
    const start = new Date();
    const result = await executeProcess(
        "npm",
        ["--no-update-notifier", "--no-fund", ...args],
        {
            ...process.env,
            FORCE_COLOR: 1,
        }
    );
    const elapsed = new Date() - start;
    const realCommand = args[args.length - 1];
    logDetail(` ${ANSIInvert("npm " + realCommand)} finished in ${elapsed} ms`);
};

const npx = async (...args) => {
    await executeProcess("npx", ...args);
};

async function npmInstall(name, offline = false) {
    let args = ["--no-audit"];
    if (offline) {
        args.push("--prefer-offline");
    }
    args.push("ci");
    if (fs.existsSync("package-lock.json")) {
        logDetail(`${name}: Installing dependencies ...`);
        await npm(...args);
    }
}

async function runCommand(commandName, emojis, callback) {
    logDetail(`${emojis} ...`);
    await callback();
    logSuccess(commandName);
}

module.exports = { npm, npx, npmInstall, runCommand };
