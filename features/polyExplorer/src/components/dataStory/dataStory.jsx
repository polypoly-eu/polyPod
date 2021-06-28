import Scrollable from "../scrollable/scrollable";
import Screen from "../screen/screen";

import "dataStory.css";

const DataStory = ({ children }) => {
    return (
        <Screen className="story" light={true}>
            <Scrollable>{children}</Scrollable>
        </Screen>
    );
};

export default DataStory;
