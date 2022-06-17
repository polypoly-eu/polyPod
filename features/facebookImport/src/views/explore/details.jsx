import { PolyImportContext, Screen } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Story from "../../views/ministories/story.jsx";

import "./details.css";

const ExploreDetails = () => {
    const history = useHistory();
    const { account } = useContext(PolyImportContext);

    const { ActiveStoryClass } = history.location.state;
    const activeStory = new ActiveStoryClass({
        account,
        mode: Story.MODES.DETAILS,
    });
    return (
        <Screen className="details" layout="poly-standard-layout">
            <h2>{activeStory.title}</h2>
            {activeStory.render()}
        </Screen>
    );
};

export default ExploreDetails;
