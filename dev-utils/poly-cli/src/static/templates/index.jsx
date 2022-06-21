import React from "react";
import { createRoot } from "react-dom/client";
import i18n from "!silly-i18n";

import "./styles.css";

const App = () => {
    return (
        <div>
            <h1>{i18n.t("common:welcome", { feature: "This feature" })}</h1>
        </div>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
