#!/usr/bin/env node

const fs = require("fs");

const allStructureStr = fs.readFileSync("allStructure.json");
const allStructure = JSON.parse(allStructureStr);

let topLevelFolderNames = new Set();

allStructure.forEach((fileName) => {
    const nameParts = fileName.split("/");
    topLevelFolderNames.add(nameParts[0]);
});

console.log([...topLevelFolderNames]);
