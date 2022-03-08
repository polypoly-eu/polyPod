import React from "react";

import i18n from "../../i18n.js";

import "./errorPopup.css";

const emailLink = `\
<a onclick="window.pod.polyNav.openUrl('support-email')">\
polypod-feedback@polypoly.coop\
</a>`;

export default function ErrorPopup({ error, onClose }) {
    return (
        <div className="error-popup">
            <h1>{i18n.t("errorPopup:title")}</h1>
            <pre>{`${error.name}: ${error.message}\n\nCause:\n${error.cause}`}</pre>
            <p>{i18n.t("errorPopup:instructions.intro")}</p>
            <ol
                dangerouslySetInnerHTML={{
                    __html: i18n
                        .t("errorPopup:instructions.steps", {
                            emailAddress: emailLink,
                        })
                        .split("\n")
                        .map((step) => `<li>${step}</li>`)
                        .join("\n"),
                }}
            ></ol>
            <p>{i18n.t("errorPopup:instructions.closing")}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}
