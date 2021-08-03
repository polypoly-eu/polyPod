import React from "react";
import { useHistory } from "react-router-dom";

const RouteButton = ({ route, stateChange, className, children, onClick }) => {
    const history = useHistory();

    function handleClick() {
        if (onClick) onClick();
        if (route == "back") history.goBack();
        history.push(route, stateChange);
    }

    return (
        <button className={className} onClick={handleClick}>
            {children}
        </button>
    );
};

export default RouteButton;
