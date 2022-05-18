import React from "react";

import i18n from "../../i18n.js";
import { SingleDataStory } from "./singleDataStory.jsx";
import analysisKeys from "../../model/analyses/analysisKeys.js";
import {
    ActivitiesOverTimeStorySummary,
    ActivitiesOverTimeStoryDetails,
} from "../../components/activitiesOverTimeStory/activitiesOverTimeStory.jsx";

class ActivitiesOverTimeMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.activitiesOverTime);
    }

    get title() {
        return i18n.t("activitiesOverTimeStory:title");
    }

    _renderSummary() {
        return (
            <ActivitiesOverTimeStorySummary
                activitiesOverTime={this.analysisData}
            />
        );
    }

    _renderDetails() {
        return (
            <ActivitiesOverTimeStoryDetails
                activitiesOverTime={this.analysisData}
            />
        );
    }
}

export default ActivitiesOverTimeMinistory;
