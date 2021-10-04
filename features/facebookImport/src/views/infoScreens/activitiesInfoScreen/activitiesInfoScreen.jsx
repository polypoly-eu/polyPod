import React from "react";

// import i18n from "../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const ActivitiesInfoScreen = () => {
    const activitiesInfoText = [
        <>
            <p>
                This diagram shows the number of entries in your downloaded data
                with a time and date attached - and its development over time.
            </p>
            <p>
                This diagram is called a <strong>bar chart</strong>. The length
                of each bar is proportional to the values that it represents.
            </p>
        </>,
        <>
            <p>
                Please note, that we are only processing parts of your Facebook
                data for this analysis so far. So the numbers on this screen
                show a tendency, but not the total number in your download.
            </p>
            <p>
                The data with timestamps is not very consistent. In some cases,
                we do not have a timestamp where we would expect one. In another
                case, we saw a larger number of timestamps for watching a single
                advertising video. It seems that Facebook creates a timestamp
                every few seconds to check how long you watched.
            </p>
        </>,
    ];

    return (
        <InfoScreen
            child1={activitiesInfoText[0]}
            child2={activitiesInfoText[1]}
        />
    );
};

export default ActivitiesInfoScreen;
