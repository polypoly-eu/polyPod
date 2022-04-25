import React from "react";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";

import PicturesMiniStory from "../../components/picturesMiniStory/picturesMiniStory.jsx";
import { SingleDataStory } from "./singleDataStory.jsx";

class AboutPicturesMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.picturesCount);
    }

    get title() {
        return i18n.t("picturesMiniStory:title");
    }

    renderSummary() {
        return <PicturesMiniStory />;
    }
}

export default AboutPicturesMinistory;
