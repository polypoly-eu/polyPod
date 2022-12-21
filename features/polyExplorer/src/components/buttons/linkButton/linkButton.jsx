import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

const LinkButton = ({
    route,
    stateChange = null,
    className,
    children,
    onClick = () => {},
}) => {
    const { navigationState, changeNavigationState, handleBack } =
        useContext(ExplorerContext);
    const navigate = useNavigate();
    let changedNavigationState = navigationState;

    const onClickButton = () => {
        onClick();
        if (stateChange)
            changedNavigationState = { ...navigationState, ...stateChange };
        if (route == "back") return handleBack();
        else navigate(route, { state: changedNavigationState });
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

export default LinkButton;
