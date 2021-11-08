import React from "react";

import "./chartButtons.css";

const ChartButtons = ({ buttonsContent, activeButton, onButtonsClick }) => {
    return (
        <>
            {buttonsContent.map(({ id, translation }) => {
                return (
                    <button
                        className={
                            activeButton == id
                                ? "chart-button selected"
                                : "chart-button"
                        }
                        onClick={() => onButtonsClick(id)}
                        key={id}
                    >
                        {translation || id}
                    </button>
                );
            })}
        </>
    );
};

export default ChartButtons;
