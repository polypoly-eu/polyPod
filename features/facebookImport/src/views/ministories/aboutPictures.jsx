import React from "react";
import Story from "./story";
import i18n from "../../../i18n";
import analysisKeys from "../../model/analysisKeys";

import PicturesMiniStory from "../../../components/picturesMiniStory/picturesMiniStory.jsx";

class AboutPicturesMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.picturesCount];
    }
    state = {};

    get title() {
        return i18n.t("picturesMiniStory:title");
    }

    renderSummary() {
        return <PicturesMiniStory />;
    }

    renderDetails() {}
}

export default AboutPicturesMinistory;
