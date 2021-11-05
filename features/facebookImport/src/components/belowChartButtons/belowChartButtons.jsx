import React from "react";

import "./belowChartButtons.css";

const BelowChartButtons = ({
    buttonsContent,
    activeButton,
    onButtonsClick,
}) => {
    return (
        <>
            {buttonsContent.map(({ id, translation }) => {
                return (
                    <button
                        className={
                            activeButton == id
                                ? "below-chart-button selected"
                                : "below-chart-button"
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

export default BelowChartButtons;
