import React from "react";
import i18n from "../../../i18n.js";

import "./scrollButton.css";

const scrollButton = ({ light = false, activeIndex, screens, onClick }) => {
    return (
        <button
            className={
                (light ? "scroll-button-light" : "scroll-button") +
                (activeIndex === screens.length - 1
                    ? " scroll-button-hidden"
                    : "")
            }
            onClick={() => onClick()}
        >
            <img
                src={
                    light
                        ? "images/map-marker-alt_light.svg"
                        : "images/map-marker-alt_dark.svg"
                }
            />
            {"  "}
            {i18n.t("common:button.scroll")}
        </button>
    );
};

export default scrollButton;
