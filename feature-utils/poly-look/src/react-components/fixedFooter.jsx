import React from "react";
import "./fixedFooter.css";

/**
 * Fixed container at the bottom at the screen.
 * If the Screen content is too long and is covered by this footer,
 * you might need to increase the padding-bottom of the screen to make the content visible.
 * @component
 * @param {Object} props
 * @param {JSX.Element} [props.children] JSX elements displayed inside the container.
 * @param {boolean} [props.gradient] Fade out band on the top of the container.
 * @returns {JSX.Element} A div with a className of either poly-fixed-footer-gradient or poly-fixed-footer
 * depending on the value of gradient passed.
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
