import { PolyImportContext, Screen } from "@polypoly-eu/poly-look";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Story from "../ministories/story.jsx";

const DetailsView = () => {
    const history = useHistory();
    const { account } = useContext(PolyImportContext);
    console.log(history);
    const story = new history.location.state.ActiveStoryClass({
        account,
        mode: Story.MODES.DETAILS,
    });
    return (
        <Screen className="details" layout="poly-standard-layout">
            {story && story.render()}
        </Screen>
    );
};

export default DetailsView;
