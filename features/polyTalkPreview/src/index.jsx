import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const PreviewApp = () => {
    return (
        <div>
            <text>"Who is your daddy?"</text>
        </div>
    );
};

ReactDOM.render(<PreviewApp />, document.getElementById("feature"));
