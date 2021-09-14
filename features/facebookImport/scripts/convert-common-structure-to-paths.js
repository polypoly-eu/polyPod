#!/usr/bin/env node

const fs = require("fs");

const commonStructureStr = fs.readFileSync("commonStructure.json");
const structure = JSON.parse(commonStructureStr);

let paths = [];

for (let dir of Object.keys(structure)) {
    for (let file of structure[dir]) {
        paths.push(`/${dir}/${file}`);
    }
}
console.log(paths.map((p) => p.replace("/no-data.txt", "")));
