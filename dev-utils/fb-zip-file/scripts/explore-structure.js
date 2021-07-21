#!/usr/bin/env node

// Explore the structure of existing JSON files representing the structure of the filesystem in (possibly edited) FB zip files

import glob from "glob";
import { readFileSync, writeFileSync } from "fs";
import { allDataFileName, dataFileName } from "../src/globals.js";

// Files are included in a local .data folder
const localFolder = ".data";

glob(`${localFolder}/*.json`, (error, files) => {
    if (error)
        throw Error(`Some problem reading files in data folder: ${error}`);
    let allKeys = new Set();
    let localStructure = [];
    files.forEach((f) => {
        let theseKeys = {};
        let thisData = JSON.parse(readFileSync(f));
        extractKeys("", thisData, theseKeys, allKeys);
        localStructure.push(theseKeys);
    });
    let commonKeys = Object.keys(localStructure[0]).filter((key) =>
        Object.keys(localStructure[1]).includes(key)
    );
    for (let i = 2; i < localStructure.length; i++) {
        commonKeys = commonKeys.filter((key) =>
            Object.keys(localStructure[i]).includes(key)
        );
    }
    let commonStructure = {};
    commonKeys.forEach((key) => {
        let commonFiles = localStructure[0][key].filter((s) =>
            localStructure[1][key].includes(s)
        );
        for (let i = 2; i < localStructure.length; i++) {
            commonFiles = commonFiles.filter((s) =>
                localStructure[i][key].includes(s)
            );
        }
        commonStructure[key] = commonFiles;
    });
    writeFileSync(dataFileName, JSON.stringify(commonStructure));
    writeFileSync(allDataFileName, JSON.stringify([...allKeys.keys()]));

});

function extractKeys(prefix, data, theseKeys, allKeys) {
    for (let key in data) {
        if (key != "leaves") {
            if ( prefix !== '' && /^[a-zA-Z0-9]+_[_a-zA-Z0-9\-]{9,12}$/.test( key ) ) {
                key = "uniqueid_hash";
            }
            theseKeys[`${prefix}${key}`] = [];
            allKeys.add(`${prefix}${key}`);
            extractKeys(`${prefix}${key}/`, data[key], theseKeys, allKeys);
        } else {
            data["leaves"].forEach((f) => {
                const sansSlash = prefix.slice(0, -1);
                if (sansSlash in theseKeys) {
                    theseKeys[sansSlash].push(f);
                } else {
                    theseKeys[sansSlash] = [f];
                }
            });
        }
    }
}
