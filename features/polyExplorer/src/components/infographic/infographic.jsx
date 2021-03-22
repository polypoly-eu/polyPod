import React from "react";
import "./infographic.css";

import i18n from "../../i18n.js";

const Infographic = ({ svgName }) => {
    const path = `./images/infographics/${svgName}_${i18n.t(
        "explorationInfo:graphic.language.suffix"
    )}.svg`;

    return <object data={path} className="infographic" />;
};

export default Infographic;
