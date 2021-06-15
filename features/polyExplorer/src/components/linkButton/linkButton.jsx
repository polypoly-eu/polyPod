import React from "react";
import { useHistory } from "react-router-dom";

const LinkButton = ({ route, onClick, className, children }) => {
    const history = useHistory();

    const onClickButton = () => {
        history.push(route);
        if (onClick) onClick();
    };

    return (
        <button onClick={() => onClickButton()} className={className}>
            <>{children}</>
        </button>
    );
};

export default LinkButton;
