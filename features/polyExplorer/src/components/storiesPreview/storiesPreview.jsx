import React from "react";
import DiscoverCard from "../discoverCard/discoverCard.jsx";
import i18n from "../../i18n.js";
import "./storiesPreview.css";

const StoriesPreview = ({ storiesMetadata }) => {
    return (
        <div className="story-preview">
            {Object.values(storiesMetadata).map((story, index) => (
                <div key={index} className="story-container">
                    <DiscoverCard story={story} />
                </div>
            ))}
            <div className="more-comming">
                {i18n.t("clusterStories:story.moreStories")}
            </div>
            <button type="button" className="btn-dark">
                {i18n.t("clusterStories:story.notificationsOn")}
            </button>
        </div>
    );
};

export default StoriesPreview;
