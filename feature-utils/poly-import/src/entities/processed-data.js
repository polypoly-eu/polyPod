export default class ProcessedData {
    constructor() {
        let self = this;
        this._importersData = null;
        this._unknownFolderNames = null;

        this._missingKnownFileNames = null;
        this._missingCommonFileNames = null;

        this._bubblesData = null;
        this._reportMetadata = null;

        const attributes = [
            "bublesData",
            "importersData",
            "unknownFolderNames",
            "missingKnownFileNames",
            "missingCommonFileNames",
            "reportMetadata",
        ];
        //setters & getters
        attributes.forEach(function (attribute) {
            Object.defineProperty(self, attribute, {
                get: function () {
                    return self["_" + attribute];
                },
                set: function (value) {
                    self["_" + attribute] = value;
                },
            });
        });
    }
}
