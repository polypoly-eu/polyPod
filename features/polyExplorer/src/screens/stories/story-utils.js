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

export function createDataTypesSharedCombined(entities, listOfDataCategories) {
    const dataTypesSharedCombined = listOfDataCategories
        .map((category) => {
            let total = 0;
            entities.map((entity) => {
                entity.dataTypesShared.forEach((typeCategory) => {
                    if (typeCategory["dpv:Category"] === category)
                        total += typeCategory.count;
                });
            });
            return total !== 0
                ? {
                      "dpv:Category": category,
                      total,
                  }
                : null;
        })
        .filter((e) => e)
        .sort((a, b) => b.total - a.total);

    return dataTypesSharedCombined;
}

function normalizeDataLengthByCompany(entities) {
    const largestEntityLength = entities.sort(
        (a, b) => b.dataTypesShared.length - a.dataTypesShared.length
    )[0].dataTypesShared.length;
    return entities.map((entity) => {
        return {
            title: `${entity.ppid}: ${entity.dataTypesShared.length}`,
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
    listOfDataCategories,
    dataTypesSharedCombined
) {
    let totalShares = 0;
    entities.forEach((entity) => {
        entity.dataTypesShared.forEach((i) => (totalShares += i.count));
    });

    return [
        {
            id: "by-companies",
            label: i18n.t(`${i18nHeader}:data.types.tab.companies`),
            data: normalizeDataLengthByCompany(entities),
            route: "/company-data-types-info",
        },
        {
            id: "by-shares",
            label: i18n.t(`${i18nHeader}:data.types.tab.shares`),
            data: entities.map((entity) => {
                return {
                    title: `${entity.ppid}: 
                    ${entity.dataTypesShared.reduce(
                        (acc, bubble) => acc + bubble.count,
                        0
                    )}`,
                    bubbles: entity.dataTypesShared.map((bubble) => {
                        return { value: bubble.count, color: true };
                    }),
                };
            }),
            route: "/shares-data-types-info",
        },
        {
            id: "by-types",
            label: i18n.t(`${i18nHeader}:data.types.tab.types`),
            data: [
                {
                    title: i18n.t(`${i18nHeader}:data.types.legend.types`, {
                        amount_of_data_types: listOfDataCategories.length,
                        amount_of_shares: totalShares,
                    }),
                    label: listOfDataCategories.map((category) =>
                        category.replace("dpv:", "")
                    ),
                    bubbles: dataTypesSharedCombined.map((bubble) => {
                        return {
                            value: bubble.total,
                            type: bubble["dpv:Category"],
                        };
                    }),
                    width: 400,
                    height: 400,
                },
            ],
            route: "/types-data-types-info",
        },
    ];
}
