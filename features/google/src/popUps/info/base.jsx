import React from "react";
import infoPopUps from "./";
import { SideSheet, SideSwiper } from "@polypoly-eu/poly-look";

import "./base.css";

const BaseInfoPopUp = ({ onClose, name }) => {
    return (
        <SideSwiper
            onClose={onClose}
            open={true}
            lastChildSelector=".poly-button"
            leftDistance="25vw"
            Component={(props) => (
                <SideSheet
                    title={"How to read this"}
                    okLabel={"ok"}
                    {...props}
                    className="poly-theme-light"
                >
                    <div className="base-info-contents">
                        {infoPopUps[name]()}
                    </div>
                </SideSheet>
            )}
        ></SideSwiper>
    );
};

export default BaseInfoPopUp;
