import AccessLogEntry from "../entities/access-log-entry";
import { readCsvFromText } from "./utils/importer-utils";

const accessLogRegex = /\/Access Log Activity\/.*\.csv$/;

class AccessLogParser {
    constructor() {}

    _csvToJson(csvText) {
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
        const jsonData = this._csvToJson(text);
        return jsonData;
    }
}

export default class AccessLogImporter {
    async import({ zipFile, facebookAccount: googleAccount }) {
        const entries = await zipFile.getEntries();
        const accessLog = entries.filter(({ path }) =>
            accessLogRegex.test(path)
        );

        const parser = new AccessLogParser();
        googleAccount.accessLog = await parser.parse(accessLog[0]);
    }
}
