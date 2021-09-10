import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

const ExploreDetails = () => {
    const { activeDetails } = useContext(ImporterContext);
    return (
        <div>
            <h1>{activeDetails.title}</h1>
            {activeDetails.renderDetails()}
        </div>
    );
};

export default ExploreDetails;
