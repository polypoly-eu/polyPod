import React from "react";

import "./chartButtons.css";

const ChartButtons = ({ buttonsContent, activeButton, onButtonsClick }) => {
    return (
        <div>
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
        </div>
    );
};

export default ChartButtons;
