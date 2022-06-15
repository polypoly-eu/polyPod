import React from "react";

import "./base.css";

/** Overlay base covering the whole screen
 *
 * @param {jsx} children - Overlay content
 * @param {String} className - CSS classes added to overlay
 * @param {boolean} centered - adds CSS class that centers content
 * @returns
 */
const BaseOverlay = ({ children, className, opaque }) => {
  return (
    <div
      className={`base-overlay ${className || ""} ${opaque && "opaque"}`}
      data-testid="base-overlay-test"
    >
      {children}
    </div>
  );
};

export default BaseOverlay;
