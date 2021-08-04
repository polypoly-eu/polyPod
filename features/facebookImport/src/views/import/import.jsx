import React from "react";
import { useHistory } from "react-router-dom";
import RouteButton from "../../components/routeButton.jsx";

const Import = () => {
    const history = useHistory();
    console.log(history);
    return (
        <div className="import-view">
            <h1>File import</h1>
            <button>Step 1: Download your Facebook data archive</button>
            <button>Step 2: Import your Facebook data archive</button>
            <RouteButton route="back">Back</RouteButton>
        </div>
    );
};

export default Import;
