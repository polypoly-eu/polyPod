import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

import Onboarding from "./views/onboarding.jsx";
import Overview from "./views/overview.jsx";

import { MembershipContextProvider } from "./context/membership-context.jsx";

import "./styles.css";

const PolypolyMembership = () => {
    return (
        <Router>
            <MembershipContextProvider>
                <div className="poly-nav-bar-separator-overlay" />
                <div className="feature-container membership">
                    <Routes>
                        <Route path="/" exact element={<Onboarding />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/overview" element={<Overview />} />
                    </Routes>
                </div>
            </MembershipContextProvider>
        </Router>
    );
};

const root = createRoot(document.getElementById("feature"));
root.render(<PolypolyMembership />);
