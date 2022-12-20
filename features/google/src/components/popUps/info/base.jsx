import React from "react";
import infoPopUps from "./";
import { SideSheet, SideSwiper } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./base.css";

const BaseInfoPopUp = ({ onClose, name }) => {
    return (
        <SideSwiper
            onClose={onClose}
            open={true}
            Component={(props) => (
                <SideSheet
                    title={i18n.t("commonInfoScreen:baseInfo.title1")}
                    okLabel={i18n.t("common:button.ok")}
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
