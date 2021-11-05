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
import BelowChartButtons from "../belowChartButtons/belowChartButtons.jsx";

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
    const [selectedReaction, setSelectedReaction] = useState("*");

    const handleIconSelected = (e, d) => setSelectedReaction(d.data.title);
    const iconSaturation = (d) =>
        selectedReaction == d.data.title || selectedReaction == "*"
            ? "saturate(1)"
            : "saturate(0)";

    const totalAmountOfReactions = reactionData.reduce(
        (prev, curr) => (prev.count || prev) + curr.count
    );

    return (
        <>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("reactionsMiniStory:text", {
                        total_number_reactions: totalAmountOfReactions,
                    }),
                }}
            ></p>
            {selectedReaction != "*" ? (
                <p
                    dangerouslySetInnerHTML={{
                        __html: `${i18n.t(
                            `reactionsMiniStory:${selectedReaction}`
                        )}: <strong>${
                            reactionData.find((e) => e.type == selectedReaction)
                                ?.count || totalAmountOfReactions
                        }</strong>`,
                    }}
                ></p>
            ) : null}
            <PolyChart
                type="icon-cluster"
                data={mapEmojiToReaction(reactionData)}
                onIconClick={handleIconSelected}
                filter={iconSaturation}
            />
            <BelowChartButtons
                buttonsContent={reactionData.map((r) => {
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
