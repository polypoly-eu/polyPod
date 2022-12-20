import ConsolidatedCompany from "../../entities/consolidated-company";

export function normalizeForComparison(string) {
    return typeof string === "string"
        ? string.replace(/\s+/g, "")?.toLowerCase()
        : string;
}

export function removeDomainExtension(stringValue) {
    if (typeof stringValue !== "string") {
        return stringValue;
    }
    const indexOfDot = stringValue.indexOf(".");
    if (indexOfDot > -1) {
        return stringValue.substring(0, indexOfDot);
    }
    return stringValue;
}

export function normalizeWithoutDomain(string) {
    return normalizeForComparison(removeDomainExtension(string));
}

export function onOffFacebookAccountNamesMatching(
    onFacebookName,
    offFacebookName
) {
    return (
        typeof onFacebookName === "string" &&
        typeof offFacebookName === "string" &&
        (normalizeForComparison(onFacebookName) ===
            normalizeForComparison(offFacebookName) ||
            normalizeWithoutDomain(onFacebookName) ===
                normalizeWithoutDomain(offFacebookName))
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

export function matchAccountsByName(
    relatedFacebookAccount,
    offFacebookCompany
) {
    return (
        ON_OFF_COMPANIES_MATCHERS.find((matcher) =>
            matcher(relatedFacebookAccount, offFacebookCompany)
        ) !== undefined
    );
}

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
export function linkRelatedAccountsWithOffFacebookCompanies(
    relatedAccounts,
    offFacebookCompaniesRef
) {
    const matches = [];
    const onFacebookAdvertisers = relatedAccounts.advertisers();
    const offFacebookCompanies = [...offFacebookCompaniesRef];

    onFacebookAdvertisers.forEach((onFacebookAdvertiser) => {
        const matchingOffFacebookCompanies = offFacebookCompanies.filter(
            (offFacebookCompany) =>
                matchAccountsByName(onFacebookAdvertiser, offFacebookCompany)
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

export function offFacebookEventsCount(offFacebookCompanies) {
    return offFacebookCompanies.reduce((total, company) => {
        if (company?.events) {
            return total + company.events.length;
        }
        return total;
    }, 0);
}

export function offFacebookEventsLatestTimestamp(offFacebookCompanies) {
    let latestTimestamp = 0;
    forEachOffFacebookEvent(offFacebookCompanies, (event) => {
        if (event.timestamp > latestTimestamp) {
            latestTimestamp = event.timestamp;
        }
    });
    return latestTimestamp;
}

export function forEachOffFacebookEvent(offFacebookCompanies, callback) {
    for (const offFacebookCompany of offFacebookCompanies) {
        for (const offFacebookEvent of offFacebookCompany?.events || []) {
            callback(offFacebookEvent);
        }
    }
}
