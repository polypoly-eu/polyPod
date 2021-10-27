import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./details.css";

const ExploreDetails = () => {
    const { activeDetails } = useContext(ImporterContext);
    return (
        <div className="details-view">
            <h1 className="details-view-title">{activeDetails.title}</h1>
            {activeDetails.renderDetails()}
        </div>
    );
};

export default ExploreDetails;
