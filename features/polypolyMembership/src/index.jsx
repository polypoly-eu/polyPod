import React from "react";
import { createRoot } from "react-dom/client";
import { Screen, PolyButton } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./styles.css";

const App = () => {
    return (
        <Screen
            className="membership poly-theme-coop"
            layout="poly-standard-layout"
        >
            <h1>{i18n.t("common:welcome", { feature: "This feature" })}</h1>
            <PolyButton label="example" />
            <PolyButton type="outlined" label="example secondary button" />
        </Screen>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<App />);
