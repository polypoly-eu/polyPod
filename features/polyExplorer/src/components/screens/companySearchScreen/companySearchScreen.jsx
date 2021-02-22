import React from "react";
import "../screen.css";

const CompanySearchScreen = ({ companies }) => {
    return (
        <div className="explorer-container">
            <div className="screen-content">
                <h1>Here be searching!</h1>
                <h2>For now there&apos;s just data</h2>
                <pre>{JSON.stringify(companies, null, 2)}</pre>
            </div>
        </div>
    );
};

export default CompanySearchScreen;
