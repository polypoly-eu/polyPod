import React from "react";
import DiscoverCard from "../discoverCard/discoverCard.jsx";

import "./storiesPreview.css";

const StoriesPreview = ({ storiesMetadata }) => {
    return (
        <div className="stories-preview poly-theme-light">
            <div className="preview-scrollable">
                {Object.values(storiesMetadata).map((story, index) => (
                    <DiscoverCard key={index} story={story} />
                ))}
            </div>
        </div>
    );
};

export default StoriesPreview;
