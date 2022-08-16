import { relevantZipEntries } from "@polypoly-eu/poly-analysis";
import AccessLogEntry from "../entities/access-log-entry";
import { readCsvFromText } from "./utils/importer-utils";
import { matchRegex } from "./utils/lang-constants";

class AccessLogParser {
    constructor() {}

    _dataFromCsv(csvText) {
        const { rows, headersEnum } = readCsvFromText(csvText);
        const data = rows.map((row) => {
            const rowData = row.split(",");
            const productName = rowData[headersEnum["Product Name"]];
            const date = rowData[headersEnum["Activity Timestamp"]];
            return new AccessLogEntry({
                timestamp: new Date(date),
                productName,
            });
        });
        return data;
    }

    async parse(entry) {
        console.log(`AccessLogParser: Decoding entry at path: ${entry.path}`);
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const data = this._dataFromCsv(text);
        const pathParts = entry.path.split("/");
        const fileName = pathParts[pathParts.length - 2];
        console.log(`AccessLogParser: Decoded entry at path: ${entry.path}`);

        return {
            csvData: data,
            fileSummary: { size: content.byteLength, fileName },
        };
    }
}

export default class AccessLogImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const accessLogEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );
        const parser = new AccessLogParser();
        const parserOutput = (
            await Promise.all(
                accessLogEntries.map((entry) => parser.parse(entry))
            )
        ).flat();

        googleAccount.accessLog = parserOutput
            .map((output) => output.csvData)
            .flat();

        googleAccount.accessLogSummary = parserOutput.map(
            (output) => output.fileSummary
        );
    }
}
