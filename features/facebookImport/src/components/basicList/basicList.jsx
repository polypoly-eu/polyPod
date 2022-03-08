import React from "react";

const BasicList = ({ label = null, items = [] }) => {
    return (
        <>
            {label || ""}
            <ul>
                {items.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        </>
    );
};

export default BasicList;
