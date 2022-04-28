import React from "react";

import "./base.css";

/** Overlay base covering the whole screen
 *
 * @param {jsx} children - Overlay content
 * @param {String} className - CSS classes added to overlay
 * @param {boolean} centered - adds CSS class that centers content
 * @returns
 */
const BaseOverlay = ({ children, className, centered }) => {
  return (
    <div
      className={`base-overlay ${centered ? "centered" : ""} ${className}`}
      data-testid="base-overlay-test"
    >
      {children}
    </div>
  );
};

export default BaseOverlay;
