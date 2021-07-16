import React from "react";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import i18n from "../../i18n";

import "./discoverCard.css";

const i18nHeader = "clusterStories";
const DiscoverCard = ({ story }) => {
    return (
        <LinkButton route={story.route} className="discover-card">
            <img
                src={story.image.src}
                alt={i18n.t(`${i18nHeader}:${story.image.alt}`)}
            />
            <h2 className="card-title">
                {i18n.t(`${i18nHeader}:${story.title}`)}
            </h2>
            <p className="card-summarize">
                {i18n.t(`${i18nHeader}:${story.previewText}`)}
            </p>
        </LinkButton>
    );
};

export default DiscoverCard;
