import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import ActivitySegment from "../entities/activity-segment";
import PlaceVisit from "../entities/place-visit";
import { matchRegex } from "./utils/lang-constants";

async function readFullPathJSONFile(entry) {
    const rawContent = await entry.getContent();
    const fileContent = new TextDecoder("utf-8").decode(rawContent);

    return JSON.parse(fileContent);
}

/**
 * If the duration object has a startTimestamp property, return a new Date object initialized with the
 * value of that property. Otherwise, if the duration object has a startTimestampMs property, return a
 * new Date object initialized with the value of that property. Otherwise, throw an error.
 *
 * We saw until now two different formats for timestamps:
 * - milliseconds: 1394270917000
 * - standard date: "2022-01-19T14:28:16.967Z"
 * @param duration - The duration object from the API response.
 * @returns A function that takes a duration object and returns a date object.
 */
function extractStartTimestampFromDuration(duration) {
    if ("startTimestamp" in duration) return new Date(duration.startTimestamp);
    if ("startTimestampMs" in duration)
        return new Date(duration.startTimestampMs);
    throw new Error(
        "No start timestamp found in keys: " + Object.keys(duration).toString()
    );
}

function extractEndTimestampFromDuration(duration) {
    if ("endTimestamp" in duration) return new Date(duration.endTimestamp);
    if ("endTimestampMs" in duration) return new Date(duration.endTimestampMs);
    throw new Error(
        "No start timestamp found in keys: " + Object.keys(duration).toString()
    );
}

function createPlaceVisit(jsonData) {
    return new PlaceVisit({
        timestamp: new Date(
            extractStartTimestampFromDuration(jsonData.duration)
        ),
        endTimestamp: new Date(
            extractEndTimestampFromDuration(jsonData.duration)
        ),
        locationName: jsonData.location.name,
    });
}

function createActivitySegment(jsonData) {
    return new ActivitySegment({
        timestamp: new Date(
            extractStartTimestampFromDuration(jsonData.duration)
        ),
        activityType: jsonData.activityType,
    });
}

/**
 * Extract from the given file entry the list of timeline objects grouped by their type.
 * It reads the JSON file and returns an object with two types of timeline objects:
 *  - Place Visits
 *  - Activity Segments
 *
 * @param fileEntry - The file entry of the JSON file to be parsed.
 * @returns {{placeVisits:Array.<Object>, activitySegments:Array.<Object>}} - An object with two properties: placeVisits and activitySegments.
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
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const semanticLocationEntries = entries.filter(({ path }) =>
            matchRegex(path, this.constructor.name)
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
        googleAccount.placeVisits = allPlaceVisits;
        googleAccount.activitySegments = allActivitySegments;
    }
}
