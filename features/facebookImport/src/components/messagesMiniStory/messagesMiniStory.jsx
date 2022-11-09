import React from "react";

import i18n from "!silly-i18n";

const l12nt = (o) => i18n.l12n.t(o);

import BarChart from "../dataViz/barChart.jsx";
import InfoButton from "../buttons/infoButton/infoButton.jsx";

import "./messagesMiniStory.css";

const SummaryText = ({
    messagesCount,
    messagesThreadsData,
    totalUsernamesCount,
}) => (
    <p>
        {i18n.t("explore:messages.summary", {
            messages: messagesCount,
            threads: messagesThreadsData.length,
            people: totalUsernamesCount,
        })}
    </p>
);

export const MessagesMiniStorySummary = ({
    messagesCount,
    messagesThreadsData,
    totalUsernamesCount,
}) => {
    return (
        <div className="render-summary">
            <p className="highlighted-number">{l12nt(messagesCount)}</p>
            <SummaryText
                messagesCount={messagesCount}
                messagesThreadsData={messagesThreadsData}
                totalUsernamesCount={totalUsernamesCount}
            />
        </div>
    );
};

export const MessagesMiniStoryDetails = ({
    messagesCount,
    messagesThreadsData,
    totalUsernamesCount,
}) => {
    return (
        <>
            <SummaryText
                messagesCount={messagesCount}
                messagesThreadsData={messagesThreadsData}
                totalUsernamesCount={totalUsernamesCount}
            />
            <p> {i18n.t("messagesMiniStory:chart.title")}</p>
            <BarChart
                data={messagesThreadsData}
                screenPadding={48}
                groupMessage={true}
                footerContent={({ extraData }) => (
                    <>
                        <div className="bar-extra-info">
                            <p>{i18n.t("messagesMiniStory:first.chat")}</p>
                            {extraData.firstChatDate
                                ? l12nt(extraData.firstChatDate)
                                : "unknown"}
                        </div>
                        <div className="bar-extra-info">
                            <p>
                                {i18n.t("messagesMiniStory:last.interaction")}
                            </p>
                            {extraData.lastChatDate
                                ? l12nt(extraData.lastChatDate)
                                : "unknown"}
                        </div>
                    </>
                )}
            />
            <div className="messages-gradient"></div>
            <div className="messages-info-container">
                <InfoButton infoScreen="messages-info" />
            </div>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </>
    );
};
