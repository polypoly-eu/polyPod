import React from "react";
// import { useNavigate } from "react-router-dom";
import { Screen, PolyButton, FixedFooter } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

const Login = () => {
    // const navigate = useNavigate();

    return (
        <Screen className="login" layout="poly-standard-layout">
            <h1>{i18n.t("login:title")}</h1>
            <p>{i18n.t("login:text.1")}</p>
            <p>{i18n.t("login:text.2")}</p>
            <FixedFooter>
                <PolyButton label={i18n.t("login:primary.button")} />
            </FixedFooter>
        </Screen>
    );
};

export default Login;
