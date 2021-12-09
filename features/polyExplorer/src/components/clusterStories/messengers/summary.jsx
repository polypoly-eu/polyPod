import React from "react";
import i18n from "../../../i18n";
import { StoryParagraph } from "./storyParagraph";
import { ClusterSections } from "../clusterSections";
import SectionTitle from "../sectionTitle.jsx";
import "./summary.css";

const i18nHeader = "clusterMessengerStory";

const Summary = () => {
    const bullets = [
        {
            strongText: "summary.paragraph.two.strong",
            lightText: "summary.paragraph.two",
        },
        {
            strongText: "summary.paragraph.three.strong",
            lightText: "summary.paragraph.three.strong",
        },
        {
            strongText: "summary.paragraph.four.strong",
            lightText: "summary.paragraph.four",
        },
    ];

    return (
        <ClusterSections
            as="div"
            className="messenger-summary"
        ></ClusterSections>
    );
};

export default Summary;
