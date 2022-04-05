import React from "react";
import { useHistory } from "react-router-dom";
import { StoryCardList, StoryCard } from "@polypoly-eu/poly-look";
import i18n from "../../i18n";
import { I18nSection } from "@polypoly-eu/silly-i18n";

import "./storiesPreview.css";

const i18nP = new I18nSection(i18n, "clusterStoriesPreview");

const StoriesPreview = ({ storiesMetadata }) => {
    const history = useHistory();

    return (
        <StoryCardList className="poly-theme-light">
            {Object.values(storiesMetadata).map((story, index) => (
                <StoryCard
                    key={index}
                    navigation={{
                        history,
                        route: story.route,
                        buttonText: i18n.t(
                            "clusterStoriesPreview:story.button.discover"
                        ),
                    }}
                >
                    <img
                        className="title-img"
                        src={story.img.src}
                        alt={i18nP.t(story.img.alt)}
                    />
                    <h1 className="centered">{i18nP.t(story.title)}</h1>
                    <p>{i18nP.t(story.previewText)}</p>
                </StoryCard>
            ))}
        </StoryCardList>
    );
};

export default StoriesPreview;
