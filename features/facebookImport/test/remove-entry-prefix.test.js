"use strict";

import { removeEntryPrefix } from "../src/model/importers/utils/importer-util";

function expectNameForEntry(expectedName, entryName) {
    expect(removeEntryPrefix(entryName)).toBe(expectedName);
}

test("Entry with no path", () => {
    expectNameForEntry("", "polypod://de71f571-d90a-45e0-b007-d8f059e0541b/");
});

test("Entry with no path and missisng /", () => {
    expectNameForEntry(
        "polypod://de71f571-d90a-45e0-b007-d8f059e0541b",
        "polypod://de71f571-d90a-45e0-b007-d8f059e0541b"
    );
});

test("Entry with folder", () => {
    expectNameForEntry(
        "folder/",
        "polypod://de71f571-d90a-45e0-b007-d8f059e0541b/folder/"
    );
});

test("Entry with folder and file", () => {
    expectNameForEntry(
        "folder/file.json",
        "polypod://de71f571-d90a-45e0-b007-d8f059e0541b/folder/file.json"
    );
});

test("Entry with multiple folders and file", () => {
    expectNameForEntry(
        "folder-parent/folder-child-a/file-1.json",
        "polypod://de71f571-d90a-45e0-b007-d8f059e0541b/folder-parent/folder-child-a/file-1.json"
    );
});

test("Entry with wrong uuid format", () => {
    expectNameForEntry(
        "polypod://de7171-d90a-45e0-b007-f059e0541b/",
        "polypod://de7171-d90a-45e0-b007-f059e0541b/"
    );
});

test("Entry with wrong format", () => {
    expectNameForEntry(
        "polod:/de7171-b007-f059e0541b/",
        "polod:/de7171-b007-f059e0541b/"
    );
});
