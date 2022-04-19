import endpoints from "./endpoints.js";
import fs from "fs";

const fallbackURL = "https://localhost:8000";
const fallbackAuth = "";

const configPath = "../../../../polyPod-config";

const endpointsWithFallback = Object.fromEntries(
    Object.entries(endpoints).map(([key, endpoint]) => [
        key,
        {
            url: endpoint.url || fallbackURL,
            auth: endpoint.auth || fallbackAuth,
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
