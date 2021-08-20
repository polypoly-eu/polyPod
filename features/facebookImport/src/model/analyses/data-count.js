import { readJSONDataArray } from "./../analysis-util.js";

class DataEntitiesCountAnalysis {
    constructor(fileName, dataKey) {
        this._fileName = fileName;
        this._dataKey = dataKey;
    }

    get id() {
        return this.constructor.name;
    }

    get dataEntitiesCount() {
        return this._dataEntitiesCount;
    }

    async parse({ zipFile }) {
        this._dataEntitiesCount = 0;
        this.active = false;
        if (!zipFile) return;

        const extractedData = await readJSONDataArray(
            this._fileName,
            this._dataKey,
            zipFile
        );
        if (!(extractedData.status === "ok")) {
            return;
        }

        this._dataEntitiesCount = extractedData.data.length;
        this.active = this._dataEntitiesCount > 0;
    }
}

export default DataEntitiesCountAnalysis;
