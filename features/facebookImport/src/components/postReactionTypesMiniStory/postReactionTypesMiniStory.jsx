import React, { useState } from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

import InfoButton from "../buttons/infoButton/infoButton.jsx";

import i18n from "../../i18n";

import likeIcon from "../../static/images/reactions-ministory/like.svg";
import loveIcon from "../../static/images/reactions-ministory/love.svg";
import hahaIcon from "../../static/images/reactions-ministory/haha.svg";
import careIcon from "../../static/images/reactions-ministory/care.svg";
import wowIcon from "../../static/images/reactions-ministory/wow.svg";
import sadIcon from "../../static/images/reactions-ministory/sad.svg";
import angerIcon from "../../static/images/reactions-ministory/anger.svg";
import ChartButtons from "../chartButtons/chartButtons.jsx";

import "./postReactionTypesMiniStory.css";

const reactionEmoji = {
    LIKE: likeIcon,
    LOVE: loveIcon,
    HAHA: hahaIcon,
    CARE: careIcon,
    WOW: wowIcon,
    SAD: sadIcon,
    ANGER: angerIcon,
};

export function mapEmojiToReaction(reactions) {
    return reactions.map((reaction) => {
        return {
            title: reaction.type,
            value: reaction.count,
            icon: reactionEmoji[reaction.type],
        };
    });
}

const PostReactionTypesMiniStory = ({ reactionData }) => {
    const [selectedReaction, setSelectedReaction] = useState("TOTAL");

    const handleIconSelected = (_, d) => setSelectedReaction(d.data.title);
    const iconFilter = {
        filterElement: "feColorMatrix",
        type: "saturate",
        in: "SourceGraphic",
        values: 0,
        activationCondition: (d) =>
            selectedReaction != d.data.title && selectedReaction != "TOTAL",
    };

    const totalAmountOfReactions = reactionData.reduce(
        (prev, curr) => (prev.count || prev) + curr.count,
        0
    );

    const extendedReactionData = [
        ...reactionData,
        { type: "TOTAL", count: totalAmountOfReactions },
    ];

    return (
        <>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("reactionsMiniStory:text", {
                        total_number_reactions: totalAmountOfReactions,
                    }),
                }}
            ></p>

            <p
                dangerouslySetInnerHTML={{
                    __html: `${i18n.t(
                        `reactionsMiniStory:${selectedReaction}`
                    )}: <strong>${
                        extendedReactionData.find(
                            (e) => e.type == selectedReaction
                        ).count
                    }</strong>`,
                }}
            ></p>

            <PolyChart
                type="bubble-cluster"
                data={mapEmojiToReaction(reactionData)}
                onBubbleClick={handleIconSelected}
                showValues={false}
                filter={iconFilter}
            />
            <ChartButtons
                buttonsContent={extendedReactionData.map((r) => {
                    return {
                        id: r.type,
                        translation: i18n.t(`reactionsMiniStory:${r.type}`),
                    };
                })}
                activeButton={selectedReaction}
                onButtonsClick={(buttonContent) =>
                    setSelectedReaction(buttonContent)
                }
            />
            <div className="reaction-types">
                <InfoButton route="/report/reaction-types-info" />
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </div>
        </>
    );
};

export default PostReactionTypesMiniStory;
