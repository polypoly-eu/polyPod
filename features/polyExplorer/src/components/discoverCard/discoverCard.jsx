import React from "react";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import i18n from "../../i18n";

import "./discoverCard.css";
import { I18nSection } from "@polypoly-eu/silly-i18n";

const i18nP = new I18nSection(i18n, "clusterStoriesPreview");
const DiscoverCard = ({ story }) => {
    return (
        <LinkButton route={story.route} className="preview">
            <img src={story.img.src} alt={i18nP.t(story.img.alt)} />
            <h3>{i18nP.t(story.title)}</h3>
            <p>{i18nP.t(story.previewText)}</p>
        </LinkButton>
    );
};

export default DiscoverCard;
