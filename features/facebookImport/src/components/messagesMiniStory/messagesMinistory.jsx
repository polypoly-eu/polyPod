import React from "react";

import i18n from "../../i18n";

import BarChart from "../dataViz/barChart.jsx";
import InfoButton from "../buttons/infoButton/infoButton.jsx";

import "./messagesMiniStory.css";

export const MessagesMiniStorySummary = ({
    messagesCount,
    messagesThreadsData,
    totalUsernamesCount,
}) => {
    return (
        <div className="render-summary">
            <p className="highlighted-number">
                {messagesCount.toLocaleString("de-DE")}
            </p>
            <p>
                {i18n.t("explore:messages.summary", {
                    messages: messagesCount,
                    threads: messagesThreadsData.length,
                    people: totalUsernamesCount,
                })}
            </p>
        </div>
    );
};

export const MessagesMiniStoryDetails = ({
    totalUsernamesCount,
    messagesThreadsData,
}) => {
    return (
        <>
            <p>
                {i18n.t("messagesMiniStory:number.chats", {
                    number_chats: totalUsernamesCount,
                })}
            </p>
            <p> {i18n.t("messagesMiniStory:chart.title")}</p>
            <BarChart
                data={messagesThreadsData}
                screenPadding={48}
                footerContent={({ extraData }) => (
                    <>
                        <div className="bar-extra-info">
                            <p>{i18n.t("messagesMiniStory:first.chat")}</p>
                            {extraData.firstChatDate
                                ? extraData.firstChatDate.toDateString()
                                : "unknown"}
                        </div>
                        <div className="bar-extra-info">
                            <p>
                                {i18n.t("messagesMiniStory:last.interaction")}
                            </p>
                            {extraData.lastChatDate
                                ? extraData.lastChatDate.toDateString()
                                : "unknown"}
                        </div>
                    </>
                )}
            />
            <div className="messages-info-container">
                <InfoButton route="/report/details/messages-info" />
            </div>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </>
    );
};
