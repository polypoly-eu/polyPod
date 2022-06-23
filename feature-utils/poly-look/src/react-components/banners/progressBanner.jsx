import React from "react";
import { ProgressIcon } from "./progressIcon.jsx";
import { IconButton } from "../buttons";

import "./progressBanner.css";

export function ProgressBanner({ stage, title, description }) {
  return (
    <div className="poly-progress-banner">
      <ProgressIcon stage={stage} />
      <div className="contents">
        <p className="title">{title}</p>
        <p className="description">{description}</p>
      </div>
      <IconButton
        icon="question"
        fillDirection="left"
        className="info-button"
      />
    </div>
  );
}
