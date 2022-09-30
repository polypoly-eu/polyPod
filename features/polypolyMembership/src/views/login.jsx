import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
    Screen,
    PolyButton,
    FixedFooter,
    NotificationBanner,
    notificationTypes,
} from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./login.css";

const CheckEmail = () => {
    return (
        <Screen className="login" layout="poly-standard-layout">
            <h1>{i18n.t("login:title.email")}</h1>
            <p>
                {i18n.t("login:text.3", {
                    email: "dev.example@polypoly.net",
                })}
            </p>
            <FixedFooter>
                <PolyButton label={i18n.t("login:button.email")} />
            </FixedFooter>
        </Screen>
    );
};

const Login = () => {
    const [login, setLogin] = useState("false");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState("false");

    function handleLogin(e) {
        e.preventDefault();
        // const emailId = document.getElementById("email-id").value;
        // const membershipId = document.getElementById("membership-id").value;

        if (email === "example@polypoly.net" && password === "0qwert") {
            setLogin("true");
            console.log("Yeeeeyyyhhh");
        } else {
            alert("nooo :(");
        }
    }

    return (
        <Screen className="login" layout="poly-standard-layout">
            {/* <NotificationBanner
                notificationType={notificationTypes.error}
                handleCloseNotification={() => setError("false")}
            >
                There was an error
            </NotificationBanner> */}
            <h1>{i18n.t("login:title.verify")}</h1>
            <p>{i18n.t("login:text.1")}</p>
            <p>{i18n.t("login:text.2")}</p>
            <form action="" method="post">
                <input
                    type="email"
                    id="email-id"
                    name="email"
                    placeholder={i18n.t("login:email")}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <legend className="helper">{i18n.t("login:legend.1")}</legend>
                <input
                    type="password"
                    id="membership-id"
                    name="membership-id"
                    placeholder={i18n.t("login:membership.id")}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <legend className="helper">{i18n.t("login:legend.2")}</legend>
            </form>
            <FixedFooter>
                <PolyButton
                    label={i18n.t("login:button.verify")}
                    onClick={handleLogin}
                />
            </FixedFooter>
        </Screen>
    );
};

export default Login;
