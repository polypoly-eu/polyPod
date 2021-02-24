const shell = require("shelljs");
const desiredRevision = "cd5da73c430aa4c6b4c30be951cf8bbd90f576fe";
const path = "./polypedia_data";

if (!shell.which("git")) {
    shell.echo("Sorry, this script requires git");
    shell.exit(1);
}

shell.cd(path);
shell.exec("git clone https://github.com/polypoly-eu/polypedia-data/");
shell.exec(`git reset --hard ${desiredRevision}`);
shell.cp("./data/3_integrated/polyexplorer/*.json", "../dist/data");
