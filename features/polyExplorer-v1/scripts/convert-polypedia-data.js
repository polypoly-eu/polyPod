import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { default as patchData } from "./patch-data.js";

const require = createRequire(import.meta.url);

const polyPediaCompanyData = require("../polypedia-data/data/3_integrated/polyExplorer/companies.json");

const polyPediaGlobalData = require("../polypedia-data/data/3_integrated/polyExplorer/global.json");

const dataIssueLog = {
    renamedEntities: [],
    sourceHardCoded: false,
    duplicateKeys: [],
    missingDataRecipients: {},
    unknownJurisdictions: [],
    patchedCompaniesModified: [],
    patchedCompaniesNew: [],
};

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
    const editorialData =
        ((legalEntityData.editorial_content || {}).editorials || [])[0] || {};
    const description = editorialData.body_i18n || {};
    const descriptionEmpty = Object.values(description).every(
        (value) => value === null
    );
    // We currently hard code the source, until we get the data from polyPedia
    // as well.
    const source = "Wikipedia, polyPedia";
    dataIssueLog.sourceHardCoded = true;
    return {
        value: descriptionEmpty ? null : description,
        source: descriptionEmpty ? null : source,
    };
}

function fixPolyPediaEntityData(entityData) {
    const commonNameMap = {
        Schufa: "SCHUFA Holding AG",
    };
    const commonName = entityData.legal_entity?.identifiers?.common_name;
    if (commonName in commonNameMap) {
        const legalName = commonNameMap[commonName];
        entityData.legal_entity.identifiers.legal_name.value = legalName;
        dataIssueLog.renamedEntities[(commonName, legalName)];
    }
}

function parseIndustryCategory(legalEntityData) {
    const id = legalEntityData?.entity_details?.industry_category?.values?.[0];
    return id ? { id } : null;
}

function parseEntity(entityData) {
    fixPolyPediaEntityData(entityData);

    const legalEntityData = entityData.legal_entity;
    const legalName = legalEntityData?.identifiers?.legal_name.value;
    const ppid = legalEntityData?.identifiers?.ppid;
    if (!legalName) return null;

    return {
        ppid: ppid,
        name: legalName,
        featured: !!(
            entityData.data_recipients &&
            entityData.derived_purpose_info &&
            entityData.derived_category_info
        ),
        jurisdiction: null,
        location: {
            city: legalEntityData.basic_info.registered_address.value.city,
            countryCode:
                legalEntityData.basic_info.registered_address.value.country,
        },
        annualRevenues: extractAnnualRevenues(entityData),
        dataRecipients: entityData.data_recipients || null,
        dataSharingPurposes: entityData.derived_purpose_info
            ? Object.entries(entityData.derived_purpose_info).map(
                  ([key, value]) => ({
                      "dpv:Purpose": key,
                      count: value.count,
                  })
              )
            : null,
        dataTypesShared: entityData.derived_category_info
            ? Object.entries(entityData.derived_category_info).map(
                  ([key, value]) => ({
                      "dpv:Category": key,
                      count: value.count,
                  })
              )
            : null,
        description: parseDescription(legalEntityData),
        industryCategory: parseIndustryCategory(legalEntityData),
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

function enrichWithPatchData(entityMap) {
    for (let [name, entity] of Object.entries(patchData)) {
        const key = entityKey(name);
        dataIssueLog[
            key in entityMap
                ? "patchedCompaniesModified"
                : "patchedCompaniesNew"
        ].push(name);
        entityMap[key] = mergeEntities(entityMap[key], entity);
    }
}

function enrichWithTranslations(entity, globalData) {
    // In the future, we should read these from the global data at runtime to
    // keep the data small, but for now we keep this structure to keep the
    // entries from patch-data.js working.

    if (entity.industryCategory) {
        const industryData = globalData.industries[entity.industryCategory.id];
        if (industryData) {
            const namePrefix = "Name_";
            entity.industryCategory.name = Object.fromEntries(
                Object.entries(industryData)
                    .filter(([key]) => key.startsWith(namePrefix))
                    .map(([key, value]) => [
                        key.slice(namePrefix.length).toLowerCase(),
                        value,
                    ])
            );
        }
    }

    for (let purpose of entity.dataSharingPurposes || []) {
        const purposeData = globalData.data_purposes[purpose["dpv:Purpose"]];
        const translations = Object.fromEntries(
            Object.entries(purposeData).filter(([key]) =>
                ["Translation_", "Explanation_"].some((prefix) =>
                    key.startsWith(prefix)
                )
            )
        );
        Object.assign(purpose, translations);
    }

    for (let category of entity.dataTypesShared || []) {
        const categoryData =
            globalData.personal_data_categories[category["dpv:Category"]];
        Object.assign(category, categoryData);
    }
}

function enrichWithGlobalData(entityMap, globalData) {
    for (let entity of Object.values(entityMap)) {
        entity.jurisdiction =
            globalData.countries[entity.location?.countryCode]?.dataRegion;
        if (!entity.jurisdiction) {
            entity.jurisdiction = "Sonstige";
            dataIssueLog.unknownJurisdictions.push(entity.name);
        }
        enrichWithTranslations(entity, globalData);
    }
}

function enrichWithJurisdictionsShared(entityMap) {
    for (let entity of Object.values(entityMap)) {
        for (let dataRecipient of entity.dataRecipients || []) {
            const recipientKey = entityKey(dataRecipient);
            if (!(recipientKey in entityMap)) continue;

            const recipientJurisdiction = entityMap[recipientKey].jurisdiction;
            if (!recipientJurisdiction) continue;
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

const isValidEntity = (entity) =>
    ["name", "location"].every(
        (requiredField) => !isEmpty(entity[requiredField])
    );

function fixCompanyData(entityMap) {
    for (let [key, entity] of Object.entries(entityMap)) {
        if (!isValidEntity(entity)) {
            delete entityMap[key];
            continue;
        }
        const { dataRecipients } = entity;
        if (!dataRecipients) continue;
        entity.dataRecipients = dataRecipients.filter((recipientName) => {
            const recipientKey = entityKey(recipientName);
            const keep =
                entityMap[recipientKey] &&
                entityMap[recipientKey].name &&
                entityMap[recipientKey].industryCategory;
            if (!keep) {
                dataIssueLog.missingDataRecipients[recipientName] =
                    dataIssueLog.missingDataRecipients[recipientName] || [];
                dataIssueLog.missingDataRecipients[recipientName].push(
                    entity.name
                );
            }
            return keep;
        });
    }
}

function parsePolyPediaCompanyData(globalData) {
    const entityMap = {};
    polyPediaCompanyData.forEach((entityData) => {
        const entity = parseEntity(entityData);
        if (!entity) return;

        const key = entityKey(entity.name);
        if (key in entityMap) dataIssueLog.duplicateKeys.push(key);
        entityMap[key] = mergeEntities(entityMap[key], entity);
    });

    enrichWithPatchData(entityMap);
    enrichWithGlobalData(entityMap, globalData);
    enrichWithJurisdictionsShared(entityMap);
    fixCompanyData(entityMap);
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
    globalData.industries = polyPediaGlobalData.industries;
    globalData.data_purposes = polyPediaGlobalData.data_purposes;
    globalData.personal_data_categories =
        polyPediaGlobalData.personal_data_categories;
    globalData.polypoly_parent_categories =
        polyPediaGlobalData.polypoly_parent_categories;
    return globalData;
}

const savePolyExplorerGlobalData = (data) =>
    savePolyExplorerFile("global.json", data);

function writeDataIssueLog() {
    const scriptPath = process.argv[1];
    const logFile = `${path.dirname(scriptPath)}/${path.basename(
        scriptPath
    )}.log`;

    const {
        renamedEntities,
        sourceHardCoded,
        duplicateKeys,
        missingDataRecipients,
        unknownJurisdictions,
        patchedCompaniesModified,
        patchedCompaniesNew,
    } = dataIssueLog;
    const missingDataRecipientNames = Object.keys(missingDataRecipients);
    const listPrefix = "- ";
    const contents = `\
Renamed entities:              ${Object.keys(renamedEntities).length}
Source hard coded:             ${sourceHardCoded ? "Yes" : "No"}
Duplicate keys (merged):       ${duplicateKeys.length}
Missing data recipients:       ${missingDataRecipientNames.length}
Unknown jurisdictions:         ${unknownJurisdictions.length}
Patched existing companies:    ${patchedCompaniesModified.length}
New companies from patch data: ${patchedCompaniesNew.length}

Renamed entities:
${Object.entries(renamedEntities)
    .map((k, v) => listPrefix + k + ": " + v)
    .join("\n")}

Duplicate keys (merged):
${duplicateKeys.map((s) => listPrefix + s).join("\n")}

Missing data recipients:
${Object.entries(missingDataRecipients)
    .map(
        ([k, v]) =>
            listPrefix + "'" + k + "'" + " [mentioned by " + v.join(", ") + "]"
    )
    .join("\n")}

Companies with unknown jurisdictions:
${unknownJurisdictions.map((s) => listPrefix + s).join("\n")}

Patched companies (modified):
${patchedCompaniesModified.map((s) => listPrefix + s).join("\n")}

Patched companies (new):
${patchedCompaniesNew.map((s) => listPrefix + s).join("\n")}
`;
    fs.writeFileSync(logFile, contents);
}

const globalData = parsePolyPediaGlobalData();
const companyData = parsePolyPediaCompanyData(globalData);
savePolyExplorerGlobalData(globalData);
savePolyExplorerCompanyData(companyData);
writeDataIssueLog();
