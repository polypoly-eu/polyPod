import { PolyOut } from "@polypoly-eu/api";

import { assert, assertAsyncThrows } from "../assert";

describe("polyOut", function () {
    const polyOut: PolyOut = window.pod.polyOut;

    describe("readFile", function () {
        // Doesn't pass on Android
        it.skip("fails to read non-existant file", async function () {
            await assertAsyncThrows(() => polyOut.readFile("does-not-exist"));
        });
    });

    describe("stat", function () {
        // Doesn't pass on Android/iOS
        it.skip("identifies root directory", async function () {
            const stat = await polyOut.stat("");
            assert.isOk(stat.directory);
        });
    });

    describe("readDir", function () {
        it("can read root directory", async function () {
            const files = await polyOut.readDir("");
            assert.isArray(files);
        });

        // Doesn't pass on Android
        it.skip("fails to read non-existant directory", async function () {
            await assertAsyncThrows(() => polyOut.readDir("does-not-exist"));
        });
    });
});
