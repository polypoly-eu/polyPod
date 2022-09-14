import React from "react";
import "./fixedFooter.css";

/**
 * Fixed container at the bottom at the screen.
 * If the Screen content is too long and is covered by this footer, you might need to increese the padding-bottom of the screen.
 * @param {jsx} children JSX elements displayed inside the container.
 * @param {boolean} gradient Fade out band on the top of the container.
 */

const FixedFooter = ({ children, gradient = true }) => {
  return (
    <div
      className={
        gradient
          ? "poly-fixed-footer poly-fixed-footer-gradient"
          : "poly-fixed-footer"
      }
    >
      {children}
    </div>
  );
};

export default FixedFooter;
