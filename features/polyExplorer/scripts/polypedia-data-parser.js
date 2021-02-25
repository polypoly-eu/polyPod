import { createRequire } from "module";
import fs from "fs";

const polyPediaData = createRequire(import.meta.url)(
    "../polypedia-data/data/3_integrated/polyExplorer/companies.json"
);

const extractYear = (date) =>
    parseInt(date.slice(date.lastIndexOf(".") + 1), 10);

function extractAnnualRevenues(entry) {
    if (!entry.financial_data) return null;
    const all = entry.financial_data.data.map(({ data }) => data).flat();
    const filtered = all.filter(({ currency }) => currency === "EUR");
    return filtered.map(({ date, amount, currency }) => ({
        date,
        amount,
        currency,
        year: extractYear(date),
    }));
}

function parsePolypediaData() {
    const companyData = [];
    polyPediaData.forEach((entry) => {
        companyData.push({
            name: entry.legal_entities.identifiers.legal_name.value,
            featured: false,
            jurisdiction:
                entry.legal_entities.data_collection.data_regions.value[0] ===
                    "GDPR" &&
                entry.legal_entities.data_collection.data_regions.value[1] ===
                    "EU"
                    ? "EU-GDPR"
                    : entry.legal_entities.data_collection.data_regions
                          .value[0],
            location: {
                city:
                    entry.legal_entities.basic_info.registered_address.value
                        .city,
                countryCode:
                    entry.legal_entities.basic_info.registered_address.value
                        .country,
            },
            annualRevenues: extractAnnualRevenues(entry),
        });
    });
    fs.writeFile(
        "./src/data/companies.json",
        JSON.stringify(companyData, null, 4),
        "utf8",
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
}

parsePolypediaData();
