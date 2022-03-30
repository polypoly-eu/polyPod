import React from "react";

import "./errorPopup.css";

const emailLink = `\
<a onclick="window.pod.polyNav.openUrl('support-email')">\
polypod-feedback@polypoly.coop\
</a>`;

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
