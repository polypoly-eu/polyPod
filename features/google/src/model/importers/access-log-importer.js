import AccessLogEntry from "../entities/access-log-entry";

const accessLogRegex = /\/Access Log Activity\/.*\.csv$/;

class AccessLogParser {
    constructor() {}

    _csvToJson(csvText) {
        const rows = csvText.split("\n");
        const headers = rows.shift().replaceAll('"', "").split(",");

        const keysEnum = {};
        headers.forEach((key, index) => (keysEnum[key] = index));

        const data = rows.map((row) => {
            const rowData = row.split(",");
            const productName = rowData[keysEnum["Product Name"]];
            const date = rowData[keysEnum["Activity Timestamp"]];
            return new AccessLogEntry({
                timestamp: new Date(date),
                accessLog: productName,
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
