import React from "react";

import i18n from "../../i18n.js";

import "./loading.css";

const Loading = ({ message }) => (
    <div className="loading">
        <img src="./images/ajax-loader.gif" />
        <p>{message} ...</p>
        <p>{i18n.t("common:loading.closing")}</p>
    </div>
);

export default Loading;
