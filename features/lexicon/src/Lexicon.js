import levenshtein from "js-levenshtein";
import i18n from "!silly-i18n";

export default class Lexicon {
    constructor(data) {
        this._data = data[i18n.language];
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
            results =
                searchString.length > 3
                    ? [
                          ...results.concat(
                              this.groupEntries(group).filter(
                                  (entry) =>
                                      levenshtein(
                                          entry.toLowerCase(),
                                          searchString.toLowerCase()
                                      ) <= acceptedDistance ||
                                      entry
                                          .toLowerCase()
                                          .includes(searchString.toLowerCase())
                              )
                          ),
                      ]
                    : [
                          ...results.concat(
                              this.groupEntries(group).filter((entry) =>
                                  entry
                                      .toLowerCase()
                                      .includes(searchString.toLowerCase())
                              )
                          ),
                      ];
        }
        return results;
    }
}
