import { readFileSync } from "fs";

const testCompanyJSON = JSON.parse(readFileSync("src/data/companies.json"));
export default testCompanyJSON.filter((c) => c.ppid === "Apple (US)")[0];
