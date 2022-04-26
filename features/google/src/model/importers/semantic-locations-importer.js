import ActivitySegment from "../entities/activity-segment";
import PlaceVisit from "../entities/place-visit";

const semanticLocationsRegex =
    /\/Location History\/Semantic Location History\/.*\.json$/;

async function readFullPathJSONFile(entry) {
    const rawContent = await entry.getContent();
    const fileContent = new TextDecoder("utf-8").decode(rawContent);

    return JSON.parse(fileContent);
}

/**
 * We saw until now two different formats for timestamps:
 * - milliseconds: 1394270917000
 * - standard date: "2022-01-19T14:28:16.967Z"
 */
function extractTimestampFromDuration(duration) {
    if ("startTimestamp" in duration) return new Date(duration.startTimestamp);
    if ("startTimestampMs" in duration)
        return new Date(duration.startTimestampMs);
    throw new Error("Unknown start date");
}

function createPlaceVisit(jsonData) {
    return new PlaceVisit({
        timestamp: new Date(extractTimestampFromDuration(jsonData.duration)),
        locationName: jsonData.location.name,
    });
}

function createActivitySegment(jsonData) {
    return new ActivitySegment({
        timestamp: new Date(extractTimestampFromDuration(jsonData.duration)),
        activityType: jsonData.activityType,
    });
}

/**
 * Extract from the given file entry the list of timeline objects grouped by their type.
 * We saw two types of timeline objects:
 *  - Place Visits
 *  - Activity Segments
 *
 * @param {*} fileEntry
 * @returns
 */
async function parseTimelineObjectsByTypeFromEntry(fileEntry) {
    const jsonContent = await readFullPathJSONFile(fileEntry);
    const timelineObjects = jsonContent.timelineObjects;
    return timelineObjects.reduce(
        ({ placeVisits, activitySegments }, timelineObject) => {
            if ("placeVisit" in timelineObject)
                placeVisits.push(createPlaceVisit(timelineObject.placeVisit));
            if ("activitySegment" in timelineObject)
                activitySegments.push(
                    createActivitySegment(timelineObject.activitySegment)
                );

            return { placeVisits, activitySegments };
        },
        { placeVisits: [], activitySegments: [] }
    );
}

export default class SemanticLocationsImporter {
    async import({ zipFile, facebookAccount }) {
        const entries = await zipFile.getEntries();
        const semanticLocationEntries = entries.filter(({ path }) =>
            semanticLocationsRegex.test(path)
        );

        const timelineObjectsByType = await Promise.all(
            semanticLocationEntries.map((entry) =>
                parseTimelineObjectsByTypeFromEntry(entry)
            )
        );

        let allPlaceVisits = [];
        let allActivitySegments = [];
        timelineObjectsByType.forEach(({ placeVisits, activitySegments }) => {
            allPlaceVisits.push(...placeVisits);
            allActivitySegments.push(...activitySegments);
        });
        facebookAccount.placeVisits = allPlaceVisits;
        facebookAccount.activitySegments = allActivitySegments;
    }
}
