import i18n from "../../i18n.js";

export function countOccurences(array) {
    const occurences = {};
    for (let element of array)
        occurences[element] ? occurences[element]++ : (occurences[element] = 1);
    return occurences;
}

export function createJurisdictionLinks(companyList, entityJurisdictionByPpid) {
    const jurisdictions = companyList.map((e) => ({
        id: e.ppid,
        jurisdictions: countOccurences(
            e.dataRecipients.map((r) => entityJurisdictionByPpid(r))
        ),
    }));

    const jurisdictionLinks = [];

    jurisdictions.forEach((company) =>
        Object.entries(company.jurisdictions).forEach(
            ([jurisdiction, value]) => {
                jurisdictionLinks.push({
                    source: company.id,
                    target: jurisdiction,
                    value,
                });
            }
        )
    );

    return jurisdictionLinks;
}

export function createFacebookandOtherTreeMapData(products, facebookGroup) {
    const treeMap = {
        name: "map",
    };

    const facebookShare = { name: facebookGroup, children: [] };
    const othersShare = { name: "other", children: [] };

    for (let product of products)
        product.productOwner.indexOf(facebookGroup) !== -1
            ? facebookShare.children.push({
                  name: product.ppid,
                  value: latestActiveUsersValue(product),
              })
            : othersShare.children.push({
                  name: product.ppid,
                  value: latestActiveUsersValue(product),
              });

    treeMap.children = [facebookShare, othersShare];
    return treeMap;
}

export function latestActiveUsersValue(product) {
    let latest = product.activeUsers.values[0];
    for (let entry of product.activeUsers.values) {
        if (new Date(entry.end_date) > new Date(latest.end_date))
            latest = entry;
    }
    return Math.floor(latest.user_count / 1000000);
}

export function createDataTypesSharedCombined(entities) {
    const categoriesCount = {};

    entities.forEach((entity) => {
        for (let category of entity.dataTypesShared) {
            let currentCategory = categoriesCount[category.translation];
            if (currentCategory)
                currentCategory.value = currentCategory.value + category.count;
            else {
                categoriesCount[category.translation] = {
                    category: category.translation,
                    value: category.count,
                };
            }
        }
    });
    return Object.values(categoriesCount).sort((a, b) => b.value - a.value);
}

function normalizeDataLengthByCompany(entities) {
    const largestEntityLength = entities.reduce(
        (currentMax, b) => Math.max(currentMax, b.dataTypesShared.length),
        0
    );
    return entities.map((entity) => {
        return {
            title: `${entity.simpleName}: ${entity.dataTypesShared.length}`,
            bubbles: createBubbleArray(largestEntityLength, entity),
        };
    });
}

function createBubbleArray(largestEntityLength, entity) {
    const colouredBublesArray = entity.dataTypesShared.map(() => {
        return { value: 1, color: true };
    });
    const notColoredBubblesArray = Array(
        largestEntityLength - entity.dataTypesShared.length
    ).fill({ value: 1, color: false });
    return [...colouredBublesArray, ...notColoredBubblesArray];
}

export function createDataTypesTabs(
    entities,
    i18nHeader,
    dataTypesSharedCombined
) {
    const totalShares = dataTypesSharedCombined.reduce(
        (total, b) => (total += b.value),
        0
    );

    return [
        {
            id: "by-companies",
            label: i18n.t(`${i18nHeader}:data.types.tab.companies`),
            data: normalizeDataLengthByCompany(entities),
            route: "company-data-types-info",
        },
        {
            id: "by-shares",
            label: i18n.t(`${i18nHeader}:data.types.tab.shares`),
            data: entities.map((entity) => ({
                title: `${entity.simpleName}: 
                    ${entity.dataTypesShared.reduce(
                        (acc, bubble) => acc + bubble.count,
                        0
                    )}`,
                bubbles: entity.dataTypesShared.map((bubble) => ({
                    value: bubble.count,
                    color: true,
                })),
            })),
            route: "shares-data-types-info",
        },
        {
            id: "by-types",
            label: i18n.t(`${i18nHeader}:data.types.tab.types`),
            data: [
                {
                    title: i18n.t(`${i18nHeader}:data.types.legend.types`, {
                        amount_of_data_types: dataTypesSharedCombined.length,
                        amount_of_shares: totalShares,
                    }),
                    label: dataTypesSharedCombined.map(
                        (dataType) => dataType.category
                    ),
                    bubbles: dataTypesSharedCombined,
                    width: 400,
                    height: 400,
                },
            ],
            route: "types-data-types-info",
        },
    ];
}
