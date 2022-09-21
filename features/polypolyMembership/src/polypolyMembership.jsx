import React from "react";
import { createRoot } from "react-dom/client";
import Onboarding from "./views/onboarding.jsx";

import "./styles.css";

const PolypolyMembership = () => {
    return (
        <>
            <div className="poly-nav-bar-separator-overlay" />
            <div className="feature-container membership">
                <Onboarding />
            </div>
        </>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<PolypolyMembership />);
