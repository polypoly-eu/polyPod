const buildMain = require(".");

let lastExitCode;

beforeAll(() => {
    process.chdir("..");
});

function mockConsole() {
    const streamMap = {
        log: "stdout",
        error: "stderr",
    };
    const output = {};
    const originals = {};
    for (let [name, stream] of Object.entries(streamMap)) {
        output[stream] = "";
        originals[name] = console[name];
        console[name] = (...args) => {
            output[stream] += args.join(" ") + "\n";
        };
    }
    return {
        output,
        restore: () => {
            for (let [name, fn] of Object.entries(originals))
                console[name] = fn;
        },
    };
}

async function build(...parameters) {
    process.argv = ["", "", ...parameters];
    process.exit = (exitCode) => {
        lastExitCode = exitCode;
    };
    const consoleMock = mockConsole();
    await buildMain();
    consoleMock.restore();
    return {
        exitCode: lastExitCode,
        stdout: consoleMock.output.stdout,
        stderr: consoleMock.output.stderr,
    };
}

test("Valid command", async () => {
    const { exitCode, stderr } = await build("list");
    expect(exitCode).toEqual(0);
    expect(stderr).toEqual("");
});

test("Invalid command", async () => {
    const { exitCode, stderr } = await build("foo");
    expect(exitCode).not.toEqual(0);
    expect(stderr).not.toEqual("");
});

// The following tests would be more robust when using stub data, but for the
// sake of progress they are currently written against the actual packages.

const parsePackageList = (stdout) =>
    stdout
        .split("\n")
        .map((line) => {
            const match = line.match(/^\s*(.*) \(/);
            return match ? match[1] : null;
        })
        .filter((name) => !!name);

async function listPackages({ start }) {
    const parameters = ["list"];
    if (start) {
        parameters.push("--start");
        parameters.push(start);
    }
    const { stdout } = await build(...parameters);
    return parsePackageList(stdout);
}

test("Leaf package as start", async () => {
    const leaf = "feature-bundle";
    const packages = await listPackages({ start: leaf });
    expect(packages).toEqual([leaf]);
});

test("Start package with only direct dependants", async () => {
    const start = "poly-explorer-feature";
    const packages = await listPackages({ start });
    expect(packages.sort()).toEqual([start, "feature-bundle"].sort());
});

test("Start package with transitive dependants", async () => {
    const start = "@polypoly-eu/podjs";
    const packages = await listPackages({ start });
    expect(packages).toContain("feature-bundle");
});
