import React from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";
import { INITIAL_HISTORY_STATE } from "@polypoly-eu/poly-look";
import Onboarding from "./views/onboarding.jsx";
import Overview from "./views/onboarding.jsx";

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

ReactDOM.render(<PolypolyMembership />, document.getElementById("feature"));
