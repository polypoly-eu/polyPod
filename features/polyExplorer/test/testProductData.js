import { readFileSync } from "fs";

const testCompanyJSON = JSON.parse(readFileSync("src/data/products.json"));
export default testCompanyJSON.filter((c) => c.ppid === "WhatsApp")[0];
