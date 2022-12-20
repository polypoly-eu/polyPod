import React from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_HISTORY_STATE } from "@polypoly-eu/poly-look";

const RouteButton = ({
    route,
    stateChange,
    className,
    children,
    onClick = () => {},
}) => {
    const navigate = useNavigate();

    const newNavigateState = { ...INITIAL_HISTORY_STATE, ...stateChange };

    const onClickButton = () => {
        if (!route) return;

        onClick();
        if (route == "back") navigate(-1);
        else navigate(route, { state: newNavigateState });
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
