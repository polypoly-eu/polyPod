import React from "react";
import LinkButton from "../buttons/linkButton/linkButton.jsx";

const Preview = ({ story }) => {
    return (
        <LinkButton route={story.route} className="preview">
            <h3>{story.title}</h3>
            <p>{story.previewText}</p>
        </LinkButton>
    );
};

const StoriesPreview = ({ storiesMetadata }) => {
    return (
        <div className="story-preview">
            {Object.values(storiesMetadata).map((story, index) => (
                <Preview key={index} story={story} />
            ))}
        </div>
    );
};

export default StoriesPreview;
