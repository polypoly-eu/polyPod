import React from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

const App = () => {
    return (
        <div>
            <h1>What's next?</h1>
        </div>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
