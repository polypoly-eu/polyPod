import shell from "shelljs";
const desiredRevision = "8bffb960";

if (!shell.which("git")) {
    shell.echo("Sorry, this script requires git");
    shell.exit(1);
}

shell.exec("rm -rf polypedia-data");
shell.exec("git clone git@github.com:polypoly-eu/polypedia-data");
shell.cd("polypedia-data");
shell.exec("git reset --hard " + desiredRevision);
shell.cp(
    "./data/3_integrated/polyExplorer/global.json",
    "../src/data/globals.json"
);
