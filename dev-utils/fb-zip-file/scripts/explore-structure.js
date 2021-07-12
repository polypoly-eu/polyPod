#!/usr/bin/env node

// Explore the structure of existing JSON files representing the structure of the filesystem in (possibly edited) FB zip files

import glob from "glob";
import { readFileSync } from "fs";

// Files are included in a local .data folder
const localFolder = ".data";

glob(`${localFolder}/*.json`, (error, files) => {
    if (error) throw Error("Some problem reading files in data folder");
    let allKeys = {};
    let localKeys = [];
    files.forEach((f) => {
        let theseKeys = {};
        let thisData = JSON.parse(readFileSync(f));
        for (let key in thisData) {
            console.log( "File ", f, " key ", key );
            allKeys[key] = true;
            theseKeys[key] = true;
        }
        localKeys.push(Object.keys(theseKeys));
    });
    let commonKeys = localKeys[0].filter((key) => localKeys[1].includes(key));
    for (let i = 2; i < localKeys.length; i++) {
        commonKeys = commonKeys.filter((key) => localKeys[i].includes(key));
    }
    console.log("Common keys →\n", commonKeys);
    console.log("All keys →\n", allKeys);
});
