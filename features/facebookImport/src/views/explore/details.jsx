import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

const ExploreDetails = () => {
    const { activeDetails } = useContext(ImporterContext);
    return <div>{activeDetails}</div>;
};

export default ExploreDetails;
