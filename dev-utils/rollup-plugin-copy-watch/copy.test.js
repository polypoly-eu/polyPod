const copy = require("./index");
const fs = require("fs");

beforeAll(() => {
    copy({
        targets: [{ src: "index.js", dest: "/tmp" }],
    });
});

test("copy has worked", () => {
    expect(fs.existsSync("/tmp/index.js")).toBeTruthy;
});
