import React from "react";
import { useHistory } from "react-router-dom";

import "./details.css";

const ExploreDetails = () => {
    const history = useHistory();
    return (
        <div className="details-view">
            <h1 className="ministory-title">{activeDetails.title}</h1>
            {history.location.state.activeAnalysis.renderDetails()}
        </div>
    );
};

export default ExploreDetails;
