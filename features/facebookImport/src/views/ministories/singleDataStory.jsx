import Story from "./story.jsx";

export class SingleDataStory extends Story {
    constructor(account, neededDataKey) {
        super(account);
        this._neededAnalyses = [neededDataKey];
    }

    get analysisData() {
        return this.analyses[this._neededAnalyses[0]];
    }
}
