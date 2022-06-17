export function groupAnalysisByKey(analysisEntries, keyGroup) {
    const groupedAnalysisByKey = {};
    analysisEntries.forEach((entry) => {
        groupedAnalysisByKey[entry[keyGroup]] =
            (groupedAnalysisByKey[entry[keyGroup]] || 0) + 1;
    });
    return groupedAnalysisByKey;
}

export function convertFileSizeUnit(byteLength) {
    let power = 0;
    let temp_size = byteLength;
    while (temp_size != 0) {
        temp_size = Math.floor(byteLength / Math.pow(1024, power));
        power++;
    }
    power = power - 2;
    const unit = (power) => {
        switch (power) {
            case 0:
                return "B";
            case 1:
                return "KB";
            case 2:
                return "MB";
            default:
                return "GB";
        }
    };
    return `${Math.round(byteLength / Math.pow(1024, power))} ${unit(power)}`;
}
