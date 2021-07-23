import React from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Introduction from "../../components/clusterStories/messengers/introduction.jsx";

const MessengerStory = () => {
    return (
        <DataStory progressBarColor="black" className="messenger">
            <Introduction></Introduction>
        </DataStory>
    );
};

export default MessengerStory;
