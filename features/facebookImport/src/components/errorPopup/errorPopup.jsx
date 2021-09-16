import React from "react";

import "./errorPopup.css";

export default function ErrorPopup({ error, onClose }) {
    return (
        <div className="error-popup">
            <h1>An error occurred!</h1>
            <p>
                If you want to help us, please report it to
                feedback@polypoly.coop. While it is helpful for us if you
                include the concrete error message below, please ensure that it
                does not contain any of your personal data before sharing it
                with anyone. When in doubt, just save it, e.g. in a screenshot,
                and reach out to us without including it first.
            </p>
            <pre>{`${error.name}: ${error.message}\n\nCause:\n${error.cause}`}</pre>
            <button onClick={onClose}>Close</button>
        </div>
    );
}
