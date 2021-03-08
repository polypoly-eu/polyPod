import fs from "fs";
import { createRequire } from "module";
import { default as descriptions } from "./descriptions.js";
import { default as categories } from "./categories.js";

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

function parseDataRegion(value) {
    if (value instanceof Array)
        return ["GDPR", "EU"].every((part) => value.includes(part))
            ? "EU-GDPR"
            : value[0];
    return value.indexOf("CCPA") !== -1 ? "Five-Eyes" : value;
}

function parseEntity(entityData) {
    const entity = entityData.legal_entities[0];
    const legalName = entity.identifiers.legal_name.value;
    if (!legalName) return null;

    return {
        name: legalName,
        featured:
            entityData.data_recipients &&
            entityData.derived_purpose_info &&
            entityData.derived_category_info
                ? true
                : false,
        jurisdiction: parseDataRegion(
            entity.data_collection.data_regions.value
        ),
        location: {
            city: entity.basic_info.registered_address.value.city,
            countryCode: entity.basic_info.registered_address.value.country,
        },
        annualRevenues: extractAnnualRevenues(entityData),
        dataRecipients: entityData.data_recipients
            ? entityData.data_recipients
            : null,
        dataSharingPurposes: entityData.derived_purpose_info
            ? Object.keys(entityData.derived_purpose_info).map(
                  (i) => entityData.derived_purpose_info[i]
              )
            : null,
        dataTypesShared: entityData.derived_category_info
            ? Object.keys(entityData.derived_category_info).map(
                  (i) => entityData.derived_category_info[i]
              )
            : null,
        description: {
            value:
                Object.keys(descriptions.de).findIndex(
                    (e) => e.toLowerCase() === legalName.toLowerCase()
                ) >= 0
                    ? descriptions.de[
                          Object.keys(descriptions.de)[
                              Object.keys(descriptions.de).findIndex(
                                  (e) =>
                                      e.toLowerCase() ===
                                      legalName.toLowerCase()
                              )
                          ]
                      ]
                    : null,
            source:
                Object.keys(descriptions.de).findIndex(
                    (e) => e.toLowerCase() === legalName.toLowerCase()
                ) >= 0
                    ? "Wikipedia"
                    : null,
            category:
                Object.keys(categories).filter(
                    (e) => e.toLowerCase() === legalName.toLowerCase()
                ).length > 0
                    ? categories[
                          Object.keys(categories).filter(
                              (e) => e.toLowerCase() === legalName.toLowerCase()
                          )[0]
                      ]
                    : null,
        },
    };
}

const entityKey = (entity) => entity.name.toLowerCase();

function enrichWithJurisdictionsShared(entityMap) {
    for (let entity of Object.values(entityMap)) {
        for (let dataRecipient of entity.dataRecipients || []) {
            const recipientKey = entityKey({ name: dataRecipient });
            if (!(recipientKey in entityMap)) continue;

            const recipientJurisdiction = entityMap[recipientKey].jurisdiction;
            entity.jurisdictionsShared = entity.jurisdictionsShared || {};
            entity.jurisdictionsShared.children =
                entity.jurisdictionsShared.children || [];
            if (
                !entity.jurisdictionsShared.children.includes(
                    recipientJurisdiction
                )
            )
                entity.jurisdictionsShared.children.push(recipientJurisdiction);
        }
    }
}

function parsePolyPediaCompanyData() {
    const entityMap = {};
    polyPediaCompanyData.forEach((entityData) => {
        const entity = parseEntity(entityData);
        if (!entity) return;

        const key = entityKey(entity);
        entityMap[key] = { ...entity, ...(entityMap[key] || {}) };
    });

    enrichWithJurisdictionsShared(entityMap);
    return Object.values(entityMap);
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
