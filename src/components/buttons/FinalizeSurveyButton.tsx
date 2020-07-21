import PolyButton from "./PolyButton";
import React from "react";
import { useHistory } from "react-router-dom";

export default function FinalizeSurveyButton({ title }) {
    const history = useHistory();

    return (
        <PolyButton
            title={title}
            onPress={() => {
                history.push("/survey-legal");
            }}
        />
    );
}
