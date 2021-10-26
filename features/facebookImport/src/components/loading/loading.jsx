import React from "react";

import i18n from "../../i18n.js";

import "./loading.css";

const Loading = ({ message, loadingGif }) => (
    <div className="loading">
        <img src={loadingGif} />
        <p>{message}...</p>
        <p>{i18n.t("common:loading.closing")}</p>
    </div>
);

export default Loading;
