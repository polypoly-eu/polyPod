import React from "react";
import RouteButton from "../../components/routeButton.jsx";

const Import = () => {
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
