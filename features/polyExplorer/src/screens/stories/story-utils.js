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
