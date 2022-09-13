import React from "react";
import "./fixedFooter.css";

/**
 * Fixed container at the bottom at the screen.
 * If the Screen content is too long and is covered by this footer, you might need to increese the padding-bottom of the screen.
 * @param {jsx} children JSX elements displayed inside the container.
 */

const FixedFooter = ({ children }) => {
  return <div className="poly-fixed-footer">{children}</div>;
};

export default FixedFooter;
