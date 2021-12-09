import React, { useContext } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import Overview from "../../components/clusterStories/messengers/overview.jsx";
import Details from "../../components/clusterStories/messengers/details.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./messengerStory.css";

const MessengerStory = () => {
    const { products } = useContext(ExplorerContext);

    const listOfMessengerApps = [
        "Facebook Messenger",
        "WhatsApp",
        "Instagram",
        "Signal",
        "Snapchat",
        "Telegram",
        "Threema",
        "TikTok",
        "iMessage",
    ];

    return (
        <DataStory progressBarColor="black" className="messenger">
            <div className="messenger-parts">
                <Introduction
                    listOfMessengerApps={listOfMessengerApps}
                ></Introduction>
                <Summary></Summary>
                <Overview products={products}></Overview>
                <Details
                    data={products}
                    listOfMessengerApps={listOfMessengerApps}
                ></Details>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
