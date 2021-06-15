import React from "react";
import { Link } from "react-router-dom";

const PolyLink = ({ route, onClick, className, children }) => {
    const onClickLink = onClick;

    return (
        <Link to={route} onClick={onClickLink} className={className}>
            <>{children}</>
        </Link>
    );
};

export default PolyLink;
