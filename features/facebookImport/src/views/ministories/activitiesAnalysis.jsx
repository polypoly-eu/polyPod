import React from "react";

import i18n from "../../i18n.js";
import Story from "./story.jsx";
import {
    ActivitiesMiniStorySummary,
    ActivitiesMiniStoryDetails,
} from "../../components/activitiesMiniStory/activitiesMiniStory.jsx";

class ActivitiesAnalysis extends Story {
    constructor(props) {
        super(props);
    }
    state = {};

    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("activitiesMiniStory:title");
    }

    renderSummary() {
        return <ActivitiesMiniStorySummary totalEvents={this._totalEvents} />;
    }

    renderDetails() {
        return <ActivitiesMiniStoryDetails totalEvents={this._totalEvents} />;
    }
}

export default ActivitiesAnalysis;
