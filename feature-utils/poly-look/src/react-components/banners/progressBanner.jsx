import React from "react";
import { ProgressIcon } from "./progressIcon.jsx";
import { IconButton } from "../buttons";

import "./progressBanner.css";

/** A banner with an dynamic icon, title, description and a button.
 * @param {Object} props
 * @param {number} [props.stage] - Used for changing the dynamic icon.
 * @param {string} [props.title] - String to be used for the title.
 * @param {string} [props.description] - String to be used for the description.
 * @param {callback} [props.onClick] - Button callback.
 * @returns {JSX.Element}
 */
export function ProgressBanner({ stage, title, description, onClick }) {
  return (
    <div className="poly-progress-banner">
      <div className="row">
        <ProgressIcon stage={stage} />
        <p className="title">{title}</p>
        <IconButton
          icon="question"
          fillDirection="left"
          className="info-button"
          onClick={onClick}
        />
      </div>
      <p className="description">{description}</p>
    </div>
  );
}
