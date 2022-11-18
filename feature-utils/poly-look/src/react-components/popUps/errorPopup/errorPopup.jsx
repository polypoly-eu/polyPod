import React from "react";

import "./errorPopup.css";

const emailLink = `\
<a onclick="window.pod.polyNav.openUrl('support-email')">\
polypod-feedback@polypoly.coop\
</a>`;

/**
 * Callback for handling the click event to close button.
 *
 * @callback buttonCallback
 * @param {React.MouseEventHandler<HTMLButtonElement>} clickEvent - mouse onClick action.
 */

/**
 * It renders a popup with an error message and instructions on how to report the error
 * @param {Object} props
 * @param {Error} [props.error] the error raised
 * @param {buttonCallback} [props.onClose] Button callback.
 * @param {String} [props.text] The text popup message.
 * @returns A React component.
 */
export default function ErrorPopup({ error, onClose, text }) {
  return (
    <div className="error-popup">
      <h1>{text.title}</h1>
      <pre>{`${error.name}: ${error.message}\n\nCause:\n${error.cause}`}</pre>
      <p>{text.instructionsIntro}</p>
      <ol
        dangerouslySetInnerHTML={{
          __html: text.instructionsSteps
            .replace("{{emailAdress}}", emailLink)
            .split("\n")
            .map((step) => `<li>${step}</li>`)
            .join("\n"),
        }}
      ></ol>
      <p>{text.instructionsClosing}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
