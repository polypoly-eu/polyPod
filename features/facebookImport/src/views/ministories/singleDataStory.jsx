import Story from "./story.jsx";

export class SingleDataStory extends Story {
    constructor(props, neededDataKey) {
        super(props);
        this.neededAnalyses = [neededDataKey];
    }

    get analysisData() {
        return this.analyses[this.neededAnalyses[0]];
    }
}
