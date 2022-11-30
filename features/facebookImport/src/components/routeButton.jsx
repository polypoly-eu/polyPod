import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FacebookContext } from "../context/facebook-context.jsx";

const RouteButton = ({
    route,
    stateChange,
    className,
    children,
    onClick = () => {},
}) => {
    const { handleBack, changeNavigationState, navigationState } =
        useContext(FacebookContext);
    const navigate = useNavigate();

    let changedNavigationState = navigationState;

    const onClickButton = () => {
        onClick();
        if (stateChange)
            changedNavigationState = { ...navigationState, ...stateChange };
        if (route) {
            if (route == "back") handleBack();
            else navigate(route, changedNavigationState);
        }
        changeNavigationState(changedNavigationState);
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
