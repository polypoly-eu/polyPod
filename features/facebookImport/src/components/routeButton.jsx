import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { ImporterContext } from "../context/importer-context.jsx";

const RouteButton = ({
    route,
    stateChange,
    className,
    children,
    onClick = () => {},
}) => {
    const { handleBack, changeNavigationState, navigationState } =
        useContext(ImporterContext);
    const history = useHistory();

    let changedNavigationState = navigationState;

    const onClickButton = () => {
        onClick();
        if (stateChange)
            changedNavigationState = { ...navigationState, ...stateChange };
        if (route) {
            if (route == "back") handleBack();
            else history.push(route, changedNavigationState);
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
