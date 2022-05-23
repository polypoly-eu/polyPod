import AccessLogImporter from "./importers/access-log-importer";
import ActivitiesHtmlImporter from "./importers/activities-importer-html";
import ActivitiesJsonImporter from "./importers/activities-importer-json";
import SemanticLocationsImporter from "./importers/semantic-locations-importer";

export const dataImporters = [
    ActivitiesHtmlImporter,
    SemanticLocationsImporter,
    ActivitiesJsonImporter,
    AccessLogImporter,
];
