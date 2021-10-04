import React from "react";

// import i18n from "../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const MessagesScreen = () => {
    const messagesInfoText = [
        <>
            <p>
                This diagram shows the messages Facebook stored from you.
                Grouped by conversations and ranked by the number of messages
                exchanged.
            </p>
            <p>
                This diagram is called a <strong>bar chart</strong>. The length
                of each bar is proportional to the values that it represents.
            </p>
        </>,
        <>
            <p>
                For now, we are counting all messages that were recorded by
                Facebook. In the next round, we will try to also distinguish
                further e.g. between messages send and received or between
                messages by participants and system messages.
            </p>
        </>,
    ];

    return (
        <InfoScreen child1={messagesInfoText[0]} child2={messagesInfoText[1]} />
    );
};

export default MessagesScreen;
