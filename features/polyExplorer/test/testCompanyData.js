import { readFileSync } from "fs";

const companiesJSON = JSON.parse(readFileSync("src/data/companies.json"));
export default companiesJSON.filter((c) => c.ppid === "Apple (US)")[0];
export { companiesJSON };
