import React from "react";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import i18n from "../../i18n.js";

import "./storiesPreview.css";

const Preview = ({ story }) => {
    return (
        <LinkButton route={story.route} className="preview">
            <img src={story.img} />
            <h3>{story.title}</h3>
            <p>{story.previewText}</p>
        </LinkButton>
    );
};

const StoriesPreview = ({ storiesMetadata }) => {
    return (
        <div className="stories-preview">
            <div className="preview-scrollable">
                {Object.values(storiesMetadata).map((story, index) => (
                    <Preview key={index} story={story} />
                ))}
            </div>
            <div className="preview-btn-area">
                <p>{i18n.t("storiesPreviewScreen:more.stories")}</p>
                <button className="preview-btn">
                    {i18n.t("storiesPreviewScreen:button.notifications")}
                </button>
            </div>
        </div>
    );
};

export default StoriesPreview;
