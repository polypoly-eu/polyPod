const shell = require("shelljs");
const path = require("path");
const symlinkMode = "120000";
async function getSymlinks(dirPath) {
    let symlinks = [];
    const relPath = dirPath.replaceAll("../", "/").replaceAll("/", "\\");
    const cwd = process.cwd();
    const changeDir = path.join(cwd, relPath);
    shell.cd(changeDir);
    const fileList = await shellExec("git ls-files -s");

    if (fileList.stdout.includes(symlinkMode)) {
        const output = fileList.stdout.split("\n");
        symlinks.push(...extractSymlinks(output, changeDir));
    }
    shell.cd(cwd);
    return symlinks;
}
const shellExec = (cmd) =>
    new Promise((resolve) => {
        shell.exec(cmd, (code, stdout, stderr) => {
            resolve({ code, stdout, stderr });
        });
    });

function extractSymlinks(output, cwd) {
    const extractedSymlinks = [];
    for (let file of output) {
        let [mode, id, _, relDir] = file.split(/\s/);
        if (mode === symlinkMode) {
            relDir = relDir.replaceAll("/", "\\");
            const fileName = relDir.split("\\").pop();
            const fileDir = path.join(cwd, relDir.replace(fileName, ""));
            const linkText = shell
                .cat(path.join(fileDir, fileName))
                .toString()
                .replaceAll("/", "\\");
            extractedSymlinks.push({
                mode: mode,
                id: id,
                link: linkText,
                fileName: fileName,
                target: fileDir,
            });
        }
    }
    return extractedSymlinks;
}

async function makeNewSymlink(symlink) {
    shell.cd(symlink.target);
    const output = await shellExec(
        "mklink /d " + symlink.fileName + " " + symlink.link
    );
    console.log(output);
}

function deleteExistingSymlinks(symlinks) {
    for (let symlink of symlinks) {
        shell.rm(path.join(symlink.target, symlink.fileName));
    }
}

async function addSymlinks(symlinks) {
    for (let symlink of symlinks) {
        await makeNewSymlink(symlink);
    }
}

async function start() {
    if (process.platform === "win32") {
        const symlinks = await getSymlinks("../features/lexicon");
        console.log("Removing existing symlinks");
        deleteExistingSymlinks(symlinks);
        console.log("Adding new symLinks");
        await addSymlinks(symlinks);
        console.log("All set up!");
    } else console.log("You are not running windows, you should be A-Okay! ");
}
start();
