import { readFileSync } from "fs";

const productsJSON = JSON.parse(readFileSync("src/data/products.json"));
export default productsJSON.filter((c) => c.ppid === "WhatsApp")[0];
export { productsJSON };
