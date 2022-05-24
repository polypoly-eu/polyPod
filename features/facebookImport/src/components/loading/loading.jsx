import React from "react";

import i18n from "!silly-i18n";

import "./loading.css";

const Loading = ({ message, loadingGif }) => (
    <div className="loading">
        <img src={loadingGif} />
        <p>{message}...</p>
        <p>{i18n.t("common:loading.closing")}</p>
    </div>
);

export default Loading;
