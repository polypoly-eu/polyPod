/**
 * Determines relevant JSON file entries in a ZIP archive; where relevant means
 * the file ends with _.json_, and the path to the file does not include a
 * directory called _files_.
 *
 * @param zipFile - The `ZipFile` to check.
 * @returns The list of relevant entries.
 * @todo This seems a bit out of place in poly-analysis, and rather specific to
 * the facebook Feature.
 */
export async function jsonDataEntities(zipFile) {
    const entries = await relevantZipEntries(zipFile);
    const relevantJsonEntries = entries.filter(
        (entry) =>
            !entry.path.includes("/files/") && // Remove user files
            entry.path.endsWith(".json")
    );
    return relevantJsonEntries;
}

/**
 * Determines relevant entries in a ZIP archive, excluding files and directories
 * that can typically be ignored.
 * @param zipFile - The `ZipFile` to check.
 * @returns The list of relevant entries from the archive.
 */
export async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (entry) =>
            !entry.path.includes(".DS_Store") &&
            !entry.path.includes("__MACOSX")
    );
}

/**
 * Collects the amount of data points per year and month.
 *
 * @param activityDates {Date[]} - The list of data points.
 * @returns {{total: number, values: Object}}
 * @todo This seems a bit out of place in poly-analysis, and rather specific to
 * the google Feature.
 */
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
