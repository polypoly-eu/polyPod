import AccessLogEntry from "../entities/access-log-entry";
<<<<<<< HEAD
=======
import { readCsvFromText } from "./utils/importer-utils";
>>>>>>> main

const accessLogRegex = /\/Access Log Activity\/.*\.csv$/;

class AccessLogParser {
    constructor() {}

<<<<<<< HEAD
    _csvToJson(csvText) {
        const rows = csvText.split("\n");
        const headers = rows.shift().replaceAll('"', "").split(",");

        const keysEnum = {};
        headers.forEach((key, index) => (keysEnum[key] = index));

        const data = rows.map((row) => {
            const rowData = row.split(",");
            const productName = rowData[keysEnum["Product Name"]];
            const date = rowData[keysEnum["Activity Timestamp"]];
=======
    _dataFromCsv(csvText) {
        const { rows, headersEnum } = readCsvFromText(csvText);
        const data = rows.map((row) => {
            const rowData = row.split(",");
            const productName = rowData[headersEnum["Product Name"]];
            const date = rowData[headersEnum["Activity Timestamp"]];
>>>>>>> main
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
<<<<<<< HEAD
        const jsonData = this._csvToJson(text);
        return jsonData;
=======
        const data = this._dataFromCsv(text);
        return data;
>>>>>>> main
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
