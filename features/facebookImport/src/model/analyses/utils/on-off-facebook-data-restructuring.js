const secondsPerDay = 86400;

export function daysBetween(timestampA, timestampB) {
    return Math.abs(Math.round((timestampA - timestampB) / secondsPerDay));
}

export function generate90DaysObject() {
    return Array.from({ length: 91 }, (_, i) => i).map((e) => {
        return { on: 0, off: 0 };
    });
}

export function selectInterestingCompanies(allCompanies) {
    selectedCompanies = [];
    if (allCompanies.length > 0) {
        //Most events in total
        allCompanies.sort(
            (a, b) =>
                a.onFacebookTimestamps.length +
                a.offFacebookTimestamps.length -
                b.onFacebookTimestamps.length -
                b.offFacebookTimestamps.length
        );
        selectedCompanies.push(allCompanies.pop());

        //More on than off
        allCompanies.sort(
            (a, b) =>
                a.onFacebookTimestamps.length -
                a.offFacebookTimestamps.length -
                (b.onFacebookTimestamps.length - b.offFacebookTimestamps.length)
        );
        selectedCompanies.push(allCompanies.pop());

        //More off than on
        allCompanies.sort(
            (a, b) =>
                a.offFacebookTimestamps.length -
                a.onFacebookTimestamps.length -
                (b.offFacebookTimestamps.length - b.onFacebookTimestamps.length)
        );
        selectedCompanies.push(allCompanies.pop());
    }
    return selectedCompanies;
}

function getIntoChartStructure(displayData) {
    const restructuredDisplayData = {};
    Object.keys(displayData).forEach((key) => {
        restructuredDisplayData[key] = displayData[key].map((e, i) => {
            return { key: i, lower: e.on, upper: e.off };
        });
    });
    return restructuredDisplayData;
}

export function buildDisplayData(selectedCompanies) {
    const displayData = {};
    selectedCompanies.forEach((company) => {
        displayData[company.name] = generate90DaysObject();
        for (let offTimestamp of company.offFacebookTimestamps)
            displayData[company.name][
                daysBetween(
                    facebookAccount.offFacebookEventsLatestTimestamp,
                    offTimestamp
                )
            ].off++;

        for (let onTimestamp of company.onFacebookTimestamps)
            displayData[company.name][
                daysBetween(
                    facebookAccount.offFacebookEventsLatestTimestamp,
                    onTimestamp
                )
            ].on++;
    });

    return getIntoChartStructure(displayData);
}
