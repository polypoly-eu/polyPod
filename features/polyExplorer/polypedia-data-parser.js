const polyPediaData = require("./polypedia-data/data/3_integrated/polyExplorer/companies.json");
const fs = require("fs");

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
