import React from "react";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import i18n from "../../i18n";

import "./discoverCard.css";

const i18nHeader = "clusterStoriesPreview";
const DiscoverCard = ({ story }) => {
    return (
        <div className="discover-container">
            <img
                src={story.img.src}
                alt={i18n.t(`${i18nHeader}:${story.img.alt}`)}
            />
            <h3>{i18n.t(`${i18nHeader}:${story.title}`)}</h3>
            <p>{i18n.t(`${i18nHeader}:${story.previewText}`)}</p>
            <LinkButton route={story.route} className="preview discover-button">
                {i18n.t("clusterStoriesPreview:story.button.discover")}
            </LinkButton>
        </div>
    );
};

export default DiscoverCard;
