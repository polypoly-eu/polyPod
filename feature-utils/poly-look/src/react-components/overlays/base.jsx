import React from "react";

import "./base.css";

/**
 * Overlay base covering the whole screen
 * @component
 * @param {JSX.Element} children - Overlay content
 * @param {string} className - CSS classes added to overlay
 * @param {boolean} centered - adds CSS class that centers content
 * @returns a div with a className of base-overlay, className, and opaque
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
