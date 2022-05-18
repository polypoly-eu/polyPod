export async function jsonDataEntities(zipFile) {
    const entries = await relevantZipEntries(zipFile);
    const relevantJsonEntries = entries.filter(
        (entry) =>
            !entry.path.includes("/files/") && // Remove user files
            entry.path.endsWith(".json")
    );
    return relevantJsonEntries;
}
//repeated in import-utils, used in both importer & analysis package
export async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (entry) =>
            !entry.path.includes(".DS_Store") &&
            !entry.path.includes("__MACOSX")
    );
}

export function groupActivitiesByTime(activityDates) {
    let groupedActivities = { total: 0, values: {} };

    activityDates.forEach((date) => {
        const activityYear = date.getFullYear();
        const activityMonth = date.getMonth();
        if (
            groupedActivities?.values?.[activityYear]?.values?.[activityMonth]
        ) {
            groupedActivities.values[activityYear].values[activityMonth]++;
            groupedActivities.values[activityYear].total++;
        } else {
            if (!groupedActivities.values?.[activityYear]) {
                groupedActivities.values[activityYear] = {
                    total: 1,
                    values: {},
                };
            } else groupedActivities.values[activityYear].total++;
            groupedActivities.values[activityYear].values[activityMonth] = 1;
        }
        groupedActivities.total++;
    });
    return groupedActivities;
}
