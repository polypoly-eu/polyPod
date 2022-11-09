import endpoints from "./endpoints.js";
import fs from "fs";

const configPath = "../../../assets/config";

const endpointsWithFallback = Object.fromEntries(
    Object.entries(endpoints).map(([key, endpoint]) => [
        key,
        {
            url: endpoint.url,
            auth: endpoint.auth,
            allowInsecure: endpoint.allowInsecure || false,
        },
    ])
);

function dirExists(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
}

if (!dirExists(configPath)) fs.mkdirSync(configPath);

fs.writeFileSync(
    configPath + "/endpoints.json",
    JSON.stringify(endpointsWithFallback)
);
