import Story from "./story.jsx";

export class SingleDataStory extends Story {
    constructor(props, neededDataKey) {
        super(props);
        this._neededAnalyses = [neededDataKey];
    }

    get analysisData() {
        return this.analyses[this._neededAnalyses[0]];
    }
}
