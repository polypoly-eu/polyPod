import React from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import "./messengerStory.css";

const MessengerStory = () => {
    return (
        <DataStory progressBarColor="black" className="messenger">
            <div className="messenger-story">
                <div className="messenger-parts"></div>
                <div className="messenger-parts">
                    <Introduction></Introduction>
                    <Summary></Summary>
                </div>
            </div>
        </DataStory>
    );
};

export default MessengerStory;
