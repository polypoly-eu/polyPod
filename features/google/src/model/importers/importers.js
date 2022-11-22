import AccessLogImporter from "./access-log-importer";
import ActivitiesHtmlImporter from "./activities-importer-html";
import ActivitiesJsonImporter from "./activities-importer-json";
import SemanticLocationsImporter from "./semantic-locations-importer";

export const importers = [
    ActivitiesHtmlImporter,
    ActivitiesJsonImporter,
    AccessLogImporter,
    SemanticLocationsImporter,
];
