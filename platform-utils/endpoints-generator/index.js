import endpoints from "./endpoints.js";
import fs from "fs";

const fallbackURL = "http://localhost:8000";
const fallbackAuth = null;

const endpointsWithFallback = Object.fromEntries(
    Object.entries(endpoints).map(([key, endpoint]) => [
        key,
        {
            url: endpoint.url || fallbackURL,
            auth: endpoint.auth || fallbackAuth,
        },
    ])
);

fs.mkdirSync("../../assets/config");

fs.writeFileSync(
    "../../assets/config/endpoints.json",
    JSON.stringify(endpointsWithFallback)
);
