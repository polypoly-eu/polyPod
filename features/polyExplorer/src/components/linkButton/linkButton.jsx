import React from "react";
import { useHistory } from "react-router-dom";

const LinkButton = ({ route, onClick, className, children }) => {
    const history = useHistory();

    const onClickButton = (e) => {
        if (onClick) onClick(e);
        if (route == "back") history.goBack();
        else history.push(route);
    };

    return (
        <div
            onClick={(e) => onClickButton(e)}
            className={className + " link-button"}
        >
            <>{children}</>
        </div>
    );
};

export default LinkButton;
