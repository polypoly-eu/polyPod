import React from "react";
import { useHistory } from "react-router-dom";

import "./details.css";

const ExploreDetails = () => {
    const history = useHistory();
    const { activeAnalysis } = history.location.state;
    return (
        <div className="details-view">
            <h1 className="ministory-title">{activeAnalysis.title}</h1>
            {activeAnalysis.renderDetails()}
        </div>
    );
};

export default ExploreDetails;
