export function readCsvFromText(csvText) {
    const rows = csvText.split("\n");
    const headers = rows.shift().replaceAll('"', "").split(",");

    const headersEnum = {};
    headers.forEach((key, index) => (headersEnum[key] = index));
    return {
        rows,
        headersEnum,
    };
}
