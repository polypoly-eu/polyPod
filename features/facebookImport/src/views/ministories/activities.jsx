import React from "react";

import i18n from "!silly-i18n";
import {
    ActivitiesMiniStorySummary,
    ActivitiesMiniStoryDetails,
} from "../../components/activitiesMiniStory/activitiesMiniStory.jsx";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import { SingleDataStory } from "./singleDataStory.jsx";

class ActivitiesMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.totalEvents);
    }

    get title() {
        return i18n.t("activitiesMiniStory:title");
    }

    _renderSummary() {
        return <ActivitiesMiniStorySummary totalEvents={this.analysisData} />;
    }

    _renderDetails() {
        return <ActivitiesMiniStoryDetails totalEvents={this.analysisData} />;
    }
}

export default ActivitiesMinistory;
