"use strict";

import React from "react";
import * as ReactDOM from "react-dom";
import PolyExplorer from "./components/polyExplorer/polyExplorer.jsx";
import DummyPopUp from "./components/dummyPopUp/dummyPopUp.jsx";

const runPolyExplorer = () => {
    const handlePopUpClose = () => {
        ReactDOM.render(<PolyExplorer />, document.getElementById("feature"));
    };

    function registerPodNavActions() {
        // This is just a crutch until we have real callbacks for the info and
        // search action.
        function alert(text) {
            ReactDOM.render(
                <DummyPopUp text={text} onPopUpClose={handlePopUpClose} />,
                document.getElementById("feature")
            );
        }

        if (!window.podNav) return;

        window.podNav.actions = {
            info: () => alert("Here be info!"),
            search: () => alert("Here be search!"),
        };
        window.podNav.registerAction("info");
        window.podNav.registerAction("search");
    }

    registerPodNavActions();
    ReactDOM.render(<PolyExplorer />, document.getElementById("feature"));
};

runPolyExplorer();
