import path from "path";
import shell from "shelljs";

const [, , desiredRevision] = process.argv;
if (!desiredRevision) {
    console.error(`Usage: ${path.basename(process.argv[1])} DESIRED_REVISION`);
    process.exit(1);
}

if (!shell.which("git")) {
    shell.echo("Sorry, this script requires git");
    shell.exit(1);
}

shell.exec("rm -rf polypedia-data");
shell.exec("git clone git@github.com:polypoly-eu/polypedia-data");
shell.cd("polypedia-data");
shell.exec("git reset --hard " + desiredRevision);
