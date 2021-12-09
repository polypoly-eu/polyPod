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
        <ClusterSections as="div" className="messenger-summary">
            <h1 className="title-messenger-story">
                {i18n.t(`${i18nHeader}:summary.title`)}
            </h1>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:summary.section`)}
            ></SectionTitle>
            <StoryParagraph as="div" className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </StoryParagraph>
            <ol className="things-to-be-aware">
                {bullets.map(({ strongText, lightText }, i) => (
                    <li className={`bullet-summary`} key={i}>
                        <span className={`strong-text`}>
                            {i18n.t(`${i18nHeader}:${strongText}`)}
                        </span>
                        <span className={`light-text`}>
                            {i18n.t(`${i18nHeader}:${lightText}`)}
                        </span>
                    </li>
                ))}
            </ol>
        </ClusterSections>
    );
};

export default Summary;
