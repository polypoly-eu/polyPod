import ConsolidatedCompany from "../../entities/consolidated-company";

export function noSpaceLowercaseMatch(stringOne, stringTwo) {
    return (
        typeof stringOne === "string" &&
        typeof stringTwo === "string" &&
        stringOne.replace(/\s+/g, "")?.toLowerCase() ===
            stringTwo.replace(/\s+/g, "")?.toLowerCase()
    );
}

export function removeDomainExtension(stringValue) {
    if (!(typeof stringValue === "string")) {
        return stringValue;
    }
    const indexOfDot = stringValue.indexOf(".");
    if (indexOfDot > -1) {
        return stringValue.substring(0, indexOfDot);
    }
    return stringValue;
}

export function displayNameFullMatcher(
    relatedFacebookAccount,
    offFacebookCompany
) {
    return (
        noSpaceLowercaseMatch(
            relatedFacebookAccount.displayName,
            offFacebookCompany.name
        ) ||
        noSpaceLowercaseMatch(
            removeDomainExtension(relatedFacebookAccount.displayName),
            removeDomainExtension(offFacebookCompany.name)
        )
    );
}

export function urlIdFullMatcher(relatedFacebookAccount, offFacebookCompany) {
    return (
        noSpaceLowercaseMatch(
            relatedFacebookAccount.urlId,
            offFacebookCompany.name
        ) ||
        noSpaceLowercaseMatch(
            removeDomainExtension(relatedFacebookAccount.urlId),
            removeDomainExtension(offFacebookCompany.name)
        )
    );
}

const ON_OFF_COMPANIES_MATCHERS = [displayNameFullMatcher, urlIdFullMatcher];

export function linkRelatedAccountsWithOffFacebookCompanies(facebookAccount) {
    const matches = [];
    const onFacebookAdvertisers = facebookAccount.relatedAccounts.advertisers();
    const offFacebookCompanies = [...facebookAccount.offFacebookCompanies];

    onFacebookAdvertisers.forEach((onFacebookAdvertiser) => {
        const matchingOffFacebookCompanies = offFacebookCompanies.filter(
            (offFacebookCompany) =>
                ON_OFF_COMPANIES_MATCHERS.find((matcher) =>
                    matcher(onFacebookAdvertiser, offFacebookCompany)
                )
        );
        if (matchingOffFacebookCompanies.length > 0) {
            matches.push(
                new ConsolidatedCompany(
                    onFacebookAdvertiser,
                    matchingOffFacebookCompanies
                )
            );
        }
    });
    return matches;
}
