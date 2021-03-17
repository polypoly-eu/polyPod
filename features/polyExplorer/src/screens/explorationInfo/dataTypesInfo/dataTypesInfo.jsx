import React from "react";

import Screen from "../../../components/screen/screen.jsx";

const DataTypesInfo = ({ onClose }) => {
    return (
        <Screen className="data-types-info" light={true}>
            <button onClick={() => onClose()}>back</button>
        </Screen>
    );
};

export default DataTypesInfo;
