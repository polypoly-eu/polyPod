import { PolyImportContext, Screen } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Story from "../ministories/story.jsx";

const DetailsView = () => {
    const location = useLocation();
    const { account } = useContext(PolyImportContext);
    const story = new location.state.ActiveStoryClass({
        account,
        mode: Story.MODES.DETAILS,
    });
    return (
        <Screen className="details" layout="poly-standard-layout">
            <h1>{story.title}</h1>
            {story && story.render()}
        </Screen>
    );
};

export default DetailsView;
