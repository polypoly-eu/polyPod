import React from "react";
import { useHistory } from "react-router-dom";

const LinkButton = ({ route, onClick, className, children }) => {
    const history = useHistory();

    const onClickButton = (e) => {
        if (route == "back") history.goBack();
        else history.push(route);
        if (onClick) onClick(e);
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
