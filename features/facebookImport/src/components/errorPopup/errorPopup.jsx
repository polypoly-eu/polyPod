import React from "react";

import "./errorPopup.css";

function handleSendEmail() {
    window.pod.polyNav.openUrl("support-email");
}

export default function ErrorPopup({ error, onClose }) {
    return (
        <div className="error-popup">
            <h1>An error occurred!</h1>
            <pre>{`${error.name}: ${error.message}\n\nCause:\n${error.cause}`}</pre>
            <p>If you want to help us solve this problem, please:</p>
            <ol>
                <li>Take a screenshot that includes the error message above</li>
                <li>
                    Verify that it doesn&apos;t contain any private information
                </li>
                <li>
                    Send us an email to{" "}
                    <a onClick={handleSendEmail}>
                        polypod-feedback@polypoly.coop
                    </a>
                    , with the screenshot, and a brief explanation of what you
                    did before this error showed up
                </li>
            </ol>
            <p>Thank you!</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}
