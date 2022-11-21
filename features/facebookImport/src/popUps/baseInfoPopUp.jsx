import React, { useContext } from "react";
import { FacebookContext } from "../context/facebook-context.jsx";
import { SideSwiper, SideSheet } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";
import popUps from "./infoPopUps";
import "./baseInfoPopUp.css";

const BaseInfoPopUp = () => {
    const { popUp, setPopUp } = useContext(FacebookContext);
    return (
        <SideSwiper
            onClose={() => setPopUp(null)}
            open={!!popUp}
            lastChildSelector=".poly-button"
            leftDistance="25vw"
            Component={(props) => (
                <SideSheet
                    title={i18n.t("baseInfoScreen:title1")}
                    okLabel={i18n.t("common:button.ok")}
                    {...props}
                >
                    <div className="base-info-contents">{popUps[popUp]}</div>
                </SideSheet>
            )}
        />
    );
};

export default BaseInfoPopUp;
