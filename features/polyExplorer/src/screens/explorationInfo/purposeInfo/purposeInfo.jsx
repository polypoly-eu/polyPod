import React from "react";

import Screen from "../../../components/screen/screen.jsx";

const PurposeInfo = ({ onClose }) => {
    return (
        <Screen className="purpose-info" light={true}>
            <button onClick={() => onClose()}>back</button>
        </Screen>
    );
};

export default PurposeInfo;
