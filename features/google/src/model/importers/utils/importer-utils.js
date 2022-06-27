import i18n from "!silly-i18n";

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

export function convertFileSizeUnit(byteLength) {
    let power = 0;
    let tempSize = byteLength;
    while (tempSize != 0) {
        tempSize = Math.floor(byteLength / Math.pow(1024, power));
        power++;
    }
    power = power - 2;
    const unit = (power) => {
        switch (power) {
            case 0:
                return i18n.t("common:format.bytes");
            case 1:
                return i18n.t("common:format.KB");
            case 2:
                return i18n.t("common:format.MB");
            default:
                return i18n.t("common:format.GB");
        }
    };

    return `${Math.round(byteLength / Math.pow(1024, power))} ${unit(power)}`;
}
