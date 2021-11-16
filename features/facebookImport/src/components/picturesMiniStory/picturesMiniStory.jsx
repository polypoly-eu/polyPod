import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import picturesMinistorySvg from "../../static/images/pictures-ministory/pictures-ministory.svg";
import InfoButton from "../buttons/infoButton/infoButton.jsx";
import i18n from "../../i18n";

import "./picturesMiniStory.css";

const parts = {
    person: "person",
    background: "background",
    lamp: "lamp",
    plant: "plant",
};
//color-grey-50
const inactiveBackgroundColor = "#F7FAFC";

const PicturesMiniStory = () => {
    const [activePart, setActivePart] = useState(parts.person);
    const svgContainerRef = useRef();

    //figma delivers a svg with fixed width and height which need to be removed so that viewBox takes over
    function removeFixedSvgDimensionValues(svg) {
        svg.attr("width", null).attr("height", null);
    }

    function styleHighlightedPart(part) {
        part.attr("fill", "transparent")
            .attr("stroke-width", 2)
            .style("stroke-dasharray", null)
            .attr("stroke-opacity", 1);
    }

    function stylePart(part) {
        part.attr("fill", inactiveBackgroundColor)
            .attr("fill-opacity", 0.5)
            .attr("stroke-width", 2)
            .style("stroke-dasharray", "4, 4")
            .attr("stroke-opacity", 1);
    }

    useEffect(() => {
        const svg = d3.select(svgContainerRef.current).select("svg");
        removeFixedSvgDimensionValues(svg);
        for (let part of Object.values(parts)) {
            const selectedPart = svg.select(`#part-${part}`);
            selectedPart.on("click", () => setActivePart(part));
            part == activePart
                ? styleHighlightedPart(selectedPart)
                : stylePart(selectedPart);
        }
    });

    return (
        <div className="pictures-mini-story">
            <p>{i18n.t("picturesMiniStory:text.1")}</p>
            <p>{i18n.t("picturesMiniStory:text.2")}</p>
            <div
                className="svg-container"
                ref={svgContainerRef}
                dangerouslySetInnerHTML={{ __html: picturesMinistorySvg }}
            />
            <div className="part-heading">
                <div className="icon">
                    <img
                        src={`./images/pictures-ministory/${activePart}.svg`}
                        alt={`${activePart}-icon`}
                    />
                </div>
                <p>{i18n.t(`picturesMiniStory:${activePart}.title`)}</p>
            </div>
            <p>{i18n.t(`picturesMiniStory:${activePart}.text`)}</p>
            <InfoButton route="/report/details/pictures-info" />
        </div>
    );
};

export default PicturesMiniStory;
