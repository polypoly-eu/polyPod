import React from "react";
import { Screen, PolyButton, FixedFooter } from "@polypoly-eu/poly-look";
import { useLocation } from "react-router-dom";
import i18n from "!silly-i18n";

import "./login.css";

const CheckEmail = () => {
    const location = useLocation();

    return (
        <Screen layout="poly-standard-layout">
            <h1>{i18n.t("login:title.email")}</h1>
            <p>
                {i18n.t("login:text.3", {
                    email: location.state.email,
                })}
            </p>
            <FixedFooter>
                <PolyButton label={i18n.t("login:button.email")} />
            </FixedFooter>
        </Screen>
    );
};

export default CheckEmail;
