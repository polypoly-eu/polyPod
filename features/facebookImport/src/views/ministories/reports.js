import DataImportingStatusReport from "./dataImportingStatus.jsx";
import MissingCommonJSONFilesReport from "./missingCommonJsonFiles.jsx";
import MissingKnownJSONFilesReport from "./missingKnownJsonFiles.jsx";
import OffFacebookEventsTypesReport from "./offFacebookEventsTypes.jsx";
import ReportMetadataReport from "./reportMetadata.jsx";
import UnknownTopLevelFoldersReport from "./unknownTopLevelFolders.jsx";

export const reports = [
    DataImportingStatusReport,
    MissingKnownJSONFilesReport,
    MissingCommonJSONFilesReport,
    OffFacebookEventsTypesReport,
    ReportMetadataReport,
    UnknownTopLevelFoldersReport,
];

export const NUMBER_OF_REPORTS = reports.length;
