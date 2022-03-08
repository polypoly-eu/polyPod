#!/usr/bin/env node

import { readFileSync } from "fs";
import { noDataFileName } from "../src/globals/index.js";

const commonStructureStr = readFileSync("commonStructure.json");
const structure = JSON.parse(commonStructureStr);

let paths = [];

for (let dir of Object.keys(structure)) {
    for (let file of structure[dir]) {
        paths.push(`/${dir}/${file}`);
    }
}
console.log(paths.map((p) => p.replace(`/${noDataFileName}`, "")));
