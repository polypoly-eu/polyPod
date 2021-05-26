"use strict";

import React from "react";
import * as ReactDOM from "react-dom";
import PolyExplorer from "./polyExplorer.jsx";

import "./styles.css";

import manifestData from "./static/manifest.json";
window.manifestData = manifestData;

ReactDOM.render(<PolyExplorer />, document.getElementById("feature"));
