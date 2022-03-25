import React from "react";
import { useHistory } from "react-router-dom";
import { INITIAL_HISTORY_STATE } from "../../../constants/constants";

const RouteButton = ({
    route,
    stateChange,
    className,
    children,
    onClick = () => {},
}) => {
    const history = useHistory();

    const newHistoryState = { ...INITIAL_HISTORY_STATE, ...stateChange };

    const onClickButton = () => {
        if (!route) return;

        onClick();
        if (route == "back" && history.length > 1) history.goBack();
        else history.push(route, newHistoryState);
    };

    return (
        <div
            onClick={() => onClickButton()}
            className={className + " link-button"}
        >
            <>{children}</>
        </div>
    );
};
export default RouteButton;
