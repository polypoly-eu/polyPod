import React from "react";
import {
    AwakeningLocationDetails,
    AwakeningLocationSummary,
} from "../../components/awakeningLocationMinistory/awakeningLocationMinistory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import i18n from "!silly-i18n";
import { SingleDataStory } from "./singleDataStory.jsx";

class AwakeningLocationMinistory extends SingleDataStory {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.awakeningAnalysis];
    }
    get title() {
        return i18n.t("awakeningLocation:title");
    }

    _renderSummary() {
        return <AwakeningLocationSummary dateData={this.analysisData} />;
    }

    _renderDetails() {
        return <AwakeningLocationDetails dateData={this.analysisData} />;
    }
}

export default AwakeningLocationMinistory;
