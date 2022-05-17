import AccessLogImporter from "./importers/access-log-importer";
import ActivitiesImporter from "./importers/activities-importer";
import SemanticLocationsImporter from "./importers/semantic-locations-importer";

export const dataImporters = [
    ActivitiesImporter,
    SemanticLocationsImporter,
    AccessLogImporter,
];
