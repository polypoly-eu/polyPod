import { Screen } from "@polypoly-eu/poly-look";
import React from "react";
import { useLocation } from "react-router-dom";
import Story from "../../views/ministories/story.jsx";

import "./details.css";

const ExploreDetails = () => {
    const { state } = useLocation();

    console.log(state);

    const { activeStory } = state;
    activeStory.mode = Story.MODES.DETAILS;
    return (
        <Screen className="details-view" layout="poly-standard-layout">
            <h1>{activeStory.title}</h1>
            {activeStory.render()}
        </Screen>
    );
};

export default ExploreDetails;
