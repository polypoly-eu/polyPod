import React from "react";
import infoPopUps from "./";
import { SideSheet, SideSwiper } from "@polypoly-eu/poly-look";

const BaseInfoPopUp = ({ onClose, name }) => {
    return (
        <SideSwiper
            onClose={onClose}
            open={true}
            lastChildSelector=".poly-button"
            Component={(props) => (
                <SideSheet title={"How to read this"} okLabel={"ok"} {...props}>
                    <div className="base-info-contents">
                        {infoPopUps[name]()}
                    </div>
                </SideSheet>
            )}
        ></SideSwiper>
    );
};

export default BaseInfoPopUp;
