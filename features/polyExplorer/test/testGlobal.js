import { readFileSync } from "fs";

export default JSON.parse(readFileSync("src/data/global.json"));
