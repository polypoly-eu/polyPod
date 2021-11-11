import React from "react";
import SharedDataTypeScreen from "./sharedDataTypeScreen.jsx";
import makeExampleData from "../../dataViz/makeExampleData";

const company = makeExampleData()[0];

export default {
    title: "sharedDataTypeScreen",
    component: SharedDataTypeScreen,
};

export const populated = () => <SharedDataTypeScreen company={company} />;
