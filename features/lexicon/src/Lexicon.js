import levenshtein from "js-levenshtein";

export default class Lexicon {
    constructor(language, data) {
        this._language = language;
        this._data = data[language];
    }

    get groups() {
        return Object.keys(this._data);
    }

    group(aGroup) {
        return this._data[aGroup];
    }

    groupEntries(aGroup) {
        return Object.keys(this._data[aGroup]);
    }

    description(entry) {
        return this.group(entry[0])[entry];
    }

    search(searchString) {
        let results = [];
        const acceptedDistance = 3;
        for (let group of this.groups) {
            results = [
                ...results,
                this.groupEntries(group).filter(
                    (entry) =>
                        levenshtein(entry, searchString) <= acceptedDistance
                ),
            ];
        }
        return results;
    }
}
