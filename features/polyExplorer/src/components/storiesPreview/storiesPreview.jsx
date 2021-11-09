import React from "react";
import DiscoverCard from "../discoverCard/discoverCard.jsx";
import i18n from "../../i18n.js";

import "./storiesPreview.css";

const StoriesPreview = ({ storiesMetadata }) => {
    return (
        <div className="stories-preview">
            <div className="preview-scrollable">
                {Object.values(storiesMetadata).map((story, index) => (
                    <DiscoverCard key={index} story={story} />
                ))}
            </div>
            <div className="preview-btn-area">
                <div className="preview-btn-container">
                    <p>{i18n.t("storiesPreviewScreen:more.stories")}</p>
                    <button className="preview-btn">
                        {i18n.t("storiesPreviewScreen:button.notifications")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoriesPreview;
