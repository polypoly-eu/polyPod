import React from "react";

// import i18n from "../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const DataStructureInfoScreen = () => {
    const dataStructureInfoText = [
        <>
            <p>
                This diagram shows the categories inside your Facebook data that
                we currently analyze and ranks them by how many data entries we
                found.
            </p>
            <p>
                This diagram is called a <strong>bubble chart</strong>. Each
                bubble represents one datatype. The number of bubbles shows how
                many data types there are. The size of each bubble is dependent
                on the amount of data inside.
            </p>
        </>,
        <p>
            Please note, that we are only using parts of your Facebook data for
            this analysis so far. So the numbers on this screen show a tendency,
            but not the total number in your download.
        </p>,
    ];

    return (
        <InfoScreen
            child1={dataStructureInfoText[0]}
            child2={dataStructureInfoText[1]}
        />
    );
};

export default DataStructureInfoScreen;
