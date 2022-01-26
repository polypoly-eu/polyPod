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
