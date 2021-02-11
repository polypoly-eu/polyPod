"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import PolyExplorer from "./components/polyExplorer/polyExplorer.jsx";

function registerPodNavActions() {
    // This is just a crutch until we have real callbacks for the info and
    // search action.
    function alert(text) {
        window.alert(`You pressed ${text}. This is a pop-up for you!`);
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
