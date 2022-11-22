import React, { useEffect } from "react";
import "./infographic.css";
import * as d3 from "d3";

import bubblesChartInfoScreen from "../../static/images/infographic/bubblesChartInfoScreen.svg";
import activitiesBarChart from "../../static/images/infographic/activitiesBarChart.svg";
import offFacebookBarChart from "../../static/images/infographic/offFacebookBarChart.svg";
import messagesBarChart from "../../static/images/infographic/messagesBarChart.svg";
import onOffFacebookChart from "../../static/images/infographic/onOffFacebookChart.svg";

/* This component is used for displaying graphics (svg) with text that needs to be translated into different languages
   To introduce a new infographic you need to:
        1. Change the names of the text-elements in figma to either start with text (eg. text1), highlighted, bold etc. (see stylings in infographics.css)
        2. Export svg from figma with "include 'id' attribute" checked and "outline text" unchecked
        3. Register the svg in src/infographics/infographics.js
        4. Add the desired strings to locales/<language>/infographic.json
        5. Add the infographic component to the screen with type={"the name of the file (eg. dataTypes)"} and texts={(key used in figma graphic):i18n.t("infographic:<i18nkey>")}
*/

const Infographic = ({ type, texts }) => {
    const infographic = {
        bubblesChartInfoScreen,
        activitiesBarChart,
        offFacebookBarChart,
        messagesBarChart,
        onOffFacebookChart,
    }[type];

    function scaleFactor(viewBox, svg) {
        return Math.min(svg.width / viewBox.width, svg.height / viewBox.height);
    }

    useEffect(() => {
        const container = d3.select(`#${type}`);
        Object.keys(texts).forEach((key) => {
            const textField = container.select(`#${key}`);
            const box = textField.node().getBBox();
            textField.remove();
            const svg = container.node().parentNode;
            const viewbox = svg.viewBox.baseVal;
            const foreignObject = container
                .append("foreignObject")
                .attr("x", box.x)
                .attr("width", box.width);
            const div = foreignObject.append("xhtml:div").html(texts[key]);
            if (key.startsWith("highlighted"))
                div.attr("class", "text-field highlighted");
            else if (key.startsWith("bold"))
                div.attr("class", "text-field bold");
            else if (key.startsWith("bigbold"))
                div.attr("class", "text-field big-bold");
            else if (key.startsWith("grey"))
                div.attr("class", "text-field grey");
            else div.attr("class", "text-field");
            const divHeight =
                div.node().getBoundingClientRect().height /
                scaleFactor(viewbox, svg.getBoundingClientRect());
            foreignObject
                .attr("y", box.y + box.height / 2 - divHeight / 2)
                .attr("height", divHeight);
        });
    });

    return (
        <div
            className="infographic"
            dangerouslySetInnerHTML={{ __html: infographic }}
        ></div>
    );
};

export default Infographic;
