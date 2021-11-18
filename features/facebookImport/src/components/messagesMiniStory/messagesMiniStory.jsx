import React from "react";
import i18n from "../../i18n.js";
import InfoButton from "../buttons/infoButton/infoButton.jsx";

import BarChart from "../dataViz/barChart.jsx";
import "./messagesMiniStory.css";

const MessagesMiniStory = ({ totalUserNames, messagesThreads }) => {
    return (
        <>
            <p>
                {i18n.t("messagesMiniStory:number.chats", {
                    number_chats: totalUserNames,
                })}
            </p>
            <p> {i18n.t("messagesMiniStory:chart.title")}</p>
            <BarChart
                data={messagesThreads}
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
            <div className="messages-gradient"></div>
            <div className="messages-info-button">
                <InfoButton route="/report/details/messages-info" />
            </div>
            <p className="source">
                {i18n.t("common:source.your.facebook.data")}
            </p>
        </>
    );
};

export default MessagesMiniStory;
