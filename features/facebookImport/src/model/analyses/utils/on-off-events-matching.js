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

export function onOffFacebookAccountNamesMatching(
    onFacebookName,
    offFacebookName
) {
    return (
        noSpaceLowercaseMatch(onFacebookName, offFacebookName) ||
        noSpaceLowercaseMatch(
            removeDomainExtension(onFacebookName),
            removeDomainExtension(offFacebookName)
        )
    );
}

function displayNameFullMatcher(relatedFacebookAccount, offFacebookCompany) {
    return onOffFacebookAccountNamesMatching(
        relatedFacebookAccount.displayName,
        offFacebookCompany.name
    );
}

function urlIdFullMatcher(relatedFacebookAccount, offFacebookCompany) {
    return onOffFacebookAccountNamesMatching(
        relatedFacebookAccount.urlId,
        offFacebookCompany.name
    );
}

const ON_OFF_COMPANIES_MATCHERS = [displayNameFullMatcher, urlIdFullMatcher];

/**
 * Match related Facebook accounts with off-Facebook companies.
 * For each related Facebook account look for all off-Facebook companies that match it.
 *
 * Matching is done using this data:
 * - from a related account we use the displayName and urlId.
 * - from the off-Facebook company we use the name.
 *
 * We compare those values directly and also by removing a url domain, if present.
 */
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
