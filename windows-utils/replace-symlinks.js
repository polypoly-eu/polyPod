const shell = require("shelljs");

async function getSymlinks(dirPath) {
    let symlinks = [];
    const path = dirPath
        .replaceAll("/", "\\")
        .replace("..", "")
        .split("\\")
        .slice(2)
        .join("\\");
    const cwd = process.cwd();
    const changeDir = cwd + path;
    console.log("All good");
    const fileList = await shellExec("git ls-files -s");
    console.log({ fileList });

    if (fileList.stdout.includes("120000")) {
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
    for (let i = 0; i < output.length; i++) {
        const parsedElement = output[i].split(" ");
        if (parsedElement[0] === "120000") {
            const relDir = parsedElement[2]
                .replace("0\t", "")
                .replaceAll("/", "\\");
            const fileName = relDir.split("\\").pop();
            const fileDir = cwd + "\\" + relDir.replace(fileName, "");
            const linkText = shell
                .head(fileDir + "\\" + fileName)
                .toString()
                .replaceAll("/", "\\");
            extractedSymlinks.push({
                mode: parsedElement[0],
                id: parsedElement[1],
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

async function deleteSymlink(symlink) {
    shell.cd(symlink.target);
    const delOutput = await shellExec("del " + symlink.fileName);
    console.log(symlink.target);
    console.log(delOutput.stderr);
}

async function deleteExistingSymlinks(symlinks) {
    for (let i = 0; i < symlinks.length; i++) {
        const symlink = symlinks[i];
        await deleteSymlink(symlink);
    }
}

async function addSymlinks(symlinks) {
    for (let i = 0; i < symlinks.length; i++) {
        const symlink = symlinks[i];
        await makeNewSymlink(symlink);
    }
}

async function start() {
    const symlinks = await getSymlinks("..");
    console.log("Removing existing symlinks");
    await deleteExistingSymlinks(symlinks);
    console.log("Adding new symLinks");
    await addSymlinks(symlinks);
}
start();
