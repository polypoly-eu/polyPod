import { PolyImportContext } from "@polypoly-eu/poly-look";
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
        <div className="details-view">
            <h1>{activeStory.title}</h1>
            {activeStory.render()}
        </div>
    );
};

export default ExploreDetails;
