import React from "react";
import { useHistory } from "react-router-dom";

import "./details.css";

const ExploreDetails = () => {
    const history = useHistory();
    const { activeAnalysis } = history.location.state;
    activeAnalysis.setDetailsMode();
    return (
        <div className="details-view">
            <h1>{activeAnalysis.title}</h1>
            {activeAnalysis.render()}
        </div>
    );
};

export default ExploreDetails;
