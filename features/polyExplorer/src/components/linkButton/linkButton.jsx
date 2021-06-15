import React from "react";
import { useHistory } from "react-router-dom";

const LinkButton = ({ route, onClick, className, children }) => {
    const history = useHistory();

    const onClickButton = () => {
        history.push(route);
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
