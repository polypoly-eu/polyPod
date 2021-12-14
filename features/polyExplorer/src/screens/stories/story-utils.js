export function countOccurences(array) {
    const occurences = {};
    for (let element of array)
        occurences[element] ? occurences[element]++ : (occurences[element] = 1);
    return occurences;
}

export function createDataRegionLinks(companyList, entityDataRegionByPpid) {
    const dataRegions = companyList.map((e) => ({
        id: e.ppid,
        dataRegions: countOccurences(
            e.dataRecipients.map((r) => entityDataRegionByPpid(r))
        ),
    }));

    const dataRegionLinks = [];

    dataRegions.forEach((company) =>
        Object.entries(company.dataRegions).forEach(([region, value]) => {
            dataRegionLinks.push({ source: company.id, target: region, value });
        })
    );

    return dataRegionLinks;
}
