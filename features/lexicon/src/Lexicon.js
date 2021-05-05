import levenshtein from "js-levenshtein";

export default class Lexicon {
    constructor(language, data) {
        this._language = language;
        this._data = data[language];
    }

    get groups() {
        return Object.keys(this._data);
    }

    get language() {
        return this._language;
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
