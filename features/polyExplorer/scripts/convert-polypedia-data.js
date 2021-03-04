import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const polyPediaCompanyData = require("../polypedia-data/data/3_integrated/polyExplorer/companies.json");

const polyPediaGlobalData = require("../polypedia-data/data/3_integrated/polyExplorer/global.json");

const extractYear = (date) =>
    parseInt(date.slice(date.lastIndexOf(".") + 1), 10);

function extractAnnualRevenues(entry) {
    if (!entry.financial_data) return null;
    const all = entry.financial_data.map(({ data }) => data).flat();
    const filtered = all.filter(({ currency }) => currency === "EUR");
    return filtered.map(({ date, amount, currency }) => ({
        date,
        amount,
        currency,
        year: extractYear(date),
    }));
}

function parsePolyPediaCompanyData() {
    const companyData = [];
    polyPediaCompanyData.forEach((entry) => {
        companyData.push({
            name: entry.legal_entities[0].identifiers.legal_name.value,
            featured:
                entry.data_recipients &&
                entry.derived_purpose_info &&
                entry.derived_category_info
                    ? true
                    : false,
            jurisdiction:
                entry.legal_entities[0].data_collection.data_regions
                    .value instanceof Array
                    ? entry.legal_entities[0].data_collection.data_regions
                          .value[0] === "GDPR" &&
                      entry.legal_entities[0].data_collection.data_regions
                          .value[1] === "EU"
                        ? "EU-GDPR"
                        : entry.legal_entities[0].data_collection.data_regions
                              .value[0]
                    : entry.legal_entities[0].data_collection.data_regions
                          .value,
            location: {
                city:
                    entry.legal_entities[0].basic_info.registered_address.value
                        .city,
                countryCode:
                    entry.legal_entities[0].basic_info.registered_address.value
                        .country,
            },
            annualRevenues: extractAnnualRevenues(entry),
            dataRecipients: entry.data_recipients
                ? entry.data_recipients
                : null,
            dataSharingPurposes: entry.derived_purpose_info
                ? entry.derived_purpose_info
                : null,
            dataTypesShared: entry.derived_category_info
                ? entry.derived_category_info
                : null,
        });
    });
    return companyData;
}

function savePolyExplorerFile(fileName, data) {
    fs.writeFile(
        `./src/data/${fileName}`,
        JSON.stringify(data, null, 4),
        "utf8",
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
}

const savePolyExplorerCompanyData = (data) =>
    savePolyExplorerFile("companies.json", data);

function parsePolyPediaGlobalData() {
    const globalData = { countries: {} };
    Object.entries(polyPediaGlobalData.countries).forEach(([code, data]) => {
        globalData.countries[code] = Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith("Name_"))
        );
    });
    return globalData;
}

const savePolyExplorerGlobalData = (data) =>
    savePolyExplorerFile("global.json", data);

savePolyExplorerCompanyData(parsePolyPediaCompanyData());
savePolyExplorerGlobalData(parsePolyPediaGlobalData());
