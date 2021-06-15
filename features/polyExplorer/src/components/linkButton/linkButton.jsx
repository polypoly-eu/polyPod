import React from "react";
import { useHistory } from "react-router-dom";

const LinkButton = ({ route, onClick, className, children }) => {
    const history = useHistory();

    const onClickButton = () => {
        if (route == "back") history.goBack();
        else history.push(route);
        if (onClick) onClick();
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
