import fs from "fs";
import { createRequire } from "module";
import { default as fallbackDescriptions } from "./descriptions.js";
import { default as categories } from "./categories.js";

const require = createRequire(import.meta.url);

const polyPediaCompanyData = require("../polypedia-data/data/3_integrated/polyExplorer/companies.json");

const polyPediaGlobalData = require("../polypedia-data/data/3_integrated/polyExplorer/global.json");

const extractYear = (date) =>
    parseInt(date.slice(date.lastIndexOf(".") + 1), 10);

const entityKey = (legalName) => legalName.toLowerCase();

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

function parseDescription(legalEntityData) {
    const key = entityKey(legalEntityData.identifiers.legal_name.value);
    const editorialData =
        ((legalEntityData.editorial_content || {}).editorials || [])[0] || {};
    const description = editorialData.body_i18n || {};
    for (let languageCode of Object.keys(fallbackDescriptions))
        if (!description[languageCode]) {
            const fallbackDescription = (Object.entries(
                fallbackDescriptions[languageCode]
            ).find(([companyName]) => entityKey(companyName) === key) || [])[1];
            if (fallbackDescription)
                description[languageCode] = fallbackDescription;
        }
    const descriptionEmpty = Object.values(description).every(
        (value) => value === null
    );
    // We currently hard code "Wikipedia" as source, until we get the data from
    // polyPedia as well.
    const source = "Wikipedia";
    return {
        value: descriptionEmpty ? null : description,
        source: descriptionEmpty ? null : source,
    };
}

function parseCategory(legalName) {
    const categoryStringKey = Object.keys(categories.de).find(
        (e) => entityKey(e) === entityKey(legalName)
    );
    return categories.de[categoryStringKey] || null;
}

function fixEntityData(entityData) {
    if (entityData.legal_entity.identifiers.common_name === "Schufa")
        entityData.legal_entity.identifiers.legal_name.value =
            "SCHUFA Holding AG";
}

function parseEntity(entityData, globalData) {
    fixEntityData(entityData);

    const legalEntityData = entityData.legal_entity;
    const legalName = legalEntityData.identifiers.legal_name.value;
    if (!legalName) return null;

    const countryCode =
        legalEntityData.basic_info.registered_address.value.country;

    return {
        name: legalName,
        featured: !!(
            entityData.data_recipients &&
            entityData.derived_purpose_info &&
            entityData.derived_category_info
        ),
        jurisdiction: (globalData.countries[countryCode] || {}).dataRegion,
        location: {
            city: legalEntityData.basic_info.registered_address.value.city,
            countryCode,
        },
        annualRevenues: extractAnnualRevenues(entityData),
        dataRecipients: entityData.data_recipients || null,
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
        description: parseDescription(legalEntityData),
        category: parseCategory(legalName),
    };
}

const isEmpty = (value) =>
    value === null ||
    typeof value === "undefined" ||
    (typeof value === "object" && Object.values(value).every(isEmpty));

function mergeEntities(oldEntity, newEntity) {
    if (!oldEntity) return newEntity;
    for (let [key, value] of Object.entries(newEntity))
        if (!(key in oldEntity) || isEmpty(oldEntity[key]))
            oldEntity[key] = value;
    return oldEntity;
}

function enrichWithJurisdictionsShared(entityMap) {
    for (let entity of Object.values(entityMap)) {
        for (let dataRecipient of entity.dataRecipients || []) {
            const recipientKey = entityKey(dataRecipient);
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

function parsePolyPediaCompanyData(globalData) {
    const entityMap = {};
    polyPediaCompanyData.forEach((entityData) => {
        const entity = parseEntity(entityData, globalData);
        if (!entity) return;

        const key = entityKey(entity.name);
        entityMap[key] = mergeEntities(entityMap[key], entity);
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

const parseDataRegion = (countryData) =>
    ({
        GDPR: "EU-GDPR",
        "5 Eyes": "Five-Eyes",
    }[countryData.Regulatory_Region] || countryData.Regulatory_Region);

function parsePolyPediaGlobalData() {
    const globalData = { countries: {} };
    Object.entries(polyPediaGlobalData.countries).forEach(([code, data]) => {
        const country = Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith("Name_"))
        );
        country.dataRegion = parseDataRegion(data);
        globalData.countries[code] = country;
    });
    return globalData;
}

const savePolyExplorerGlobalData = (data) =>
    savePolyExplorerFile("global.json", data);

const globalData = parsePolyPediaGlobalData();
const companyData = parsePolyPediaCompanyData(globalData);
savePolyExplorerGlobalData(globalData);
savePolyExplorerCompanyData(companyData);
