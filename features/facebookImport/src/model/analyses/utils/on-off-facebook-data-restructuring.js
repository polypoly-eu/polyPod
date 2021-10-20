const secondsPerDay = 86400;

export function daysBetween(timestampA, timestampB) {
    return Math.abs(Math.round((timestampA - timestampB) / secondsPerDay));
}

export function generate90DaysObject() {
    return Array.from(Array(91), () => {
        return { on: 0, off: 0 };
    });
}

export function selectMeaningfulCompanies(allCompanies) {
    if (allCompanies.length < 1) return [];
    const inititializingName = "$init$";
    const emptyInitialCompany = {
        name: inititializingName,
        onFacebookTimestamps: [],
        offFacebookTimestamps: [],
    };
    //Company with the:
    let mostEventsTotal = emptyInitialCompany;
    let highestDifferenceOnOff = emptyInitialCompany;
    let highestDifferenceOffOn = emptyInitialCompany;

    const on = (company) => company.onFacebookTimestamps.length;
    const off = (company) => company.offFacebookTimestamps.length;

    function isNameInUse(name) {
        return (
            mostEventsTotal.name == name ||
            highestDifferenceOnOff.name == name ||
            highestDifferenceOffOn.name == name
        );
    }

    for (let company of allCompanies) {
        if (!isNameInUse(company.name)) {
            if (
                on(company) + off(company) >
                on(mostEventsTotal) + off(mostEventsTotal)
            ) {
                mostEventsTotal = company;
                continue;
            }
            if (
                on(company) - off(company) >
                on(highestDifferenceOnOff) - off(highestDifferenceOnOff)
            ) {
                highestDifferenceOnOff = company;
                continue;
            }
            if (
                off(company) - on(company) >
                off(highestDifferenceOffOn) - on(highestDifferenceOffOn)
            ) {
                highestDifferenceOffOn = company;
                continue;
            }
        }
    }

    //Check if none is init, and if so use first unused company with most events in total
    const selectedCompanies = [
        mostEventsTotal,
        highestDifferenceOnOff,
        highestDifferenceOffOn,
    ];
    selectedCompanies.forEach((e, i) => {
        if (e.name == inititializingName) {
            let secondHighest = emptyInitialCompany;
            for (let company of allCompanies) {
                if (!isNameInUse(company.name)) {
                    if (
                        on(company) + off(company) >
                        on(secondHighest) + off(secondHighest)
                    ) {
                        secondHighest = company;
                    }
                }
            }
            selectedCompanies[i] = secondHighest;
        }
    });

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

export function buildDisplayData(
    selectedCompanies,
    offFacebookEventsLatestTimestamp
) {
    const displayData = {};
    selectedCompanies.forEach((company) => {
        displayData[company.name] = generate90DaysObject();
        for (let offTimestamp of company.offFacebookTimestamps)
            displayData[company.name][
                daysBetween(offFacebookEventsLatestTimestamp, offTimestamp)
            ].off++;

        for (let onTimestamp of company.onFacebookTimestamps)
            displayData[company.name][
                daysBetween(offFacebookEventsLatestTimestamp, onTimestamp)
            ].on++;
    });

    return getIntoChartStructure(displayData);
}
