import React from "react";
import "../screen.css";

export default ({ companies }) => {
    return (
        <div className="explorer-container">
            <div className="screen-content">
                <h1>Here be filtering!</h1>
                <h2>For now there's just data</h2>
                <pre>
                    {JSON.stringify(companies, null, 2)}
                </pre>
            </div>
        </div>
    );
};
