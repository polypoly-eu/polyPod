import MissingCommonJSONFilesReport from "./missingCommonJsonFiles";
import MissingKnownJSONFilesReport from "./missingKnownJsonFiles";
import OffFacebookEventsTypesReport from "./offFacebookEventsTypes";
import ReportMetadataReport from "./reportMetadata";
import UnknownTopLevelFoldersReport from "./unknownTopLevelFolders";

export default [
    MissingKnownJSONFilesReport,
    MissingCommonJSONFilesReport,
    OffFacebookEventsTypesReport,
    ReportMetadataReport,
    UnknownTopLevelFoldersReport,
];
