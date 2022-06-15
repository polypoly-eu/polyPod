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
        const content = await entry.getContent();
        const text = await new TextDecoder("utf-8").decode(content);
        const data = this._dataFromCsv(text);
        return data;
    }
}

export default class AccessLogImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await relevantZipEntries(zipFile);
        const accessLogEntries = entries.filter(({ path }) =>
            matchRegex(path, this)
        );

        const parser = new AccessLogParser();

        googleAccount.accessLog = (
            await Promise.all(
                accessLogEntries.map((entry) => parser.parse(entry))
            )
        ).flat();
    }
}
