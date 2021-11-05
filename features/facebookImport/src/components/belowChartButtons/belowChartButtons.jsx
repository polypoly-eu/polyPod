import React from "react";

import "./belowChartButtons.css";

const BelowChartButtons = ({
    buttonsContent,
    activeButton,
    onButtonsClick,
}) => {
    return (
        <>
            {buttonsContent.map((buttonContent) => {
                return (
                    <button
                        className={
                            activeButton == buttonContent
                                ? "below-chart-button selected"
                                : "below-chart-button"
                        }
                        onClick={onButtonsClick}
                        key={buttonContent}
                    >
                        {buttonContent}
                    </button>
                );
            })}
        </>
    );
};

export default BelowChartButtons;
