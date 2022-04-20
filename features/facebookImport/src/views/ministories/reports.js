import MissingCommonJSONFilesReport from "./missingCommonJsonFiles.jsx";
import MissingKnownJSONFilesReport from "./missingKnownJsonFiles.jsx";
import OffFacebookEventsTypesReport from "./offFacebookEventsTypes.jsx";
import ReportMetadataReport from "./reportMetadata.jsx";
import UnknownTopLevelFoldersReport from "./unknownTopLevelFolders.jsx";

export default [
    MissingKnownJSONFilesReport,
    MissingCommonJSONFilesReport,
    OffFacebookEventsTypesReport,
    ReportMetadataReport,
    UnknownTopLevelFoldersReport,
];
