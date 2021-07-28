import React from "react";
import i18n from "../../../i18n";
import { StoryParagraph } from "./storyParagraph";
import "./summary.css";

const i18nHeader = "clusterMessengerStory";

const Summary = () => {
    return (
        <div className="messenger-summary">
            <h1 className="title-summary">{i18n.t(`${i18nHeader}:summary.title`)}</h1>
            <div className="section-summary">
                <div className="line"></div>
                <h3 className="section-title">{i18n.t(`${i18nHeader}:summary.section`)}</h3>
                <div className="line"></div>
            </div>
            <StoryParagraph as="div" className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </StoryParagraph>
            <StoryParagraph as="ul" className="things-to-be-aware">
                <StoryParagraph as="li" className="bullet-summary">
                    <span className="strong-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.two.strong`)}
                    </span>
                    <span className="light-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.two`)}
                    </span>
                </StoryParagraph>
                <StoryParagraph as="li" className="bullet-summary">
                    <span className="strong-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.three.strong`)}
                    </span>
                    <span className="light-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.three`)}
                    </span>
                </StoryParagraph>
                <StoryParagraph as="li" className="bullet-summary">
                    <span className="strong-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.four.strong`)}
                    </span>
                    <span className="light-text">
                        {i18n.t(`${i18nHeader}:summary.paragraph.four`)}
                    </span>
                </StoryParagraph>
            </StoryParagraph>
        </div>
    );
};

export default Summary;
